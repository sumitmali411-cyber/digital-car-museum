import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="navbar">
      <a routerLink="/" class="navbar__brand">
        <span class="brand-icon">▲</span>
        <span class="brand-auto">Auto</span><span class="brand-vault">Vault</span>
      </a>
      <div class="navbar__links">
        <a routerLink="/countries"  routerLinkActive="active">Countries</a>
        <a routerLink="/search"     routerLinkActive="active">Search</a>
        <a routerLink="/timeline"   routerLinkActive="active" class="nav-badge-wrap">
          Timeline<span class="nav-badge">Soon</span>
        </a>
      </div>
      <div class="navbar__auth">
        <ng-container *ngIf="auth.isAuthenticated(); else loginBtn">
          <span class="user-chip">
            <span class="user-chip__dot"></span>
            {{ auth.userProfile()?.name }}
          </span>
          <button class="btn btn-ghost btn-sm" (click)="auth.logout()">Logout</button>
        </ng-container>
        <ng-template #loginBtn>
          <button class="btn btn-primary btn-sm" (click)="auth.login()">Login</button>
        </ng-template>
      </div>
    </nav>

    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    @use 'styles/variables' as *;

    .navbar {
      position: sticky;
      top: 0;
      z-index: $z-overlay;
      display: flex;
      align-items: center;
      gap: 32px;
      padding: 0 32px;
      height: 64px;
      background: rgba($color-primary, 0.85);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border-bottom: 1px solid $color-border;

      // Gradient line at bottom
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba($color-accent, 0.5), rgba($color-accent-gold, 0.5), transparent);
      }

      &__brand {
        text-decoration: none;
        font-family: $font-display;
        font-size: 1.4rem;
        font-weight: 900;
        display: flex;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;

        .brand-icon {
          font-size: 1rem;
          background: $gradient-accent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-auto  { color: $color-text-primary; }
        .brand-vault {
          background: $gradient-accent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }

      &__links {
        display: flex;
        gap: 8px;
        flex: 1;

        a {
          color: $color-text-muted;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          padding: 6px 14px;
          border-radius: $border-radius;
          transition: all $transition-fast;
          letter-spacing: 0.2px;

          &:hover {
            color: $color-text-primary;
            background: rgba(255,255,255,0.06);
          }

          &.active {
            color: $color-text-primary;
            background: rgba($color-accent, 0.12);
            border: 1px solid rgba($color-accent, 0.25);
          }
        }
      }

      &__auth {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
      }
    }

    .user-chip {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      color: $color-text-muted;
      background: rgba(255,255,255,0.06);
      border: 1px solid $color-border;
      padding: 4px 12px;
      border-radius: 20px;

      &__dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #22c55e;
        box-shadow: 0 0 6px #22c55e;
      }
    }

    .btn-sm { padding: 6px 16px; font-size: 0.8rem; }

    main { min-height: calc(100vh - 64px); }

    .nav-badge-wrap {
      position: relative;
    }

    .nav-badge {
      position: absolute;
      top: -6px;
      right: -4px;
      font-size: 0.45rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 1px 5px;
      border-radius: 6px;
      background: rgba($color-accent-gold, 0.2);
      border: 1px solid rgba($color-accent-gold, 0.4);
      color: $color-accent-gold;
      font-weight: 700;
      pointer-events: none;
    }
  `]
})
export class App {
  readonly auth = inject(AuthService);
}
