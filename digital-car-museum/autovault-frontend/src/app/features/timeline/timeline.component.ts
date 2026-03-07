import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgFor, NgIf, KeyValuePipe } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Manufacturer } from '../../shared/models/manufacturer.model';
import { Car } from '../../shared/models/car.model';
import { CarCardComponent } from '../../shared/components/car-card/car-card.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, KeyValuePipe, CarCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="timeline-page" *ngIf="manufacturer()">
      <div class="timeline-header container">
        <nav class="breadcrumb">
          <a routerLink="/countries">Countries</a> /
          <a [routerLink]="['/manufacturers', manufacturer()!.id]">{{ manufacturer()!.name }}</a> /
          <span>Timeline</span>
        </nav>
        <h1>{{ manufacturer()!.name }} — Model Timeline</h1>
        <p>{{ manufacturer()!.foundedYear }} — Present</p>
      </div>

      <div class="timeline container" *ngIf="timeline()">
        <div class="timeline__year-block"
             *ngFor="let entry of timeline()! | keyvalue">
          <div class="timeline__year-marker">
            <span class="year-badge">{{ entry.key }}</span>
            <div class="year-line"></div>
          </div>
          <div class="timeline__cars">
            <app-car-card *ngFor="let car of entry.value" [car]="car" />
          </div>
        </div>
      </div>

      <div class="container empty-state" *ngIf="timeline() && objectKeys(timeline()!).length === 0">
        <p>No timeline data available yet.</p>
      </div>
    </div>
  `,
  styles: [`
    @use 'sass:color';
    @use 'styles/variables' as *;

    .timeline-page { padding-bottom: 80px; }

    .timeline-header {
      padding: 60px 24px 48px;
      border-bottom: 1px solid rgba($color-accent-gold, 0.2);
      margin-bottom: 48px;

      h1 { font-size: 2rem; color: $color-accent-gold; margin-bottom: 8px; }
      p  { color: rgba($color-text-primary, 0.6); }
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 0.85rem;
      color: rgba($color-text-primary, 0.6);
      a { color: $color-accent; }
    }

    .timeline {
      &__year-block { margin-bottom: 48px; }

      &__year-marker {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;

        .year-badge {
          background: $color-accent;
          color: white;
          font-weight: 700;
          font-size: 0.9rem;
          padding: 4px 16px;
          border-radius: 20px;
          white-space: nowrap;
        }

        .year-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, $color-accent, transparent);
        }
      }

      &__cars {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 20px;
        padding-left: 32px;
      }
    }

    .empty-state {
      text-align: center;
      color: rgba($color-text-primary, 0.5);
      padding: 48px;
    }
  `]
})
export class TimelineComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly manufacturer = signal<Manufacturer | null>(null);
  readonly timeline = signal<Record<number, Car[]> | null>(null);
  readonly objectKeys = Object.keys;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getManufacturer(id).subscribe(m => this.manufacturer.set(m));
    this.api.getTimeline(id).subscribe(t => this.timeline.set(t));
  }
}
