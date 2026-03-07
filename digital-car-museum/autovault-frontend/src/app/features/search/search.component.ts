import {
  Component, OnInit, inject, signal,
  ChangeDetectionStrategy, DestroyRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Car } from '../../shared/models/car.model';
import { Manufacturer } from '../../shared/models/manufacturer.model';
import { CarCardComponent } from '../../shared/components/car-card/car-card.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, CarCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="search-page container">
      <h1>Search Cars</h1>

      <div class="search-bar">
        <input
          type="text"
          placeholder="Search by model, brand, description..."
          [(ngModel)]="query"
          (ngModelChange)="onQueryChange($event)"
          class="search-input"
          autofocus />
      </div>

      <!-- Filters -->
      <div class="filters">
        <select [(ngModel)]="manufacturerId" (ngModelChange)="triggerSearch()">
          <option [value]="null">All Manufacturers</option>
          <option *ngFor="let m of manufacturers()" [value]="m.id">{{ m.name }}</option>
        </select>
        <select [(ngModel)]="fuelType" (ngModelChange)="triggerSearch()">
          <option value="">All Fuel Types</option>
          <option>Gasoline</option>
          <option>Diesel</option>
          <option>Electric</option>
          <option>Hybrid</option>
        </select>
        <select [(ngModel)]="bodyType" (ngModelChange)="triggerSearch()">
          <option value="">All Body Types</option>
          <option>Sedan</option>
          <option>SUV</option>
          <option>Coupe</option>
          <option>Hatchback</option>
          <option>Sports Car</option>
          <option>Convertible</option>
          <option>Truck</option>
        </select>
        <input type="number" placeholder="Year" [(ngModel)]="year"
               (ngModelChange)="triggerSearch()" class="year-input" min="1886" max="2030" />
      </div>

      <!-- Results -->
      <div class="results-info" *ngIf="totalResults() !== null">
        {{ totalResults() }} result{{ totalResults() !== 1 ? 's' : '' }}
      </div>

      <div class="results-grid" *ngIf="results().length > 0">
        <app-car-card *ngFor="let car of results()" [car]="car" />
      </div>

      <div class="empty-state" *ngIf="results().length === 0 && !searching() && query.length > 1">
        <p>No cars found. Try a different search.</p>
      </div>

      <div class="searching" *ngIf="searching()">
        <div class="loading-spinner-sm"></div>
        <p>Searching...</p>
      </div>
    </div>
  `,
  styles: [`
    @use 'sass:color';
    @use 'styles/variables' as *;

    .search-page {
      padding: 60px 24px;
      min-height: 100vh;

      h1 {
        font-size: 2rem;
        color: $color-accent-gold;
        margin-bottom: 32px;
        text-align: center;
      }
    }

    .search-bar {
      max-width: 700px;
      margin: 0 auto 24px;
    }

    .search-input {
      width: 100%;
      padding: 16px 24px;
      background: $color-secondary;
      border: 1px solid rgba($color-text-primary, 0.15);
      border-radius: 40px;
      color: $color-text-primary;
      font-size: 1rem;
      outline: none;
      transition: border-color $transition-fast;

      &:focus { border-color: $color-accent; }
      &::placeholder { color: rgba($color-text-primary, 0.4); }
    }

    .filters {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 32px;

      select, .year-input {
        padding: 10px 16px;
        background: $color-secondary;
        border: 1px solid rgba($color-text-primary, 0.15);
        border-radius: $border-radius;
        color: $color-text-primary;
        font-size: 0.85rem;
        outline: none;
        cursor: pointer;

        &:focus { border-color: $color-accent; }
      }

      .year-input { width: 100px; }
    }

    .results-info {
      text-align: center;
      color: rgba($color-text-primary, 0.5);
      font-size: 0.85rem;
      margin-bottom: 24px;
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }

    .empty-state, .searching {
      text-align: center;
      color: rgba($color-text-primary, 0.5);
      padding: 60px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .loading-spinner-sm {
      width: 28px;
      height: 28px;
      border: 2px solid rgba($color-accent, 0.3);
      border-top-color: $color-accent;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class SearchComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  query = '';
  fuelType = '';
  bodyType = '';
  year: number | null = null;
  manufacturerId: number | null = null;

  readonly results = signal<Car[]>([]);
  readonly totalResults = signal<number | null>(null);
  readonly searching = signal(false);
  readonly manufacturers = signal<Manufacturer[]>([]);

  private searchTrigger$ = new Subject<void>();

  ngOnInit(): void {
    this.query = this.route.snapshot.queryParamMap.get('q') ?? '';
    this.api.getAllManufacturers().subscribe(list => this.manufacturers.set(list));

    this.searchTrigger$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() => {
        this.searching.set(true);
        return this.api.searchCars({
          q: this.query || undefined,
          fuelType: this.fuelType || undefined,
          bodyType: this.bodyType || undefined,
          year: this.year ?? undefined,
          manufacturerId: this.manufacturerId ?? undefined,
        });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => {
      this.results.set(data.content);
      this.totalResults.set(data.totalElements);
      this.searching.set(false);
      this.router.navigate([], {
        queryParams: this.query ? { q: this.query } : {},
        replaceUrl: true,
      });
    });

    if (this.query) this.triggerSearch();
  }

  onQueryChange(value: string): void {
    this.query = value;
    this.triggerSearch();
  }

  triggerSearch(): void {
    this.searchTrigger$.next();
  }
}
