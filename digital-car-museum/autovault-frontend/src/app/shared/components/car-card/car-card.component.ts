import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [RouterLink, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="car-card" [routerLink]="['/cars', car.id]">
      <div class="car-card__image">
        <img [src]="car.imageUrl || 'assets/placeholder-car.jpg'"
             [alt]="car.modelName"
             loading="lazy"
             (error)="onImgError($event)" />
        <div class="car-card__image-overlay"></div>
        <div class="car-card__badges">
          <span class="badge badge--3d" *ngIf="car.has3dModel">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1L9 3.5V6.5L5 9L1 6.5V3.5L5 1Z" stroke="currentColor" stroke-width="1.2"/>
            </svg>
            3D
          </span>
        </div>
        <span class="car-card__year">{{ car.year }}</span>
      </div>

      <div class="car-card__body">
        <p class="car-card__brand">{{ car.manufacturerName }}</p>
        <h3 class="car-card__name">{{ car.modelName }}</h3>
        <div class="car-card__specs">
          <span class="spec-chip" *ngIf="car.horsepower">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style="opacity:0.6">
              <circle cx="5" cy="5" r="3"/>
            </svg>
            {{ car.horsepower }} hp
          </span>
          <span class="spec-chip" *ngIf="car.bodyType">{{ car.bodyType }}</span>
          <span class="spec-chip spec-chip--fuel" *ngIf="car.fuelType">{{ car.fuelType }}</span>
        </div>
      </div>

      <div class="car-card__hover-line"></div>
    </a>
  `,
  styles: [`
    @use 'styles/variables' as *;

    .car-card {
      display: block;
      background: $gradient-dark-card;
      backdrop-filter: blur(20px);
      border: 1px solid $color-border;
      border-radius: $border-radius-lg;
      overflow: hidden;
      transition: transform $transition-normal, box-shadow $transition-normal, border-color $transition-normal;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      position: relative;

      &:hover {
        transform: translateY(-8px);
        border-color: rgba($color-accent, 0.35);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba($color-accent, 0.1);

        .car-card__image img { transform: scale(1.07); }
        .car-card__image-overlay { opacity: 0.4; }
        .car-card__hover-line { transform: scaleX(1); }
      }

      &__image {
        position: relative;
        aspect-ratio: 16/9;
        overflow: hidden;
        background: linear-gradient(135deg, $color-secondary, $color-tertiary);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform $transition-slow;
        }
      }

      &__image-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba($color-accent, 0.3) 0%, transparent 60%);
        opacity: 0;
        transition: opacity $transition-normal;
      }

      &__badges {
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        gap: 6px;
      }

      &__year {
        position: absolute;
        bottom: 10px;
        left: 10px;
        background: rgba($color-primary, 0.75);
        backdrop-filter: blur(8px);
        color: $color-accent-gold;
        font-size: 0.8rem;
        font-weight: 700;
        padding: 3px 10px;
        border-radius: $border-radius-sm;
        border: 1px solid rgba($color-accent-gold, 0.2);
        letter-spacing: 0.5px;
      }

      &__body {
        padding: 18px 20px 20px;
      }

      &__brand {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        background: $gradient-gold;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 4px;
        font-weight: 600;
      }

      &__name {
        font-size: 1.05rem;
        font-family: $font-display;
        margin-bottom: 12px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: $color-text-primary;
      }

      &__specs {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      &__hover-line {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: $gradient-accent;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform $transition-normal;
      }
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 1px;
      padding: 3px 8px;
      border-radius: $border-radius-sm;

      &--3d {
        background: $gradient-accent;
        color: white;
        box-shadow: 0 2px 8px rgba($color-accent, 0.4);
      }
    }

    .spec-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.72rem;
      color: $color-text-muted;
      background: rgba(255,255,255,0.06);
      border: 1px solid $color-border;
      padding: 2px 8px;
      border-radius: $border-radius-sm;
      white-space: nowrap;

      &--fuel { color: $color-accent-cyan; border-color: rgba($color-accent-cyan, 0.2); }
    }
  `]
})
export class CarCardComponent {
  @Input({ required: true }) car!: Car;

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/placeholder-car.jpg';
  }
}
