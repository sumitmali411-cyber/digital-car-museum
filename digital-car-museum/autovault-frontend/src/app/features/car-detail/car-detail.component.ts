import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf, CurrencyPipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Car } from '../../shared/models/car.model';

@Component({
  selector: 'app-car-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="car-detail" *ngIf="car(); else loading">
      <!-- Hero Image -->
      <div class="car-hero">
        <img [src]="car()!.imageUrl || 'assets/placeholder-car.jpg'"
             [alt]="car()!.modelName" class="car-hero__img" />
        <div class="car-hero__overlay">
          <div class="container">
            <nav class="breadcrumb">
              <a routerLink="/countries">Countries</a> /
              <a [routerLink]="['/countries', car()!.countryId, 'manufacturers']">{{ car()!.countryName }}</a> /
              <a [routerLink]="['/manufacturers', car()!.manufacturerId]">{{ car()!.manufacturerName }}</a> /
              <span>{{ car()!.modelName }}</span>
            </nav>
            <h1 class="car-hero__title">
              {{ car()!.year }} {{ car()!.manufacturerName }} {{ car()!.modelName }}
            </h1>
            <p *ngIf="car()!.generation" class="generation">{{ car()!.generation }}</p>
            <div class="car-hero__actions">
              <a *ngIf="car()!.has3dModel"
                 [routerLink]="['/cars', car()!.id, 'viewer']"
                 class="btn btn-primary">View in 3D</a>
              <a [routerLink]="['/manufacturers', car()!.manufacturerId, 'timeline']"
                 class="btn btn-secondary">View Timeline</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Specs + Info -->
      <div class="container car-content">
        <div class="specs-grid">
          <div class="specs-card">
            <h2>Specifications</h2>
            <dl class="specs-list">
              <div class="spec-row" *ngIf="car()!.engineType">
                <dt>Engine</dt><dd>{{ car()!.engineType }}</dd>
              </div>
              <div class="spec-row" *ngIf="car()!.horsepower">
                <dt>Power</dt><dd>{{ car()!.horsepower }} hp</dd>
              </div>
              <div class="spec-row" *ngIf="car()!.torque">
                <dt>Torque</dt><dd>{{ car()!.torque }}</dd>
              </div>
              <div class="spec-row" *ngIf="car()!.transmission">
                <dt>Transmission</dt><dd>{{ car()!.transmission }}</dd>
              </div>
              <div class="spec-row" *ngIf="car()!.drivetrain">
                <dt>Drivetrain</dt><dd>{{ car()!.drivetrain }}</dd>
              </div>
              <div class="spec-row" *ngIf="car()!.fuelType">
                <dt>Fuel</dt><dd>{{ car()!.fuelType }}</dd>
              </div>
              <div class="spec-row" *ngIf="car()!.topSpeedKmh">
                <dt>Top Speed</dt><dd>{{ car()!.topSpeedKmh }} km/h</dd>
              </div>
              <div class="spec-row" *ngIf="car()!.acceleration0100">
                <dt>0–100 km/h</dt><dd>{{ car()!.acceleration0100 }}s</dd>
              </div>
              <div class="spec-row" *ngIf="car()!.weightKg">
                <dt>Weight</dt><dd>{{ car()!.weightKg }} kg</dd>
              </div>
              <div class="spec-row" *ngIf="car()!.bodyType">
                <dt>Body Type</dt><dd>{{ car()!.bodyType }}</dd>
              </div>
              <div class="spec-row" *ngIf="car()!.priceUsd">
                <dt>Price (USD)</dt><dd>{{ car()!.priceUsd | currency }}</dd>
              </div>
            </dl>
          </div>

          <div class="info-column">
            <div class="description-card" *ngIf="car()!.description">
              <h2>About</h2>
              <p>{{ car()!.description }}</p>
            </div>

            <!-- Available Colors -->
            <div class="colors-card" *ngIf="car()!.colors?.length">
              <h2>Available Colors</h2>
              <div class="colors">
                <div class="color-swatch"
                     *ngFor="let color of car()!.colors"
                     [style.background]="color.hexCode"
                     [title]="color.name">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gallery -->
        <div class="gallery" *ngIf="car()!.galleryUrls?.length">
          <h2>Gallery</h2>
          <div class="gallery__grid">
            <img *ngFor="let url of car()!.galleryUrls"
                 [src]="url" [alt]="car()!.modelName"
                 loading="lazy" class="gallery__img" />
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="container" style="padding: 60px 24px; text-align: center;">Loading...</div>
    </ng-template>
  `,
  styles: [`
    @use 'sass:color';
    @use 'styles/variables' as *;

    .car-hero {
      position: relative;
      height: 70vh;
      min-height: 400px;
      overflow: hidden;

      &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      &__overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba($color-primary, 0.95) 0%, transparent 60%);
        display: flex;
        align-items: flex-end;
        padding-bottom: 48px;
      }

      &__title {
        font-size: clamp(1.5rem, 4vw, 3rem);
        margin-bottom: 8px;
      }

      &__actions { display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; }
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 0.8rem;
      color: rgba($color-text-primary, 0.7);
      flex-wrap: wrap;
      a { color: $color-accent; }
    }

    .generation {
      color: $color-accent-gold;
      font-size: 0.9rem;
    }

    .car-content { padding: 60px 24px; }

    .specs-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin-bottom: 48px;

      @media (max-width: 768px) { grid-template-columns: 1fr; }
    }

    .specs-card, .description-card, .colors-card {
      background: $color-secondary;
      border-radius: $border-radius-lg;
      padding: 28px;
      margin-bottom: 24px;

      h2 { font-size: 1.2rem; color: $color-accent-gold; margin-bottom: 20px; }
    }

    .specs-list { display: flex; flex-direction: column; gap: 0; }

    .spec-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid rgba($color-text-primary, 0.08);

      &:last-child { border-bottom: none; }

      dt { color: rgba($color-text-primary, 0.6); font-size: 0.85rem; }
      dd { font-weight: 600; font-size: 0.9rem; }
    }

    .description-card p {
      color: rgba($color-text-primary, 0.8);
      line-height: 1.8;
    }

    .colors {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .color-swatch {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid rgba(white, 0.2);
      cursor: pointer;
      transition: transform $transition-fast;

      &:hover { transform: scale(1.2); }
    }

    .gallery {
      h2 { font-size: 1.5rem; color: $color-accent-gold; margin-bottom: 24px; }

      &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
      }

      &__img {
        width: 100%;
        aspect-ratio: 16/9;
        object-fit: cover;
        border-radius: $border-radius;
        transition: transform $transition-normal;

        &:hover { transform: scale(1.03); }
      }
    }
  `]
})
export class CarDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  readonly car = signal<Car | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getCar(id).subscribe(c => this.car.set(c));
  }
}
