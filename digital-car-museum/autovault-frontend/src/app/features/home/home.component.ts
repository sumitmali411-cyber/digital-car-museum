import { Component, OnInit, OnDestroy, inject, signal, ChangeDetectionStrategy, ElementRef, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { Stats } from '../../shared/models/car.model';

interface CountryShowcase {
  name: string;
  flag: string;
  gradient: string;
  brands: string[];
  icon: string;
}

interface MuseumFeature {
  icon: string;
  title: string;
  description: string;
  accent: string;
  link?: string;
  badge?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="home">

      <!-- ── HERO ─────────────────────────────────────────────────────────── -->
      <section class="hero">
        <!-- Animated background layers -->
        <div class="hero__bg">
          <div class="hero__orb hero__orb--red"></div>
          <div class="hero__orb hero__orb--purple"></div>
          <div class="hero__orb hero__orb--cyan"></div>
          <div class="hero__grid"></div>
          <div class="hero__scanline"></div>
        </div>

        <!-- Road / Track bottom accent -->
        <div class="hero__road">
          <div class="road__line road__line--left"></div>
          <div class="road__line road__line--center"></div>
          <div class="road__line road__line--right"></div>
        </div>

        <!-- Animated car silhouette SVG -->
        <div class="hero__car-silhouette" aria-hidden="true">
          <svg viewBox="0 0 900 280" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Body -->
            <path d="M80 200 Q100 200 110 190 L180 130 Q230 95 340 90 L560 88 Q670 88 720 130 L790 190 Q800 200 820 200 L860 200 Q870 200 870 210 L870 230 Q870 240 860 240 L80 240 Q70 240 70 230 L70 210 Q70 200 80 200Z"
                  fill="url(#bodyGrad)" opacity="0.15"/>
            <!-- Windows -->
            <path d="M200 135 Q230 105 320 98 L440 96 L440 140 L200 140Z"
                  fill="url(#glassGrad)" opacity="0.3"/>
            <path d="M448 96 L540 96 Q620 98 660 135 L660 140 L448 140Z"
                  fill="url(#glassGrad)" opacity="0.3"/>
            <!-- Wheels -->
            <circle cx="200" cy="240" r="42" fill="none" stroke="url(#wheelGrad)" stroke-width="2" opacity="0.6"/>
            <circle cx="200" cy="240" r="22" fill="none" stroke="url(#wheelGrad)" stroke-width="1.5" opacity="0.4"/>
            <circle cx="730" cy="240" r="42" fill="none" stroke="url(#wheelGrad)" stroke-width="2" opacity="0.6"/>
            <circle cx="730" cy="240" r="22" fill="none" stroke="url(#wheelGrad)" stroke-width="1.5" opacity="0.4"/>
            <!-- Speed lines -->
            <line x1="0" y1="180" x2="70" y2="180" stroke="#E63946" stroke-width="1" opacity="0.4"/>
            <line x1="0" y1="195" x2="55" y2="195" stroke="#FF6B35" stroke-width="0.5" opacity="0.3"/>
            <line x1="0" y1="210" x2="68" y2="210" stroke="#E63946" stroke-width="0.5" opacity="0.2"/>
            <defs>
              <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#E63946"/>
                <stop offset="50%" stop-color="#818CF8"/>
                <stop offset="100%" stop-color="#38BDF8"/>
              </linearGradient>
              <linearGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#38BDF8"/>
                <stop offset="100%" stop-color="#818CF8"/>
              </linearGradient>
              <linearGradient id="wheelGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#FFBE3D"/>
                <stop offset="100%" stop-color="#FF6B35"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div class="hero__content container">
          <div class="hero__eyebrow">
            <span class="eyebrow-dot"></span>
            Digital Automotive Museum · Est. 2024
          </div>

          <h1 class="hero__title">
            <span class="title-line">Auto</span><span class="title-line title-line--accent">Vault</span>
          </h1>

          <p class="hero__tagline">From the first horseless carriage to tomorrow's electric dreamers.</p>

          <p class="hero__subtitle">
            Explore
            <span class="highlight highlight--red">{{ stats()?.totalCountries ?? 10 }} countries</span>,
            <span class="highlight highlight--gold">{{ stats()?.totalManufacturers ?? 30 }}+ manufacturers</span>,
            <span class="highlight highlight--cyan">{{ stats()?.totalCars ?? 500 }}+ iconic cars</span>
            — in a living digital museum.
          </p>

          <div class="hero__actions">
            <a routerLink="/countries" class="btn btn-primary hero__cta">
              <span>Enter the Museum</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M3.5 9h11M10.5 5l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </a>
            <a routerLink="/search" class="btn btn-ghost">Search Cars</a>
          </div>

          <!-- Mini stat pills -->
          <div class="hero__pills" *ngIf="stats()">
            <span class="stat-pill stat-pill--red">{{ stats()!.totalCountries }} Countries</span>
            <span class="stat-pill stat-pill--gold">{{ stats()!.totalManufacturers }} Makers</span>
            <span class="stat-pill stat-pill--cyan">{{ stats()!.totalCars }} Cars</span>
            <span class="stat-pill stat-pill--purple">{{ stats()!.carsWith3DModel }} 3D Models</span>
          </div>
        </div>

        <div class="hero__scroll">
          <div class="scroll-line"></div>
          <span>scroll</span>
        </div>
      </section>

      <!-- ── ABOUT / MISSION ───────────────────────────────────────────────── -->
      <section class="about">
        <div class="about__bg">
          <div class="about__orb about__orb--gold"></div>
        </div>
        <div class="container about__inner">
          <div class="about__text">
            <div class="section-label">
              <span class="label-line"></span>
              Our Mission
            </div>
            <h2 class="about__heading">
              A Living Archive of <br>
              <span class="gradient-text-gold">Automotive History</span>
            </h2>
            <p class="about__body">
              AutoVault was born from a simple belief: every automobile tells a story.
              From Karl Benz's three-wheeled Patent-Motorwagen of 1885 to the electric
              hypercars of today — each machine is a cultural artefact, a triumph of
              engineering, and a window into the era that produced it.
            </p>
            <p class="about__body">
              We built AutoVault to be a free, open, and immersive museum where anyone
              can explore the full arc of automotive history — organized by country,
              manufacturer, and year — with interactive 3D models wherever possible.
            </p>
            <div class="about__values">
              <div class="value-item">
                <span class="value-icon">🔓</span>
                <div>
                  <strong>Free & Open</strong>
                  <p>No paywalls. No subscriptions. Just cars.</p>
                </div>
              </div>
              <div class="value-item">
                <span class="value-icon">🌍</span>
                <div>
                  <strong>Global Perspective</strong>
                  <p>Every country with an automotive tradition, represented.</p>
                </div>
              </div>
              <div class="value-item">
                <span class="value-icon">🏎️</span>
                <div>
                  <strong>Immersive 3D</strong>
                  <p>Orbit, zoom, and inspect cars in your browser — no downloads.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="about__visual">
            <div class="timeline-preview">
              <div class="timeline-preview__label">Automotive Timeline</div>
              <div class="timeline-item" *ngFor="let era of eras">
                <span class="timeline-item__year">{{ era.year }}</span>
                <span class="timeline-item__dot" [style.background]="era.color"></span>
                <span class="timeline-item__event">{{ era.event }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── STATS BAR ─────────────────────────────────────────────────────── -->
      <section class="stats-bar" *ngIf="stats()">
        <div class="container stats-bar__inner">
          <div class="stat-item">
            <span class="stat-item__value stat-item__value--red">{{ stats()!.totalCountries }}</span>
            <span class="stat-item__label">Countries</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-item__value stat-item__value--gold">{{ stats()!.totalManufacturers }}</span>
            <span class="stat-item__label">Manufacturers</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-item__value stat-item__value--cyan">{{ stats()!.totalCars }}</span>
            <span class="stat-item__label">Cars</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-item__value stat-item__value--purple">{{ stats()!.carsWith3DModel }}</span>
            <span class="stat-item__label">3D Models</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-item__value stat-item__value--red">{{ stats()!.earliestYear }}</span>
            <span class="stat-item__label">Since</span>
          </div>
        </div>
      </section>

      <!-- ── COUNTRIES SHOWCASE ───────────────────────────────────────────── -->
      <section class="countries-section">
        <div class="container">
          <div class="section-header">
            <div class="section-label">
              <span class="label-line"></span>
              Browse by Origin
            </div>
            <h2 class="section-heading">Automotive Nations</h2>
            <p class="section-sub">Each country shaped the car in its own image. Explore the traditions behind the machines.</p>
          </div>
          <div class="countries-grid">
            <a class="country-card" routerLink="/countries" *ngFor="let c of countries"
               [style.--card-gradient]="c.gradient">
              <div class="country-card__flag">{{ c.flag }}</div>
              <div class="country-card__body">
                <h3 class="country-card__name">{{ c.name }}</h3>
                <p class="country-card__brands">{{ c.brands.join(' · ') }}</p>
              </div>
              <div class="country-card__glow"></div>
            </a>
          </div>
          <div class="section-cta">
            <a routerLink="/countries" class="btn btn-secondary">View All Countries →</a>
          </div>
        </div>
      </section>

      <!-- ── HOW IT WORKS ──────────────────────────────────────────────────── -->
      <section class="how-it-works">
        <div class="hiw__bg">
          <div class="hiw__orb hiw__orb--purple"></div>
          <div class="hiw__orb hiw__orb--cyan"></div>
        </div>
        <div class="container">
          <div class="section-header">
            <div class="section-label">
              <span class="label-line"></span>
              How It Works
            </div>
            <h2 class="section-heading">Your Museum Journey</h2>
          </div>
          <div class="hiw__steps">
            <div class="hiw__step">
              <div class="hiw__step-num">01</div>
              <div class="hiw__step-icon">🌍</div>
              <h3>Pick a Country</h3>
              <p>Start with a nation — Germany, Italy, Japan, USA — each with its own automotive soul.</p>
              <div class="hiw__connector"></div>
            </div>
            <div class="hiw__step">
              <div class="hiw__step-num">02</div>
              <div class="hiw__step-icon">🏭</div>
              <h3>Choose a Maker</h3>
              <p>Browse manufacturers from founding date to today. Read their origin story and legacy.</p>
              <div class="hiw__connector"></div>
            </div>
            <div class="hiw__step">
              <div class="hiw__step-num">03</div>
              <div class="hiw__step-icon">📅</div>
              <h3>Walk the Timeline</h3>
              <p>See every model year in chronological order — watch design evolve decade by decade.</p>
              <div class="hiw__connector"></div>
            </div>
            <div class="hiw__step hiw__step--last">
              <div class="hiw__step-num">04</div>
              <div class="hiw__step-icon">🏎️</div>
              <h3>Inspect in 3D</h3>
              <p>Open the interactive viewer. Orbit, zoom, swap colors. Your showroom, your rules.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── FEATURE CARDS ────────────────────────────────────────────────── -->
      <section class="features container">
        <div class="section-header section-header--center">
          <div class="section-label">
            <span class="label-line"></span>
            Explore
          </div>
          <h2 class="section-heading">What's Inside</h2>
          <p class="section-sub">Every dimension of automotive history, one click away.</p>
        </div>

        <div class="features__grid">

          <a class="feat-card feat-card--red" routerLink="/countries">
            <div class="feat-card__icon">🌍</div>
            <div class="feat-card__glow feat-card__glow--red"></div>
            <h3>By Country</h3>
            <p>Discover automotive heritage from countries across 4 continents.</p>
            <span class="feat-card__arrow">→</span>
          </a>

          <a class="feat-card feat-card--gold" routerLink="/search">
            <div class="feat-card__icon">🔍</div>
            <div class="feat-card__glow feat-card__glow--gold"></div>
            <h3>Search Cars</h3>
            <p>Full-text search across all cars by name, year, fuel type, or body style.</p>
            <span class="feat-card__arrow">→</span>
          </a>

          <div class="feat-card feat-card--cyan">
            <div class="feat-card__icon">🏎️</div>
            <div class="feat-card__glow feat-card__glow--cyan"></div>
            <h3>3D Viewer</h3>
            <p>Examine cars in full 3D with orbit controls, color swapping, and annotations.</p>
            <span class="feat-card__badge">Coming Soon</span>
          </div>

          <div class="feat-card feat-card--purple">
            <div class="feat-card__icon">📅</div>
            <div class="feat-card__glow feat-card__glow--purple"></div>
            <h3>Year Timeline</h3>
            <p>Browse a manufacturer's complete model history year by year.</p>
            <span class="feat-card__badge">Coming Soon</span>
          </div>

        </div>
      </section>

      <!-- ── 3D VIEWER TEASER ─────────────────────────────────────────────── -->
      <section class="viewer-teaser">
        <div class="viewer-teaser__bg">
          <div class="vt-orb vt-orb--red"></div>
          <div class="vt-grid"></div>
        </div>
        <div class="container viewer-teaser__inner">
          <div class="viewer-teaser__content">
            <div class="section-label">
              <span class="label-line"></span>
              3D Showroom
            </div>
            <h2 class="viewer-teaser__heading">
              Every Car, <span class="gradient-text-accent">In Three Dimensions</span>
            </h2>
            <p class="viewer-teaser__body">
              The AutoVault 3D viewer brings museum exhibits to life.
              Powered by Three.js and WebGL, it lets you orbit, inspect, and
              customize every car directly in your browser — no app required.
            </p>
            <ul class="viewer-teaser__features">
              <li><span class="vt-check">✓</span> 360° orbit with OrbitControls</li>
              <li><span class="vt-check">✓</span> Real-time color customization</li>
              <li><span class="vt-check">✓</span> Bloom + SSAO post-processing</li>
              <li><span class="vt-check">✓</span> Annotation hotspots</li>
              <li><span class="vt-check">✓</span> HDRI environment lighting</li>
            </ul>
            <a routerLink="/search" class="btn btn-primary">Find a Car →</a>
          </div>
          <div class="viewer-teaser__demo">
            <div class="demo-window">
              <div class="demo-window__bar">
                <span class="demo-dot demo-dot--red"></span>
                <span class="demo-dot demo-dot--yellow"></span>
                <span class="demo-dot demo-dot--green"></span>
                <span class="demo-title">AutoVault 3D Viewer</span>
              </div>
              <div class="demo-window__viewport">
                <!-- Animated 3D wireframe car SVG -->
                <svg viewBox="0 0 480 300" fill="none" xmlns="http://www.w3.org/2000/svg" class="demo-car">
                  <!-- Wireframe body -->
                  <path d="M60 210 Q70 210 80 200 L140 150 Q180 115 260 110 L340 110 Q400 115 430 150 L490 200 Q500 210 510 210"
                        stroke="url(#wireGrad)" stroke-width="1.5" fill="none" opacity="0.8"/>
                  <!-- Roof -->
                  <path d="M160 155 Q200 120 260 112 L320 112 Q380 120 400 155"
                        stroke="url(#wireGrad)" stroke-width="1" fill="none" opacity="0.6"/>
                  <!-- Windows -->
                  <path d="M165 158 Q195 128 258 120 L258 162 L165 162Z"
                        stroke="#38BDF8" stroke-width="0.8" fill="rgba(56,189,248,0.05)" opacity="0.7"/>
                  <path d="M264 120 L322 120 Q365 128 388 158 L388 162 L264 162Z"
                        stroke="#38BDF8" stroke-width="0.8" fill="rgba(56,189,248,0.05)" opacity="0.7"/>
                  <!-- Hood & Trunk lines -->
                  <line x1="60" y1="210" x2="158" y2="163" stroke="url(#wireGrad2)" stroke-width="1" opacity="0.5"/>
                  <line x1="390" y1="163" x2="510" y2="210" stroke="url(#wireGrad2)" stroke-width="1" opacity="0.5"/>
                  <!-- Floor -->
                  <line x1="95" y1="220" x2="480" y2="220" stroke="url(#wireGrad)" stroke-width="1" opacity="0.3"/>
                  <!-- Wheels -->
                  <circle cx="175" cy="232" r="36" stroke="#FFBE3D" stroke-width="1.5" fill="none" opacity="0.7"/>
                  <circle cx="175" cy="232" r="18" stroke="#FFBE3D" stroke-width="1" fill="none" opacity="0.4"/>
                  <circle cx="175" cy="232" r="4" fill="#FFBE3D" opacity="0.6"/>
                  <!-- Wheel spokes -->
                  <line x1="175" y1="214" x2="175" y2="250" stroke="#FFBE3D" stroke-width="0.8" opacity="0.3"/>
                  <line x1="157" y1="232" x2="193" y2="232" stroke="#FFBE3D" stroke-width="0.8" opacity="0.3"/>
                  <circle cx="400" cy="232" r="36" stroke="#FFBE3D" stroke-width="1.5" fill="none" opacity="0.7"/>
                  <circle cx="400" cy="232" r="18" stroke="#FFBE3D" stroke-width="1" fill="none" opacity="0.4"/>
                  <circle cx="400" cy="232" r="4" fill="#FFBE3D" opacity="0.6"/>
                  <line x1="400" y1="214" x2="400" y2="250" stroke="#FFBE3D" stroke-width="0.8" opacity="0.3"/>
                  <line x1="382" y1="232" x2="418" y2="232" stroke="#FFBE3D" stroke-width="0.8" opacity="0.3"/>
                  <!-- Highlight annotation dot -->
                  <circle cx="240" cy="135" r="6" fill="#E63946" opacity="0.9" class="anno-pulse"/>
                  <line x1="246" y1="129" x2="290" y2="100" stroke="#E63946" stroke-width="0.8" opacity="0.6" stroke-dasharray="3,2"/>
                  <text x="293" y="98" fill="#E63946" font-size="8" opacity="0.8" font-family="monospace">Engine Bay</text>
                  <defs>
                    <linearGradient id="wireGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stop-color="#38BDF8"/>
                      <stop offset="100%" stop-color="#818CF8"/>
                    </linearGradient>
                    <linearGradient id="wireGrad2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#818CF8"/>
                      <stop offset="100%" stop-color="#38BDF8"/>
                    </linearGradient>
                  </defs>
                </svg>
                <!-- Orbit rings -->
                <div class="orbit-ring orbit-ring--h"></div>
                <div class="orbit-ring orbit-ring--v"></div>
                <!-- HUD overlay -->
                <div class="demo-hud">
                  <span class="hud-label">PORSCHE 911 · 1973</span>
                  <span class="hud-badge">3D</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── FOOTER CTA ────────────────────────────────────────────────────── -->
      <section class="footer-cta">
        <div class="footer-cta__bg">
          <div class="fcta-orb fcta-orb--red"></div>
          <div class="fcta-orb fcta-orb--purple"></div>
        </div>
        <div class="container footer-cta__inner">
          <h2 class="footer-cta__heading">
            Ready to explore <span class="gradient-text-accent">{{ stats()?.totalCars ?? '500' }}+ cars</span>?
          </h2>
          <p class="footer-cta__sub">The museum is always open. No ticket required.</p>
          <div class="footer-cta__actions">
            <a routerLink="/countries" class="btn btn-primary btn-lg">Explore by Country</a>
            <a routerLink="/search" class="btn btn-ghost btn-lg">Search All Cars</a>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    @use 'styles/variables' as *;

    // ── Shared Utilities ────────────────────────────────────────────────────
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    .section-label {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: $color-accent;
      margin-bottom: 16px;
      font-weight: 600;
    }

    .label-line {
      display: inline-block;
      width: 28px;
      height: 1px;
      background: $gradient-accent;
    }

    .section-header {
      margin-bottom: 56px;

      &--center { text-align: center; }
      &--center .section-label { justify-content: center; }
    }

    .gradient-text-gold {
      background: $gradient-gold;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .gradient-text-accent {
      background: $gradient-accent;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .btn-lg { padding: 16px 40px; font-size: 1rem; }

    // ── HERO ────────────────────────────────────────────────────────────────
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      padding-bottom: 80px;

      &__bg {
        position: absolute;
        inset: 0;
        background: $gradient-hero;
      }

      &__orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        animation: orb-drift 12s ease-in-out infinite alternate;
        pointer-events: none;

        &--red {
          width: 700px; height: 700px;
          background: radial-gradient(circle, rgba($color-accent, 0.22) 0%, transparent 70%);
          top: -250px; left: -150px;
          animation-delay: 0s;
        }

        &--purple {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba($color-accent-purple, 0.18) 0%, transparent 70%);
          bottom: -100px; right: 5%;
          animation-delay: -4s;
        }

        &--cyan {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba($color-accent-cyan, 0.14) 0%, transparent 70%);
          top: 25%; right: -80px;
          animation-delay: -8s;
        }
      }

      &__grid {
        position: absolute;
        inset: 0;
        background-image:
          linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
        background-size: 60px 60px;
        mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
      }

      &__scanline {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,0.03) 2px,
          rgba(0,0,0,0.03) 4px
        );
        pointer-events: none;
      }

      &__road {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 80px;
      }

      &__car-silhouette {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        width: 600px;
        opacity: 0.15;
        animation: car-float 6s ease-in-out infinite;

        svg { width: 100%; }
      }

      &__content {
        position: relative;
        z-index: 2;
        text-align: center;
        padding: 120px 24px 60px;
        max-width: 900px;
        margin: 0 auto;
      }

      &__title {
        font-size: clamp(5rem, 14vw, 11rem);
        font-family: $font-display;
        font-weight: 900;
        letter-spacing: -4px;
        line-height: 0.92;
        margin-bottom: 20px;

        .title-line { display: inline; color: $color-text-primary; }

        .title-line--accent {
          background: $gradient-accent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      }

      &__tagline {
        font-size: clamp(0.9rem, 1.8vw, 1.1rem);
        color: $color-text-muted;
        letter-spacing: 0.5px;
        margin-bottom: 16px;
        font-style: italic;
      }

      &__subtitle {
        font-size: clamp(1rem, 2vw, 1.15rem);
        color: $color-text-muted;
        max-width: 580px;
        margin: 0 auto 44px;
        line-height: 1.8;
      }

      &__actions {
        display: flex;
        gap: 14px;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 36px;
      }

      &__cta {
        font-size: 1rem;
        padding: 15px 36px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      &__pills {
        display: flex;
        gap: 8px;
        justify-content: center;
        flex-wrap: wrap;
      }

      &__scroll {
        position: absolute;
        bottom: 28px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        opacity: 0.35;
        z-index: 2;

        span {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: $color-text-muted;
        }
      }
    }

    .road__line {
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
      flex: 1;
      max-width: 200px;
      animation: road-dash 3s linear infinite;

      &--center {
        max-width: 60px;
        height: 3px;
        background: linear-gradient(90deg, transparent, rgba($color-accent, 0.3), transparent);
      }
    }

    @keyframes road-dash {
      0%   { opacity: 0.3; }
      50%  { opacity: 0.7; }
      100% { opacity: 0.3; }
    }

    @keyframes car-float {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50%       { transform: translateX(-50%) translateY(-10px); }
    }

    .hero__eyebrow {
      display: inline-flex;
      align-items: center;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 3px;
      color: $color-text-muted;
      background: rgba(255,255,255,0.05);
      border: 1px solid $color-border-bright;
      padding: 6px 18px;
      border-radius: 20px;
      margin-bottom: 24px;
      backdrop-filter: blur(8px);
    }

    .eyebrow-dot {
      display: inline-block;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: $color-accent;
      box-shadow: 0 0 8px $color-accent;
      margin-right: 8px;
      animation: dot-pulse 2s ease-in-out infinite;
    }

    @keyframes dot-pulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 8px $color-accent; }
      50%       { opacity: 0.6; box-shadow: 0 0 16px $color-accent; }
    }

    .highlight {
      font-weight: 700;
      &--red    { color: $color-accent; }
      &--gold   { color: $color-accent-gold; }
      &--cyan   { color: $color-accent-cyan; }
    }

    .stat-pill {
      display: inline-flex;
      align-items: center;
      font-size: 0.72rem;
      font-weight: 600;
      padding: 4px 14px;
      border-radius: 20px;
      border: 1px solid $color-border;
      background: rgba(255,255,255,0.04);
      backdrop-filter: blur(8px);
      letter-spacing: 0.5px;

      &--red    { border-color: rgba($color-accent, 0.3);       color: $color-accent; }
      &--gold   { border-color: rgba($color-accent-gold, 0.3);  color: $color-accent-gold; }
      &--cyan   { border-color: rgba($color-accent-cyan, 0.3);  color: $color-accent-cyan; }
      &--purple { border-color: rgba($color-accent-purple, 0.3);color: $color-accent-purple; }
    }

    .scroll-line {
      width: 1px; height: 48px;
      background: linear-gradient(to bottom, $color-accent, transparent);
      animation: scroll-fade 2s ease-in-out infinite;
    }

    @keyframes scroll-fade {
      0%, 100% { opacity: 0; transform: scaleY(0.5); transform-origin: top; }
      50%       { opacity: 1; transform: scaleY(1); }
    }

    @keyframes orb-drift {
      0%   { transform: translate(0, 0) scale(1); }
      100% { transform: translate(50px, 35px) scale(1.1); }
    }

    // ── ABOUT / MISSION ─────────────────────────────────────────────────────
    .about {
      position: relative;
      padding: 120px 0;
      overflow: hidden;

      &__bg {
        position: absolute;
        inset: 0;
        background: $color-secondary;
      }

      &__orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        pointer-events: none;

        &--gold {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba($color-accent-gold, 0.1) 0%, transparent 70%);
          top: -100px; right: -100px;
        }
      }

      &__inner {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr 420px;
        gap: 80px;
        align-items: start;

        @media (max-width: 900px) {
          grid-template-columns: 1fr;
          gap: 48px;
        }
      }

      &__heading {
        font-size: clamp(2rem, 4vw, 3rem);
        font-family: $font-display;
        font-weight: 800;
        line-height: 1.2;
        color: $color-text-primary;
        margin-bottom: 28px;
      }

      &__body {
        font-size: 1rem;
        color: $color-text-muted;
        line-height: 1.85;
        margin-bottom: 20px;
      }

      &__values {
        margin-top: 36px;
        display: flex;
        flex-direction: column;
        gap: 20px;
      }
    }

    .value-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;

      .value-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
        margin-top: 2px;
      }

      strong {
        display: block;
        color: $color-text-primary;
        font-size: 0.95rem;
        margin-bottom: 4px;
      }

      p {
        color: $color-text-muted;
        font-size: 0.875rem;
        line-height: 1.6;
        margin: 0;
      }
    }

    // Timeline preview card
    .timeline-preview {
      background: $gradient-dark-card;
      border: 1px solid $color-border;
      border-radius: $border-radius-lg;
      padding: 28px;
      backdrop-filter: blur(20px);

      &__label {
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: $color-text-muted;
        margin-bottom: 20px;
      }
    }

    .timeline-item {
      display: grid;
      grid-template-columns: 60px 12px 1fr;
      gap: 12px;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid $color-border;

      &:last-child { border-bottom: none; }

      &__year {
        font-family: $font-mono;
        font-size: 0.8rem;
        color: $color-text-muted;
        font-weight: 600;
      }

      &__dot {
        width: 10px; height: 10px;
        border-radius: 50%;
        box-shadow: 0 0 8px currentColor;
      }

      &__event {
        font-size: 0.82rem;
        color: $color-text-primary;
        line-height: 1.4;
      }
    }

    // ── STATS BAR ───────────────────────────────────────────────────────────
    .stats-bar {
      background: rgba($color-secondary, 0.8);
      backdrop-filter: blur(20px);
      border-top: 1px solid $color-border;
      border-bottom: 1px solid $color-border;
      padding: 32px 0;

      &__inner {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0;
      }
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 44px;

      &__value {
        font-size: 2.4rem;
        font-weight: 800;
        font-family: $font-display;
        line-height: 1;
        margin-bottom: 6px;

        &--red    { background: $gradient-accent; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        &--gold   { background: $gradient-gold;   -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        &--cyan   { background: $gradient-cool;   -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        &--purple { color: $color-accent-purple; }
      }

      &__label {
        font-size: 0.68rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: $color-text-muted;
      }
    }

    .stat-divider {
      width: 1px; height: 44px;
      background: $color-border-bright;
      @media (max-width: 600px) { display: none; }
    }

    // ── COUNTRIES SHOWCASE ──────────────────────────────────────────────────
    .countries-section {
      padding: 100px 0;
      background: $color-primary;
    }

    .countries-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 40px;
    }

    .country-card {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 24px 20px;
      background: $gradient-dark-card;
      border: 1px solid $color-border;
      border-radius: $border-radius-lg;
      text-decoration: none;
      color: inherit;
      overflow: hidden;
      transition: transform $transition-normal, border-color $transition-normal, box-shadow $transition-normal;

      &:hover {
        transform: translateY(-4px);
        border-color: $color-border-bright;
        box-shadow: 0 12px 40px rgba(0,0,0,0.4);

        .country-card__glow { opacity: 1; }
      }

      &__flag {
        font-size: 2.2rem;
        line-height: 1;
      }

      &__body {}

      &__name {
        font-size: 1rem;
        font-weight: 700;
        color: $color-text-primary;
        margin-bottom: 6px;
        font-family: $font-display;
      }

      &__brands {
        font-size: 0.72rem;
        color: $color-text-muted;
        line-height: 1.5;
      }

      &__glow {
        position: absolute;
        inset: 0;
        background: var(--card-gradient);
        opacity: 0;
        transition: opacity $transition-normal;
        pointer-events: none;
      }
    }

    .section-cta {
      text-align: center;
      margin-top: 8px;
    }

    // ── HOW IT WORKS ────────────────────────────────────────────────────────
    .how-it-works {
      position: relative;
      padding: 100px 0;
      overflow: hidden;
      background: $color-secondary;
    }

    .hiw {
      &__bg {
        position: absolute;
        inset: 0;
      }

      &__orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(100px);
        pointer-events: none;

        &--purple {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba($color-accent-purple, 0.12) 0%, transparent 70%);
          top: -100px; left: -100px;
        }

        &--cyan {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba($color-accent-cyan, 0.1) 0%, transparent 70%);
          bottom: -100px; right: -100px;
        }
      }

      &__steps {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0;

        @media (max-width: 900px) {
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        @media (max-width: 560px) {
          grid-template-columns: 1fr;
        }
      }

      &__step {
        position: relative;
        padding: 32px 24px;
        border-left: 1px solid $color-border;

        &:first-child { border-left: none; }

        &-num {
          font-family: $font-mono;
          font-size: 0.65rem;
          color: $color-accent;
          letter-spacing: 2px;
          margin-bottom: 16px;
          opacity: 0.8;
        }

        &-icon {
          font-size: 2rem;
          margin-bottom: 16px;
          display: block;
        }

        h3 {
          font-size: 1.05rem;
          font-weight: 700;
          color: $color-text-primary;
          margin-bottom: 10px;
          font-family: $font-display;
        }

        p {
          font-size: 0.85rem;
          color: $color-text-muted;
          line-height: 1.7;
        }
      }

      &__connector {
        position: absolute;
        top: 44px;
        right: -1px;
        width: 1px;
        height: 32px;
        background: linear-gradient(to bottom, $color-accent, transparent);
      }
    }

    // ── FEATURE CARDS ───────────────────────────────────────────────────────
    .features {
      padding: 100px 24px;

      .section-header { margin-bottom: 48px; }
    }

    .features__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
    }

    .feat-card {
      position: relative;
      background: $gradient-dark-card;
      backdrop-filter: blur(20px);
      border: 1px solid $color-border;
      border-radius: $border-radius-lg;
      padding: 36px 28px;
      text-decoration: none;
      color: inherit;
      overflow: hidden;
      transition: transform $transition-normal, border-color $transition-normal, box-shadow $transition-normal;
      cursor: default;

      &[routerLink] { cursor: pointer; }

      &:hover {
        transform: translateY(-6px);
        .feat-card__glow { opacity: 1; }
        .feat-card__arrow { opacity: 1; transform: translateX(4px); }
      }

      &__icon {
        font-size: 2.5rem;
        margin-bottom: 20px;
        display: block;
        line-height: 1;
      }

      h3 {
        font-size: 1.2rem;
        margin-bottom: 10px;
        color: $color-text-primary;
        font-family: $font-display;
        font-weight: 700;
      }

      p {
        font-size: 0.875rem;
        color: $color-text-muted;
        line-height: 1.7;
      }

      &__glow {
        position: absolute;
        bottom: -40px; right: -40px;
        width: 160px; height: 160px;
        border-radius: 50%;
        filter: blur(40px);
        opacity: 0.35;
        transition: opacity $transition-normal;
        pointer-events: none;

        &--red    { background: rgba($color-accent, 0.5); }
        &--gold   { background: rgba($color-accent-gold, 0.5); }
        &--cyan   { background: rgba($color-accent-cyan, 0.5); }
        &--purple { background: rgba($color-accent-purple, 0.5); }
      }

      &__arrow {
        position: absolute;
        bottom: 20px; right: 24px;
        font-size: 1.2rem;
        opacity: 0;
        transition: all $transition-normal;
      }

      &__badge {
        display: inline-block;
        margin-top: 14px;
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        padding: 3px 10px;
        border-radius: 20px;
        background: rgba(255,255,255,0.07);
        border: 1px solid $color-border-bright;
        color: $color-text-muted;
      }

      &--red:hover    { border-color: rgba($color-accent, 0.4);       box-shadow: 0 16px 48px rgba($color-accent, 0.15); }
      &--gold:hover   { border-color: rgba($color-accent-gold, 0.4);   box-shadow: 0 16px 48px rgba($color-accent-gold, 0.12); }
      &--cyan:hover   { border-color: rgba($color-accent-cyan, 0.4);   box-shadow: 0 16px 48px rgba($color-accent-cyan, 0.12); }
      &--purple:hover { border-color: rgba($color-accent-purple, 0.4); box-shadow: 0 16px 48px rgba($color-accent-purple, 0.12); }
    }

    // ── 3D VIEWER TEASER ────────────────────────────────────────────────────
    .viewer-teaser {
      position: relative;
      padding: 100px 0;
      overflow: hidden;
      background: $color-secondary;

      &__bg {
        position: absolute;
        inset: 0;
      }

      &__inner {
        position: relative;
        z-index: 1;
        display: grid;
        grid-template-columns: 1fr 540px;
        gap: 60px;
        align-items: center;

        @media (max-width: 1000px) {
          grid-template-columns: 1fr;
          gap: 48px;
        }
      }

      &__heading {
        font-size: clamp(1.8rem, 3.5vw, 2.8rem);
        font-family: $font-display;
        font-weight: 800;
        color: $color-text-primary;
        line-height: 1.2;
        margin-bottom: 20px;
      }

      &__body {
        font-size: 1rem;
        color: $color-text-muted;
        line-height: 1.8;
        margin-bottom: 28px;
      }

      &__features {
        list-style: none;
        padding: 0;
        margin: 0 0 32px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        li {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          color: $color-text-muted;
        }
      }
    }

    .vt-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      pointer-events: none;

      &--red {
        width: 400px; height: 400px;
        background: radial-gradient(circle, rgba($color-accent, 0.08) 0%, transparent 70%);
        top: -50px; left: -100px;
      }
    }

    .vt-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    .vt-check {
      color: $color-accent;
      font-weight: 700;
      font-size: 0.9rem;
      width: 18px;
      flex-shrink: 0;
    }

    // Demo window
    .demo-window {
      background: rgba($color-primary, 0.9);
      border: 1px solid $color-border-bright;
      border-radius: $border-radius-lg;
      overflow: hidden;
      box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px $color-border;

      &__bar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        background: rgba(255,255,255,0.04);
        border-bottom: 1px solid $color-border;
      }

      &__viewport {
        position: relative;
        height: 280px;
        background: radial-gradient(ellipse at 50% 80%, rgba($color-accent-purple,0.08) 0%, rgba($color-primary,0.95) 70%);
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .demo-dot {
      width: 10px; height: 10px;
      border-radius: 50%;

      &--red    { background: #FF5F57; }
      &--yellow { background: #FEBC2E; }
      &--green  { background: #28C840; }
    }

    .demo-title {
      flex: 1;
      text-align: center;
      font-size: 0.72rem;
      color: $color-text-muted;
      letter-spacing: 0.5px;
    }

    .demo-car {
      width: 100%;
      height: 100%;
      position: absolute;
      inset: 0;
      animation: car-demo-wobble 8s ease-in-out infinite;
    }

    @keyframes car-demo-wobble {
      0%, 100% { transform: rotate(-1deg) scale(1); }
      25%       { transform: rotate(0.5deg) scale(1.01); }
      75%       { transform: rotate(-0.5deg) scale(0.99); }
    }

    .orbit-ring {
      position: absolute;
      border-radius: 50%;
      border: 1px dashed rgba($color-accent-cyan, 0.15);
      pointer-events: none;

      &--h {
        width: 420px; height: 100px;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        animation: orbit-spin-h 20s linear infinite;
      }

      &--v {
        width: 100px; height: 240px;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        animation: orbit-spin-v 14s linear infinite reverse;
      }
    }

    @keyframes orbit-spin-h {
      from { transform: translate(-50%, -50%) rotateY(0deg); }
      to   { transform: translate(-50%, -50%) rotateY(360deg); }
    }

    @keyframes orbit-spin-v {
      from { transform: translate(-50%, -50%) rotateX(0deg); }
      to   { transform: translate(-50%, -50%) rotateX(360deg); }
    }

    .demo-hud {
      position: absolute;
      bottom: 12px;
      left: 12px;
      right: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      pointer-events: none;
    }

    .hud-label {
      font-family: $font-mono;
      font-size: 0.65rem;
      color: $color-text-muted;
      letter-spacing: 1.5px;
    }

    .hud-badge {
      font-family: $font-mono;
      font-size: 0.6rem;
      color: $color-accent;
      border: 1px solid rgba($color-accent, 0.4);
      padding: 2px 8px;
      border-radius: 4px;
      letter-spacing: 1px;
    }

    .anno-pulse {
      animation: anno-blink 2s ease-in-out infinite;
    }

    @keyframes anno-blink {
      0%, 100% { opacity: 0.9; r: 6; }
      50%       { opacity: 0.5; r: 8; }
    }

    // ── FOOTER CTA ──────────────────────────────────────────────────────────
    .footer-cta {
      position: relative;
      padding: 120px 0;
      overflow: hidden;
      text-align: center;
      background: $color-primary;

      &__bg { position: absolute; inset: 0; }

      &__inner {
        position: relative;
        z-index: 1;
      }

      &__heading {
        font-size: clamp(2rem, 5vw, 3.5rem);
        font-family: $font-display;
        font-weight: 900;
        color: $color-text-primary;
        margin-bottom: 16px;
        line-height: 1.2;
      }

      &__sub {
        font-size: 1.05rem;
        color: $color-text-muted;
        margin-bottom: 44px;
      }

      &__actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
      }
    }

    .fcta-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      pointer-events: none;

      &--red {
        width: 500px; height: 500px;
        background: radial-gradient(circle, rgba($color-accent, 0.12) 0%, transparent 70%);
        top: -100px; left: 0;
      }

      &--purple {
        width: 500px; height: 500px;
        background: radial-gradient(circle, rgba($color-accent-purple, 0.1) 0%, transparent 70%);
        bottom: -100px; right: 0;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private readonly api = inject(ApiService);
  readonly stats = signal<Stats | null>(null);

  readonly eras = [
    { year: '1885', event: 'Benz Patent-Motorwagen — the first car', color: '#E63946' },
    { year: '1908', event: 'Ford Model T — the car for everyone', color: '#FF6B35' },
    { year: '1938', event: 'Volkswagen Beetle — the people\'s car', color: '#FFBE3D' },
    { year: '1955', event: 'Citroën DS — aerodynamic avant-garde', color: '#38BDF8' },
    { year: '1963', event: 'Porsche 911 — an icon is born', color: '#818CF8' },
    { year: '1990', event: 'Honda NSX — engineering perfection', color: '#22c55e' },
    { year: '2008', event: 'Tesla Roadster — the electric revolution', color: '#38BDF8' },
  ];

  readonly countries: CountryShowcase[] = [
    { name: 'Germany', flag: '🇩🇪', gradient: 'linear-gradient(135deg,rgba(230,57,70,0.15),transparent)',    brands: ['Mercedes', 'BMW', 'Porsche', 'Volkswagen'], icon: '🏎️' },
    { name: 'Italy',   flag: '🇮🇹', gradient: 'linear-gradient(135deg,rgba(255,190,61,0.15),transparent)',   brands: ['Ferrari', 'Lamborghini', 'Fiat'], icon: '🏁' },
    { name: 'USA',     flag: '🇺🇸', gradient: 'linear-gradient(135deg,rgba(56,189,248,0.15),transparent)',   brands: ['Ford', 'Chevrolet', 'Tesla'], icon: '🚗' },
    { name: 'Japan',   flag: '🇯🇵', gradient: 'linear-gradient(135deg,rgba(129,140,248,0.15),transparent)',  brands: ['Toyota', 'Honda', 'Nissan'], icon: '🚀' },
    { name: 'UK',      flag: '🇬🇧', gradient: 'linear-gradient(135deg,rgba(255,107,53,0.15),transparent)',   brands: ['Rolls-Royce', 'Aston Martin', 'Bentley'], icon: '👑' },
    { name: 'France',  flag: '🇫🇷', gradient: 'linear-gradient(135deg,rgba(56,189,248,0.12),transparent)',   brands: ['Renault', 'Peugeot', 'Citroën'], icon: '⚡' },
    { name: 'Sweden',  flag: '🇸🇪', gradient: 'linear-gradient(135deg,rgba(56,189,248,0.1),transparent)',    brands: ['Volvo', 'Saab'], icon: '🛡️' },
    { name: 'Russia',  flag: '🇷🇺', gradient: 'linear-gradient(135deg,rgba(230,57,70,0.1),transparent)',     brands: ['Lada', 'GAZ', 'ZiL'], icon: '🔴' },
  ];

  ngOnInit(): void {
    this.api.getStats().subscribe(s => this.stats.set(s));
  }
}
