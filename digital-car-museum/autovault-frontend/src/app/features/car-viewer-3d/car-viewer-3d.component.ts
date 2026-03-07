import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, inject, signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ApiService } from '../../core/services/api.service';
import { Car, CarColor, Model3D } from '../../shared/models/car.model';

interface CameraPreset {
  label: string;
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: CameraPreset[] = [
  { label: 'Front',    position: [0, 1.2, 4],    target: [0, 0.5, 0] },
  { label: 'Side',     position: [4, 1.2, 0],    target: [0, 0.5, 0] },
  { label: 'Rear',     position: [0, 1.2, -4],   target: [0, 0.5, 0] },
  { label: 'Top',      position: [0, 5, 0.001],  target: [0, 0, 0]   },
  { label: 'Quarter',  position: [3, 1.5, 3],    target: [0, 0.5, 0] },
];

@Component({
  selector: 'app-car-viewer-3d',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="viewer-wrapper">
      <!-- Canvas -->
      <canvas #canvas class="viewer-canvas"></canvas>

      <!-- Loading Overlay -->
      <div class="loading-overlay" *ngIf="loading()">
        <div class="loading-spinner"></div>
        <p>Loading 3D Model...</p>
        <div class="progress-bar">
          <div class="progress-bar__fill" [style.width.%]="loadProgress()"></div>
        </div>
      </div>

      <!-- No Model Fallback -->
      <div class="no-model" *ngIf="!loading() && !modelLoaded()">
        <p>No 3D model available for this car.</p>
        <a [routerLink]="['/cars', carId()]" class="btn btn-secondary">← Back to Car</a>
      </div>

      <!-- HUD Controls -->
      <div class="hud" *ngIf="modelLoaded()">
        <!-- Top bar -->
        <div class="hud__top">
          <a [routerLink]="['/cars', carId()]" class="back-btn">← Back</a>
          <h2 class="car-title" *ngIf="car()">
            {{ car()!.year }} {{ car()!.manufacturerName }} {{ car()!.modelName }}
          </h2>
          <button class="screenshot-btn" (click)="takeScreenshot()">📷</button>
        </div>

        <!-- Camera Presets -->
        <div class="hud__presets">
          <button
            *ngFor="let preset of presets; let i = index"
            class="preset-btn"
            [class.active]="activePreset() === i"
            (click)="applyPreset(i)">
            {{ preset.label }}
          </button>
        </div>

        <!-- Color Picker -->
        <div class="hud__colors" *ngIf="car()?.colors?.length">
          <span class="hud__colors-label">Color</span>
          <button
            *ngFor="let color of car()!.colors"
            class="color-btn"
            [style.background]="color.hexCode"
            [title]="color.name"
            (click)="applyColor(color)">
          </button>
          <button class="color-btn reset-color" title="Original" (click)="resetColor()">↺</button>
        </div>

        <!-- Controls hint -->
        <div class="hud__hint">
          <span>🖱 Rotate · Scroll Zoom · Right-click Pan</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @use 'sass:color';
    @use 'styles/variables' as *;

    .viewer-wrapper {
      position: fixed;
      inset: 0;
      background: #000;
      z-index: $z-overlay;
    }

    .viewer-canvas {
      width: 100% !important;
      height: 100% !important;
      display: block;
    }

    .loading-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba($color-primary, 0.9);
      gap: 16px;
      z-index: 1;

      p { color: $color-text-primary; font-size: 1rem; }
    }

    .loading-spinner {
      width: 48px;
      height: 48px;
      border: 3px solid rgba($color-accent, 0.3);
      border-top-color: $color-accent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .progress-bar {
      width: 200px;
      height: 4px;
      background: rgba(white, 0.1);
      border-radius: 2px;
      overflow: hidden;

      &__fill {
        height: 100%;
        background: $color-accent;
        transition: width 0.2s ease;
      }
    }

    .no-model {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      color: rgba($color-text-primary, 0.6);
    }

    .hud {
      position: absolute;
      inset: 0;
      pointer-events: none;

      &__top {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        background: linear-gradient(to bottom, rgba($color-primary, 0.8), transparent);
        pointer-events: auto;
      }

      &__presets {
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        pointer-events: auto;
      }

      &__colors {
        position: absolute;
        right: 24px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        pointer-events: auto;
      }

      &__colors-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: rgba($color-text-primary, 0.6);
        writing-mode: vertical-rl;
        text-orientation: mixed;
        margin-bottom: 4px;
      }

      &__hint {
        position: absolute;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.75rem;
        color: rgba($color-text-primary, 0.4);
        white-space: nowrap;
      }
    }

    .back-btn {
      color: $color-text-primary;
      background: rgba($color-primary, 0.7);
      border: 1px solid rgba(white, 0.1);
      padding: 8px 16px;
      border-radius: $border-radius;
      font-size: 0.85rem;
      cursor: pointer;
      text-decoration: none;
      transition: background $transition-fast;

      &:hover { background: $color-secondary; }
    }

    .car-title {
      font-size: 1rem;
      font-weight: 600;
      color: $color-text-primary;
    }

    .screenshot-btn {
      background: rgba($color-primary, 0.7);
      border: 1px solid rgba(white, 0.1);
      color: $color-text-primary;
      padding: 8px 12px;
      border-radius: $border-radius;
      cursor: pointer;
      font-size: 1rem;
      transition: background $transition-fast;

      &:hover { background: $color-secondary; }
    }

    .preset-btn {
      background: rgba($color-primary, 0.8);
      border: 1px solid rgba(white, 0.15);
      color: $color-text-primary;
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all $transition-fast;

      &:hover, &.active {
        background: $color-accent;
        border-color: $color-accent;
      }
    }

    .color-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      border: 2px solid rgba(white, 0.2);
      cursor: pointer;
      transition: transform $transition-fast, border-color $transition-fast;

      &:hover { transform: scale(1.25); border-color: white; }

      &.reset-color {
        background: rgba($color-secondary, 0.9);
        color: $color-text-primary;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  `]
})
export class CarViewer3dComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly carId = signal<number>(0);
  readonly car = signal<Car | null>(null);
  readonly loading = signal(true);
  readonly loadProgress = signal(0);
  readonly modelLoaded = signal(false);
  readonly activePreset = signal(0);

  readonly presets = CAMERA_PRESETS;

  // Three.js internals
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;
  private composer!: EffectComposer;
  private animFrameId = 0;
  private carMeshes: THREE.Mesh[] = [];
  private originalColors = new Map<THREE.Mesh, THREE.Color>();

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carId.set(id);
    this.api.getCar(id).subscribe(car => this.car.set(car));
  }

  ngAfterViewInit(): void {
    this.initScene();
    this.loadModel();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animFrameId);
    this.disposeScene();
    this.renderer?.dispose();
    window.removeEventListener('resize', this.onResize);
  }

  private initScene(): void {
    const canvas = this.canvasRef.nativeElement;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0d1b2a);
    this.scene.fog = new THREE.Fog(0x0d1b2a, 20, 60);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.2, 4);

    // Controls
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 1.5;
    this.controls.maxDistance = 12;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.1;
    this.controls.target.set(0, 0.5, 0);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 1.5);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    this.scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x9bb0cf, 0.6);
    fillLight.position.set(-5, 3, -3);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xe63946, 0.3);
    rimLight.position.set(0, 2, -6);
    this.scene.add(rimLight);

    // Ground plane (reflective)
    const groundGeo = new THREE.CircleGeometry(8, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1b3a5c,
      roughness: 0.3,
      metalness: 0.5,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Grid helper
    const grid = new THREE.GridHelper(16, 32, 0x1b3a5c, 0x1b3a5c);
    (grid.material as THREE.Material).opacity = 0.3;
    (grid.material as THREE.Material).transparent = true;
    this.scene.add(grid);

    // Post-processing
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight), 0.3, 0.4, 0.85
    );
    this.composer.addPass(bloomPass);

    // Resize handler
    window.addEventListener('resize', this.onResize);

    // Start render loop
    this.animate();
  }

  private loadModel(): void {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    const modelUrl = this.api.getModel3DUrl(this.carId());

    gltfLoader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;

        // Center model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        model.position.sub(center);
        model.position.y += size.y / 2;

        // Scale to reasonable size
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 5) model.scale.setScalar(5 / maxDim);

        // Enable shadows, collect meshes
        model.traverse(child => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.carMeshes.push(mesh);
            if ((mesh.material as THREE.MeshStandardMaterial).color) {
              this.originalColors.set(mesh, (mesh.material as THREE.MeshStandardMaterial).color.clone());
            }
          }
        });

        this.scene.add(model);
        this.loading.set(false);
        this.modelLoaded.set(true);
      },
      (progress) => {
        if (progress.total > 0) {
          this.loadProgress.set(Math.round((progress.loaded / progress.total) * 100));
        }
      },
      (_error) => {
        // No model available
        this.loading.set(false);
        this.modelLoaded.set(false);
      }
    );
  }

  applyPreset(index: number): void {
    const preset = CAMERA_PRESETS[index];
    this.activePreset.set(index);
    this.camera.position.set(...preset.position);
    this.controls.target.set(...preset.target);
    this.controls.update();
  }

  applyColor(color: CarColor): void {
    const threeColor = new THREE.Color(color.hexCode);
    this.carMeshes.forEach(mesh => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat.color) mat.color.set(threeColor);
    });
  }

  resetColor(): void {
    this.carMeshes.forEach(mesh => {
      const original = this.originalColors.get(mesh);
      if (original) {
        (mesh.material as THREE.MeshStandardMaterial).color.copy(original);
      }
    });
  }

  takeScreenshot(): void {
    this.renderer.render(this.scene, this.camera);
    const url = this.renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `autovault-${this.car()?.modelName ?? 'car'}-${Date.now()}.png`;
    a.click();
  }

  private animate = (): void => {
    this.animFrameId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.composer.render();
  };

  private onResize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer.setSize(w, h);
  };

  private disposeScene(): void {
    this.scene?.traverse(obj => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          (mesh.material as THREE.Material).dispose();
        }
      }
    });
  }
}
