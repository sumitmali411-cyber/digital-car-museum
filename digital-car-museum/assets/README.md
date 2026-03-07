# AutoVault — Shared Assets

This folder is the **single source of truth** for all visual and 3D assets.
Both the frontend (`autovault-frontend`) and any future apps or microservices
pull from here, so do **not** duplicate assets inside individual app folders.

---

## Folder Structure

```
assets/
├── cars/
│   ├── by-country/           ← All car assets organized by country → manufacturer
│   │   ├── germany/
│   │   │   ├── mercedes-benz/
│   │   │   │   ├── images/           ← Photos (jpg/webp, named: {model}-{year}-{angle}.jpg)
│   │   │   │   └── models-3d/        ← GLB files (named: {model}-{year}.glb)
│   │   │   ├── bmw/
│   │   │   ├── volkswagen/
│   │   │   └── porsche/
│   │   ├── usa/
│   │   │   ├── ford/
│   │   │   ├── chevrolet/
│   │   │   └── tesla/
│   │   ├── japan/
│   │   │   ├── toyota/
│   │   │   ├── honda/
│   │   │   └── nissan/
│   │   ├── italy/
│   │   │   ├── ferrari/
│   │   │   ├── lamborghini/
│   │   │   └── fiat/
│   │   ├── uk/
│   │   │   ├── bentley/
│   │   │   ├── rolls-royce/
│   │   │   └── aston-martin/
│   │   ├── france/
│   │   │   ├── peugeot/
│   │   │   └── renault/
│   │   └── sweden/
│   │       ├── volvo/
│   │       └── saab/
│   └── placeholder/          ← Fallback assets when specific car assets missing
│       ├── placeholder-sedan.glb
│       ├── placeholder-sedan.jpg
│       ├── placeholder-suv.jpg
│       └── placeholder-sports.jpg
├── ui/
│   ├── backgrounds/          ← SVG/WebP backgrounds, road textures, grid patterns
│   └── icons/                ← SVG icons (manufacturer logos, country flags)
└── docs/
    ├── 3d-models-guide.md    ← Where to get GLTF/GLB models + creation pipeline
    └── photo-sourcing-guide.md ← Where to get car photos + licensing
```

---

## Naming Conventions

### Images
```
{manufacturer-slug}-{model-slug}-{year}-{angle}.{ext}
```
Examples:
- `ferrari-f40-1987-front.jpg`
- `mercedes-300sl-1954-side.webp`
- `ford-mustang-1964-interior.jpg`

**Angles**: `front`, `rear`, `side`, `3quarter`, `interior`, `detail`, `aerial`

### 3D Models (GLB)
```
{manufacturer-slug}-{model-slug}-{year}.glb
```
Examples:
- `porsche-911-1963.glb`
- `toyota-ae86-1983.glb`

---

## Image Specs

| Type       | Resolution  | Format | Max Size |
|------------|-------------|--------|----------|
| Thumbnail  | 400×300     | WebP   | 40 KB    |
| Card       | 800×600     | WebP   | 120 KB   |
| Hero/Full  | 1920×1080   | WebP   | 400 KB   |
| Originals  | Any         | JPG    | Preserved |

Always provide WebP with a JPG fallback for older browsers.

## 3D Model Specs

| Property        | Requirement            |
|-----------------|------------------------|
| Format          | GLB (binary GLTF 2.0)  |
| Compression     | Draco (mandatory)      |
| Max file size   | 50 MB                  |
| Texture maps    | Albedo, Normal, Metal/Rough |
| LOD             | Single mesh (LOD handled by Three.js) |
| Y-up            | Yes (GLTF standard)    |

---

## Adding Assets

1. Place images in the correct `by-country/{country}/{manufacturer}/images/` folder
2. Place GLB files in `by-country/{country}/{manufacturer}/models-3d/` folder
3. Register the asset in the database via the admin API (`POST /api/v1/admin/cars/{id}/model3d/upload`)
4. The backend stores the DB record; this folder is the file origin for seeding

---

## Sources & Licensing

See `docs/3d-models-guide.md` and `docs/photo-sourcing-guide.md` for where to
legally obtain assets and their license requirements.

**Never add copyrighted assets without checking the license.**
Preferred licenses: CC0, CC-BY, CC-BY-SA. Avoid NC/ND for a public museum.
