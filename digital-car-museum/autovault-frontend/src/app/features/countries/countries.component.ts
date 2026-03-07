import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Country } from '../../shared/models/country.model';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="countries-page">

      <header class="page-hero container">
        <div class="page-hero__label">
          <span class="label-dot"></span> Automotive Heritage
        </div>
        <h1 class="page-hero__title">Explore by <span class="gradient-text-red">Country</span></h1>
        <p class="page-hero__sub">
          Discover the rich automotive traditions from {{ countries().length || 10 }} nations across 4 continents.
        </p>
      </header>

      <div class="container">
        <div class="countries-grid" *ngIf="!loading(); else skeletons">
          <a class="country-card"
             *ngFor="let country of countries(); let i = index"
             [routerLink]="['/countries', country.id, 'manufacturers']"
             [style.--delay]="(i * 60) + 'ms'">

            <div class="country-card__flag">
              <img [src]="country.flagUrl" [alt]="country.name + ' flag'" />
              <div class="country-card__flag-overlay"></div>
            </div>

            <div class="country-card__body">
              <span class="country-card__continent">{{ country.continent }}</span>
              <h2 class="country-card__name">{{ country.name }}</h2>
              <p class="country-card__desc">{{ country.description }}</p>
              <div class="country-card__footer">
                <span class="country-card__count">
                  {{ country.manufacturerCount }}
                  {{ country.manufacturerCount !== 1 ? 'manufacturers' : 'manufacturer' }}
                </span>
                <span class="country-card__arrow">→</span>
              </div>
            </div>

            <div class="country-card__glow"></div>
          </a>
        </div>

        <ng-template #skeletons>
          <div class="countries-grid">
            <div class="skeleton" style="height: 280px; border-radius: 18px;"
                 *ngFor="let i of [1,2,3,4,5,6,7,8,9,10]"></div>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    @use 'styles/variables' as *;

    .countries-page {
      padding-bottom: 80px;
    }

    // ── Page Hero ─────────────────────────────────────────────────────────────
    .page-hero {
      padding: 72px 24px 56px;
      text-align: center;

      &__label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 3px;
        color: $color-text-muted;
        margin-bottom: 16px;
      }

      &__title {
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-family: $font-display;
        color: $color-text-primary;
        margin-bottom: 14px;
        line-height: 1.1;
      }

      &__sub {
        color: $color-text-muted;
        font-size: 1rem;
        max-width: 480px;
        margin: 0 auto;
      }
    }

    .label-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: $gradient-accent;
    }

    // ── Grid ──────────────────────────────────────────────────────────────────
    .countries-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 22px;
    }

    // ── Country Card ──────────────────────────────────────────────────────────
    .country-card {
      display: flex;
      flex-direction: column;
      background: $gradient-dark-card;
      backdrop-filter: blur(20px);
      border: 1px solid $color-border;
      border-radius: $border-radius-lg;
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      transition: transform $transition-normal, border-color $transition-normal, box-shadow $transition-normal;
      position: relative;
      animation: card-in $transition-slow both;
      animation-delay: var(--delay, 0ms);

      &:hover {
        transform: translateY(-8px);
        border-color: rgba($color-accent, 0.35);
        box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba($color-accent, 0.08);

        .country-card__flag img { transform: scale(1.06); }
        .country-card__flag-overlay { opacity: 0.6; }
        .country-card__glow { opacity: 1; }
        .country-card__arrow { opacity: 1; transform: translateX(4px); }
      }

      &__flag {
        height: 130px;
        overflow: hidden;
        position: relative;
        background: linear-gradient(135deg, $color-secondary, $color-tertiary);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform $transition-slow;
        }
      }

      &__flag-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, transparent 30%, rgba($color-primary, 0.85) 100%);
        opacity: 0.3;
        transition: opacity $transition-normal;
      }

      &__body {
        padding: 20px 22px 22px;
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      &__continent {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        background: $gradient-accent;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
      }

      &__name {
        font-size: 1.35rem;
        font-family: $font-display;
        color: $color-text-primary;
        margin: 4px 0 8px;
      }

      &__desc {
        font-size: 0.82rem;
        color: $color-text-muted;
        line-height: 1.6;
        flex: 1;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      &__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid $color-border;
      }

      &__count {
        font-size: 0.75rem;
        background: $gradient-cool;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 600;
      }

      &__arrow {
        font-size: 1rem;
        color: $color-text-muted;
        opacity: 0;
        transition: all $transition-normal;
      }

      &__glow {
        position: absolute;
        bottom: -30px;
        right: -30px;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: rgba($color-accent, 0.2);
        filter: blur(40px);
        opacity: 0;
        pointer-events: none;
        transition: opacity $transition-normal;
      }
    }

    @keyframes card-in {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class CountriesComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly countries = signal<Country[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.api.getCountries().subscribe(countries => {
      this.countries.set(countries);
      this.loading.set(false);
    });
  }
}
