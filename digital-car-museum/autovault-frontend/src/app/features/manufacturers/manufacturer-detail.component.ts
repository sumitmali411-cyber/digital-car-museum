import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Manufacturer } from '../../shared/models/manufacturer.model';
import { Car, PagedResponse } from '../../shared/models/car.model';
import { CarCardComponent } from '../../shared/components/car-card/car-card.component';

@Component({
  selector: 'app-manufacturer-detail',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, CarCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mfr-detail" *ngIf="manufacturer(); else loadingTpl">

      <!-- ── Hero ────────────────────────────────────────────────────────── -->
      <div class="mfr-hero">
        <div class="mfr-hero__orb mfr-hero__orb--1"></div>
        <div class="mfr-hero__orb mfr-hero__orb--2"></div>
        <div class="mfr-hero__grid"></div>

        <div class="mfr-hero__inner container">
          <nav class="breadcrumb">
            <a routerLink="/countries">Countries</a>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <a [routerLink]="['/countries', manufacturer()!.countryId, 'manufacturers']">
              {{ manufacturer()!.countryName }}
            </a>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 2l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>{{ manufacturer()!.name }}</span>
          </nav>

          <div class="mfr-hero__profile">
            <div class="mfr-hero__logo">
              <img [src]="manufacturer()!.logoUrl || 'assets/placeholder-logo.svg'"
                   [alt]="manufacturer()!.name" />
            </div>
            <div class="mfr-hero__info">
              <p class="mfr-hero__tag">Manufacturer · {{ manufacturer()!.countryName }}</p>
              <h1 class="mfr-hero__name">{{ manufacturer()!.name }}</h1>
              <p class="mfr-hero__meta">
                Founded {{ manufacturer()!.foundedYear }}
                <ng-container *ngIf="manufacturer()!.founderName">
                  by {{ manufacturer()!.founderName }}
                </ng-container>
                <ng-container *ngIf="manufacturer()!.headquarters">
                  · {{ manufacturer()!.headquarters }}
                </ng-container>
              </p>
              <div class="mfr-hero__actions">
                <a [routerLink]="['/manufacturers', manufacturer()!.id, 'timeline']"
                   class="btn btn-primary">View Timeline</a>
                <a [href]="manufacturer()!.websiteUrl" target="_blank" rel="noopener"
                   class="btn btn-secondary" *ngIf="manufacturer()!.websiteUrl">Website ↗</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── History ──────────────────────────────────────────────────────── -->
      <section class="container history-section" *ngIf="manufacturer()!.history">
        <div class="history-card glass">
          <div class="history-card__label">
            <span class="label-dot-gold"></span>
            History
          </div>
          <p class="history-card__text">{{ manufacturer()!.history }}</p>
        </div>
      </section>

      <!-- ── Cars Grid ────────────────────────────────────────────────────── -->
      <section class="container cars-section">
        <div class="cars-section__header">
          <h2 class="section-heading">Models</h2>
          <span class="cars-count" *ngIf="cars().length > 0">{{ cars().length }} shown</span>
        </div>

        <div class="cars-grid" *ngIf="cars().length > 0; else noCars">
          <app-car-card *ngFor="let car of cars()" [car]="car" />
        </div>

        <ng-template #noCars>
          <div class="empty-state glass">
            <span class="empty-state__icon">🏎️</span>
            <p>No cars available yet for this manufacturer.</p>
            <span class="empty-state__hint">Try seeding the database using the seed profile.</span>
          </div>
        </ng-template>

        <div class="load-more" *ngIf="!pagedResponse()?.last">
          <button class="btn btn-secondary" (click)="loadMore()" [disabled]="loadingMore()">
            {{ loadingMore() ? 'Loading...' : 'Load More Models' }}
          </button>
        </div>
      </section>
    </div>

    <ng-template #loadingTpl>
      <div class="container" style="padding: 80px 24px; text-align: center; color: var(--color-text-muted);">
        Loading...
      </div>
    </ng-template>
  `,
  styles: [`
    @use 'styles/variables' as *;

    // ── Hero ──────────────────────────────────────────────────────────────────
    .mfr-hero {
      position: relative;
      padding: 72px 0 56px;
      overflow: hidden;
      background: $gradient-hero;

      &__orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(70px);
        pointer-events: none;

        &--1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba($color-accent, 0.18) 0%, transparent 70%);
          top: -100px; right: -100px;
        }

        &--2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba($color-accent-gold, 0.12) 0%, transparent 70%);
          bottom: -80px; left: 10%;
        }
      }

      &__grid {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
        background-size: 48px 48px;
      }

      &__inner {
        position: relative;
        z-index: 1;
      }

      &__profile {
        display: flex;
        align-items: flex-start;
        gap: 32px;
        flex-wrap: wrap;
        margin-top: 28px;
      }

      &__logo {
        width: 110px;
        height: 110px;
        background: white;
        border-radius: $border-radius-lg;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 14px;
        box-shadow: $shadow-lg;
        flex-shrink: 0;

        img { width: 100%; height: 100%; object-fit: contain; }
      }

      &__tag {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        background: $gradient-accent;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
        margin-bottom: 6px;
      }

      &__name {
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-family: $font-display;
        color: $color-text-primary;
        margin-bottom: 8px;
        line-height: 1.1;
      }

      &__meta {
        color: $color-text-muted;
        font-size: 0.875rem;
        margin-bottom: 24px;
      }

      &__actions { display: flex; gap: 12px; flex-wrap: wrap; }
      &__info { flex: 1; }
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
      color: $color-text-muted;

      a {
        color: $color-accent;
        transition: color $transition-fast;
        &:hover { color: $color-accent-warm; }
      }

      svg { opacity: 0.3; }
    }

    // ── History ───────────────────────────────────────────────────────────────
    .history-section { padding: 48px 24px; }

    .history-card {
      padding: 32px;

      &__label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        background: $gradient-gold;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
        margin-bottom: 18px;
      }

      &__text {
        color: $color-text-muted;
        line-height: 1.85;
        font-size: 0.95rem;
        max-width: 900px;
      }
    }

    .label-dot-gold {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $gradient-gold;
      flex-shrink: 0;
    }

    // ── Cars Section ──────────────────────────────────────────────────────────
    .cars-section {
      padding: 48px 24px 80px;

      &__header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 32px;
      }
    }

    .cars-count {
      font-size: 0.72rem;
      background: rgba($color-accent, 0.12);
      border: 1px solid rgba($color-accent, 0.25);
      color: $color-accent;
      padding: 3px 12px;
      border-radius: 20px;
    }

    .cars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .load-more {
      text-align: center;
      margin-top: 48px;
    }

    // ── Empty State ───────────────────────────────────────────────────────────
    .empty-state {
      text-align: center;
      padding: 72px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      &__icon { font-size: 3rem; }

      p { color: $color-text-muted; font-size: 1rem; }

      &__hint {
        font-size: 0.78rem;
        color: rgba($color-text-muted, 0.6);
        font-family: $font-mono;
        background: rgba(255,255,255,0.04);
        padding: 4px 14px;
        border-radius: $border-radius-sm;
        border: 1px solid $color-border;
      }
    }
  `]
})
export class ManufacturerDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly manufacturer = signal<Manufacturer | null>(null);
  readonly cars = signal<Car[]>([]);
  readonly pagedResponse = signal<PagedResponse<Car> | null>(null);
  readonly loadingMore = signal(false);
  private page = 0;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getManufacturer(id).subscribe(m => this.manufacturer.set(m));
    this.fetchCars(id);
  }

  loadMore(): void {
    this.loadingMore.set(true);
    this.page++;
    const id = this.manufacturer()!.id;
    this.api.getCarsByManufacturer(id, this.page).subscribe(data => {
      this.cars.update(existing => [...existing, ...data.content]);
      this.pagedResponse.set(data);
      this.loadingMore.set(false);
    });
  }

  private fetchCars(id: number): void {
    this.api.getCarsByManufacturer(id, 0).subscribe(data => {
      this.cars.set(data.content);
      this.pagedResponse.set(data);
    });
  }
}
