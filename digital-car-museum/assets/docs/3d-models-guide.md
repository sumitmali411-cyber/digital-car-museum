# 3D Car Models — Sourcing & Creation Guide

This guide covers where to find free/open-source GLTF/GLB car models,
and how to create your own from photos when a model doesn't exist.

---

## Option A: Download Ready-Made GLTF/GLB Models

### 1. Sketchfab (Best First Stop)

**URL**: https://sketchfab.com/search?q=car&type=models&features=downloadable&licenses=322a749bcfa84ad3a81eba89b9dc4a44,b9ddc40b93e34cdca1fc152f39b9f375,72360a7d5a2a4a7d8a2c760e5c68c12e

Filter: `Downloadable = true`, `License = CC-BY or CC0`

**Best search terms**:
- `"ford mustang" car` → classic muscle cars
- `"mercedes w113 pagoda"` → vintage German
- `"ferrari 250 gto"` → iconic Italian
- `"toyota ae86"` → Japanese legends
- `car vintage 1950s` → early automotive era
- `car wireframe` → stylized low-poly

**Download process**:
1. Find model → click Download → select GLTF
2. If GLTF not available, download OBJ/FBX and convert (see Option C)
3. Run through Draco compression before storing (see Optimization section)

**License notes**: Most free models are CC-BY (attribution required). Add
attribution in the DB record `attribution` field.

---

### 2. Khronos glTF Sample Assets (Reference Quality)

**GitHub**: https://github.com/KhronosGroup/glTF-Sample-Assets
**Browser**: https://github.khronos.org/glTF-Assets/

Contains `ToyCar` — a production-quality, PBR-textured car model.
Great for testing your Three.js viewer before adding real models.

License: Various (check per model). Most are CC0 or CC-BY.

---

### 3. OpenGameArt — Car Kit (CC0)

**URL**: https://opengameart.org/content/car-kit

- 45+ vehicle types (sedans, vans, trucks, SUVs)
- 8 wheel variants
- 100% CC0 (no attribution needed)
- Available in FBX → convert to GLB via Blender (see Option C)

**Also**: https://opengameart.org/content/toy-car-kit

---

### 4. Free3D / TurboSquid / CGTrader (Free Tier)

- https://free3d.com/3d-models/car
- https://www.turbosquid.com/3d-model/free/car/gltf
- https://www.cgtrader.com/3d-models/car?free=1

Search for GLTF format specifically. Quality varies — preview in model viewer
before committing to the asset library.

---

### 5. Google Poly Archive (Historical Models)

**URL**: https://icosa.gallery (community-maintained archive)

Google Poly was shut down in 2021 but models were archived. Contains many
early-era car models in GLTF/OBJ format.

---

## Option B: Generate 3D from Photos (NeRF / Photogrammetry)

Use this when you have good photos of a car but no 3D model exists.

### B1. Luma AI (Easiest — Phone App)

**URL**: https://lumalabs.ai

**Workflow**:
1. Walk around the car in a smooth 360° arc, recording video
2. Upload to Luma AI app or web → auto-processes
3. Download as GLB/GLTF
4. Clean up in Blender (remove background, optimize geometry)
5. Compress with Draco → save to assets

**Best for**: Modern cars you have physical access to.
**Quality**: Very good for exteriors, poor for interiors (occluded surfaces).

---

### B2. Meshroom (Free, High Quality — Offline Photogrammetry)

**URL**: https://alicevision.org/#meshroom

**Workflow**:
1. Take 80–150 photos of the car from all angles (overlap is key)
2. Import photos into Meshroom
3. Run the default pipeline (Feature Extraction → SfM → Meshing → Texturing)
4. Import result (.obj + textures) into Blender
5. Clean mesh, bake PBR textures, export as GLB
6. Apply Draco compression

**Requirements**: NVIDIA GPU with CUDA (CPU mode is very slow)
**Best for**: Museum exhibits, archived/classic cars you can photograph

**Reference photos needed**:
- Minimum: 80 photos
- Ideal: 150–200 photos
- Cover: all 4 sides, top, front/rear, wheels, undercarriage if accessible
- Lighting: overcast or evenly lit (avoid harsh shadows)

---

### B3. Stable Zero123 (Single Image → 3D)

**GitHub**: https://github.com/Stability-AI/stablediffusion
**Try it**: https://huggingface.co/spaces/stabilityai/stable-zero123

**Workflow**:
1. Provide a single clean side-view image of the car
2. Model generates multi-view predictions
3. Export and refine in Blender

**Quality**: Lower than photogrammetry but useful for historic cars with only
old photographs available. Good for stylized/wireframe aesthetic.

---

### B4. Point-E / Shap-E (OpenAI — Text or Image to 3D)

- **Point-E**: https://github.com/openai/point-e (point cloud output)
- **Shap-E**: https://github.com/openai/shap-e (mesh output, better for cars)

```bash
# Install Shap-E
pip install git+https://github.com/openai/shap-e#egg=shap_e

# Generate from image
python -c "
from shap_e.diffusion.sample import sample_latents
from shap_e.util.notebooks import create_pan_cameras, decode_latent_mesh
# ... see Shap-E README for full example
"
```

**Best for**: Quick low-poly placeholders, stylized museum art direction.

---

## Option C: Convert Existing Models to GLB

### FBX/OBJ → GLB via Blender (Recommended)

1. Open Blender (free: https://www.blender.org)
2. File → Import → the format you have (FBX, OBJ, DAE)
3. Clean up:
   - Remove duplicate vertices: Mesh → Merge by Distance
   - Recalculate normals: Mesh → Normals → Recalculate Outside
   - Apply scale/rotation: Object → Apply → All Transforms
4. Set up PBR materials (Principled BSDF)
5. File → Export → glTF 2.0 (.glb/.gltf)
   - Format: **GLB** (single binary file)
   - Include: Meshes, Materials, Textures
   - Geometry: ✓ Apply Modifiers, ✓ UVs, ✓ Normals

### Draco Compression

After export, apply Draco compression to reduce GLB size by 60–90%:

```bash
# Compress with Draco using npx (avoids global install)
npx gltf-pipeline -i input.glb -o output.glb --draco.compressionLevel 7

# Validate the result
npx gltf-validator output.glb
```

Target: < 10 MB for most cars. Max 50 MB per project limit.

---

## Option D: Create Wire-Frame / Stylized Models (Subproject)

When neither download nor photogrammetry is available, we create stylized
wireframe models from reference images. This is a subproject but worth
considering for very rare/historic cars.

### D1. Modeling from Reference Images in Blender

**Workflow**:
1. Find 3 orthographic reference images: front, side, top
   - Sources: owner's manuals, Wikipedia commons, manufacturer press kits
2. In Blender, set up reference images as background planes
3. Model a low-poly base mesh matching the silhouette
4. Subdivide and sculpt to match proportions
5. UV unwrap, add simple material
6. Export as GLB

**Reference image sources**:
- Wikipedia Commons: https://commons.wikimedia.org/wiki/Commons:WikiProject_Automobiles
- Wikimedia category search: e.g. `Category:Toyota 2000GT`
- HVA (Heidelberg Vehicle Archive): high-quality scan blueprints
- carblueprints.info (orthographic drawings, check license)

### D2. Blueprint-Based Modeling

Automotive blueprints provide clean orthographic views perfect for modeling:

1. Download blueprint from https://www.the-blueprints.com (free registration)
   or https://carblueprints.info
2. Import into Blender as background images (top, side, front views)
3. Block out the body panels using box modeling
4. Add wheels, glass, headlights as separate objects
5. Keep polygon count under 50k triangles for web performance
6. Export GLB + apply Draco

### D3. AI-Assisted Reference Generation

For cars with limited photos:
1. Use Stable Diffusion with car ControlNet to generate clean orthographic views
2. Use those as modeling references
3. Model in Blender → export GLB

---

## Optimization Checklist Before Adding to Library

- [ ] GLB format (not GLTF + separate files)
- [ ] Draco compressed (`gltf-pipeline`)
- [ ] File size < 50 MB (target < 10 MB)
- [ ] Y-up orientation (standard GLTF)
- [ ] Scale is real-world (1 unit = 1 meter)
- [ ] Textures: max 2048×2048px per map
- [ ] PBR materials (Metallic-Roughness workflow)
- [ ] No leftover bones/armatures (unless animated)
- [ ] Validated with `npx gltf-validator`
- [ ] Attribution noted in filename comment or separate .txt

---

## Recommended Tools (All Free)

| Tool | Purpose | URL |
|------|---------|-----|
| Blender 4.x | Modeling, conversion, export | blender.org |
| Meshroom | Photogrammetry from photos | alicevision.org |
| Luma AI | NeRF from video | lumalabs.ai |
| gltf-pipeline | Draco compression | npm gltf-pipeline |
| gltf-validator | Validate GLB | npm gltf-validator |
| Three.js Editor | Quick preview | threejs.org/editor |
| Khronos glTF Viewer | PBR-accurate preview | gltf-viewer.donmccurdy.com |

---

## Three.js Integration Notes

The `CarModelViewerComponent` uses:
- `GLTFLoader` + `DRACOLoader` (path: `/draco/`)
- `RGBELoader` for HDRI environment lighting
- `OrbitControls` for interaction
- `MeshStandardMaterial.color` for color swapping at runtime

Ensure your models use `MeshStandardMaterial` (PBR) so color swapping works
correctly. Models using `MeshBasicMaterial` will not respond to lighting.
