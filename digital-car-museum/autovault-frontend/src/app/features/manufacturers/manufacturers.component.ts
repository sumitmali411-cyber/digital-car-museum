import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Manufacturer } from '../../shared/models/manufacturer.model';
import { Country } from '../../shared/models/country.model';

@Component({
  selector: 'app-manufacturers',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mfr-page">

      <!-- Country Hero Banner -->
      <div class="country-banner">
        <div class="country-banner__bg"></div>
        <div class="country-banner__content container">
          <nav class="breadcrumb">
            <a routerLink="/countries">Countries</a>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>{{ country()?.name }}</span>
          </nav>

          <div class="country-banner__info" *ngIf="country()">
            <div class="country-banner__flag-wrap">
              <img [src]="country()!.flagUrl" [alt]="country()!.name" />
            </div>
            <div>
              <p class="country-banner__continent">{{ country()?.continent }}</p>
              <h1 class="country-banner__name">{{ country()?.name }}</h1>
              <p class="country-banner__desc">{{ country()?.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Manufacturers Grid -->
      <div class="container mfr-section">
        <div class="section-header">
          <h2 class="section-heading">Manufacturers</h2>
          <span class="count-badge" *ngIf="!loading()">{{ manufacturers().length }} brands</span>
        </div>

        <div class="mfr-grid" *ngIf="!loading(); else skeletons">
          <a class="mfr-card"
             *ngFor="let mfr of manufacturers(); let i = index"
             [routerLink]="['/manufacturers', mfr.id]"
             [style.--delay]="(i * 50) + 'ms'">

            <div class="mfr-card__logo-wrap">
              <img [src]="mfr.logoUrl || 'assets/placeholder-logo.svg'" [alt]="mfr.name" />
            </div>

            <div class="mfr-card__body">
              <h3 class="mfr-card__name">{{ mfr.name }}</h3>
              <p class="mfr-card__meta">Est. {{ mfr.foundedYear }} · {{ mfr.headquarters }}</p>
              <div class="mfr-card__footer">
                <span class="mfr-card__count">{{ mfr.carCount }} cars</span>
                <a [routerLink]="['/manufacturers', mfr.id, 'timeline']"
                   (click)="$event.stopPropagation()"
                   class="timeline-btn">Timeline →</a>
              </div>
            </div>

            <div class="mfr-card__accent"></div>
          </a>
        </div>

        <ng-template #skeletons>
          <div class="mfr-grid">
            <div class="skeleton" style="height: 100px; border-radius: 18px;"
                 *ngFor="let i of [1,2,3,4,5,6]"></div>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/variables' as *;

    // ── Country Banner ────────────────────────────────────────────────────────
    .country-banner {
      position: relative;
      padding: 64px 0 48px;
      overflow: hidden;

      &__bg {
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, $color-secondary 0%, $color-tertiary 100%);
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, $color-primary);
          opacity: 0.6;
        }
      }

      &__content {
        position: relative;
        z-index: 1;
      }

      &__info {
        display: flex;
        align-items: flex-start;
        gap: 28px;
        flex-wrap: wrap;
        margin-top: 24px;
      }

      &__flag-wrap {
        width: 90px;
        height: 60px;
        border-radius: $border-radius;
        overflow: hidden;
        border: 1px solid $color-border-bright;
        flex-shrink: 0;
        box-shadow: $shadow-md;

        img { width: 100%; height: 100%; object-fit: cover; }
      }

      &__continent {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 2.5px;
        background: $gradient-accent;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
        margin-bottom: 6px;
      }

      &__name {
        font-size: 2.5rem;
        font-family: $font-display;
        color: $color-text-primary;
        margin-bottom: 8px;
      }

      &__desc {
        color: $color-text-muted;
        font-size: 0.9rem;
        max-width: 600px;
        line-height: 1.6;
      }
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.82rem;
      color: $color-text-muted;

      a {
        color: $color-accent;
        transition: color $transition-fast;
        &:hover { color: $color-accent-warm; }
      }

      svg { opacity: 0.4; }
    }

    // ── Section Header ────────────────────────────────────────────────────────
    .mfr-section {
      padding: 56px 24px 80px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 32px;
    }

    .count-badge {
      font-size: 0.72rem;
      background: rgba($color-accent-cyan, 0.12);
      border: 1px solid rgba($color-accent-cyan, 0.25);
      color: $color-accent-cyan;
      padding: 3px 12px;
      border-radius: 20px;
      letter-spacing: 0.5px;
    }

    // ── Manufacturers Grid ────────────────────────────────────────────────────
    .mfr-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }

    .mfr-card {
      display: flex;
      align-items: center;
      gap: 18px;
      background: $gradient-dark-card;
      backdrop-filter: blur(20px);
      border: 1px solid $color-border;
      border-radius: $border-radius-lg;
      padding: 20px;
      text-decoration: none;
      color: inherit;
      position: relative;
      overflow: hidden;
      transition: transform $transition-normal, border-color $transition-normal, box-shadow $transition-normal;
      animation: card-in $transition-slow both;
      animation-delay: var(--delay, 0ms);

      &:hover {
        transform: translateX(6px);
        border-color: rgba($color-accent, 0.35);
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);

        .mfr-card__accent { opacity: 1; }
      }

      &__logo-wrap {
        width: 60px;
        height: 60px;
        flex-shrink: 0;
        background: white;
        border-radius: $border-radius;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        box-shadow: $shadow-sm;

        img { width: 100%; height: 100%; object-fit: contain; }
      }

      &__body { flex: 1; min-width: 0; }

      &__name {
        font-size: 1.05rem;
        font-family: $font-display;
        color: $color-text-primary;
        margin-bottom: 3px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      &__meta {
        font-size: 0.75rem;
        color: $color-text-muted;
        margin-bottom: 10px;
      }

      &__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      &__count {
        font-size: 0.72rem;
        background: $gradient-accent;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
      }

      &__accent {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: $gradient-accent;
        opacity: 0;
        transition: opacity $transition-normal;
      }
    }

    .timeline-btn {
      font-size: 0.72rem;
      background: $gradient-gold;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 600;
      transition: opacity $transition-fast;

      &:hover { opacity: 0.8; }
    }

    @keyframes card-in {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ManufacturersComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly manufacturers = signal<Manufacturer[]>([]);
  readonly country = signal<Country | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    const countryId = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getCountry(countryId).subscribe(c => this.country.set(c));
    this.api.getManufacturersByCountry(countryId).subscribe(list => {
      this.manufacturers.set(list);
      this.loading.set(false);
    });
  }
}
