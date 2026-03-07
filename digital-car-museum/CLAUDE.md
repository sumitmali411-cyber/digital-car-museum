# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: AutoVault — Digital Car Museum

Full-stack app for browsing automobiles by country, manufacturer, year timeline, and interactive 3D model viewer.

**Tech Stack:**
- **Frontend**: Angular 18 (standalone components, signals), Three.js (raw — NOT ngx-three), GSAP, tsParticles, Cannon-es, PrimeNG, NgRx
- **Backend**: Spring Boot 3.3, Java 21, Spring Security 6 (OAuth2 Resource Server), MapStruct, Flyway
- **Database**: MySQL 8.0 (Flyway migrations — never use `ddl-auto: update`)
- **Auth**: Keycloak 25 (realm: `autovault`, port 8180), OAuth2/OIDC with PKCE for SPA
- **3D Models**: GLB format only, served via Spring endpoint, loaded with DRACOLoader + GLTFLoader
- **Infra**: Docker Compose (mysql, keycloak, autovault-api, autovault-frontend, phpmyadmin)

---

## Directory Structure

```
autovault/
├── autovault-frontend/         # Angular 18 SPA
│   ├── src/app/
│   │   ├── core/auth/          # Keycloak service, guards, HTTP interceptor
│   │   ├── core/services/      # API services (country, manufacturer, car, model3d)
│   │   ├── core/state/         # NgRx store slices
│   │   ├── features/           # Lazy-loaded routes (home, countries, manufacturers,
│   │   │                       #   timeline, car-detail, car-viewer-3d, search, admin)
│   │   └── shared/             # Reusable components, directives, pipes, TS interfaces
│   ├── Dockerfile
│   └── nginx.conf
├── autovault-api/              # Spring Boot API
│   ├── src/main/java/com/autovault/
│   │   ├── config/             # SecurityConfig, CorsConfig, SwaggerConfig
│   │   ├── controller/         # REST controllers (v1)
│   │   ├── service/            # Business logic
│   │   ├── repository/         # Spring Data JPA repositories
│   │   ├── entity/             # JPA entities (Country, Manufacturer, Car, Model3D, CarColor, CarAnnotation)
│   │   ├── dto/                # Java Records for request/response
│   │   ├── mapper/             # MapStruct mappers
│   │   └── seeder/             # DataSeederService (NHTSA + CarQuery + Wikipedia APIs)
│   ├── src/main/resources/
│   │   ├── db/migration/       # Flyway SQL (V1__initial_schema.sql, V2__..., etc.)
│   │   └── application.yml
│   └── Dockerfile
├── docker/
│   ├── keycloak/realm-export.json   # Imported on Keycloak startup
│   └── mysql/init/                  # Optional init scripts
└── docker-compose.yml
```

---

## Commands

### Docker (primary workflow)
```bash
docker compose up -d                            # Start all services
docker compose up -d --build autovault-api      # Rebuild and restart one service
docker compose logs -f autovault-api            # Stream logs
docker compose down                             # Stop services (preserves volumes)
docker compose down -v                          # Stop and wipe all volumes
```

### Frontend
```bash
cd autovault-frontend
npm install
ng serve                                        # Dev server at http://localhost:4200
ng build --configuration production
ng generate component features/car-viewer-3d --standalone
npm run lint
ng test                                         # Run all tests
ng test --include='**/car-viewer-3d/**'         # Run single feature tests
```

### Backend
```bash
cd autovault-api
./mvnw spring-boot:run                          # Dev mode
./mvnw spring-boot:run -Dspring.profiles.active=seed  # Run with data seeder
./mvnw clean package -DskipTests               # Build JAR
./mvnw test                                    # All tests
./mvnw test -Dtest=CarServiceTest              # Single test class
./mvnw flyway:migrate                          # Run pending migrations
./mvnw flyway:repair                           # Fix failed migration checksums
```

### Database
```bash
docker exec -it autovault-mysql mysql -u autovault -pautovault_secret autovault
```

### Keycloak
```bash
# Admin console: http://localhost:8180  (admin / admin)

# Export realm after changes:
docker exec -it autovault-keycloak /opt/keycloak/bin/kc.sh export --dir /tmp/export --realm autovault
docker cp autovault-keycloak:/tmp/export/autovault-realm.json ./docker/keycloak/realm-export.json
```

### Service URLs
| Service      | URL                              |
|--------------|----------------------------------|
| Frontend     | http://localhost:4200            |
| Backend API  | http://localhost:8080            |
| Swagger UI   | http://localhost:8080/swagger-ui.html |
| Keycloak     | http://localhost:8180            |
| phpMyAdmin   | http://localhost:8081            |
| MySQL        | localhost:3306                   |

---

## Architecture Notes

### Data Model Hierarchy
`Country` → `Manufacturer` → `Car` → `Model3D` (1:1), `CarColor` (1:N), `CarAnnotation` (1:N)

All list endpoints are paginated via Spring `Pageable`. Cars table has a `FULLTEXT` index on `model_name` and `description` for the global search endpoint.

### API Structure
- Public (no auth): `GET /api/v1/**` — browse countries, manufacturers, cars, search, download GLB
- Admin only (`ROLE_ADMIN`): `POST/PUT/DELETE /api/v1/admin/**` — CRUD + GLB upload

All endpoints return `ResponseEntity<ApiResponse<T>>`. Keycloak `realm_access.roles` are mapped to Spring `ROLE_*` authorities in `SecurityConfig`.

### Three.js Car Viewer
The `CarModelViewerComponent` owns the full Three.js lifecycle: scene, renderer, camera (`PerspectiveCamera`), `OrbitControls`, `GLTFLoader` with `DRACOLoader`, `RGBELoader` for HDRI environment, `EffectComposer` with `UnrealBloomPass` + `SSAOPass`. Color customization swaps `MeshStandardMaterial.color` at runtime. All Three.js resources (geometries, materials, textures, renderer) **must be disposed in `ngOnDestroy`** and the animation frame request cancelled.

### Angular Conventions
- Standalone components everywhere — no NgModules
- `OnPush` change detection on all components
- Use `inject()` function (not constructor injection)
- Signals for local state; NgRx for global (countries, manufacturers, cars slices)
- All feature routes are lazy-loaded
- SCSS design tokens in `_variables.scss`, imported globally

### Spring Boot Conventions
- Entities use `@Entity` + Lombok `@Data`/`@Builder`
- DTOs are Java Records
- MapStruct for all entity ↔ DTO mapping
- Custom exceptions extend `RuntimeException`, handled by `@ControllerAdvice`
- Schema changes via Flyway only — never `ddl-auto: create/update`

### Data Seeding
`DataSeederService` (activated with `seed` profile) calls:
1. **NHTSA vPIC API** (`vpic.nhtsa.dot.gov/api/`) — no API key needed — for manufacturers and models
2. **CarQuery API** (`carqueryapi.com`) — downloadable SQL, no key needed — for car specs
3. **Wikipedia API** — manufacturer history text
4. **Sketchfab API** — search and download CC-licensed GLB models

External API keys go in `.env` (gitignored): `API_NINJAS_KEY`, `SKETCHFAB_API_TOKEN`.

### GLB / 3D Model Rules
- Format: GLB only (binary GLTF, self-contained), max 50MB
- Use Draco compression when possible
- Stored at `/app/storage/models/` (Docker volume `model_storage`)
- Placeholder model at `/storage/models/placeholder-sedan.glb` for cars without a specific model
- Uploaded via `POST /api/v1/admin/cars/{id}/model3d/upload`, served via `GET /api/v1/cars/{id}/model3d/download`

### Keycloak Roles
| Role      | Access                                    |
|-----------|-------------------------------------------|
| `user`    | Browse museum (public endpoints)          |
| `admin`   | Full CRUD, GLB upload, data seeding       |
| `curator` | Edit car descriptions and annotations     |

Frontend uses PKCE (`check-sso` on load, `silentCheckSsoRedirectUri` for silent refresh). JWT attached to API calls via `HttpInterceptorFn`.
