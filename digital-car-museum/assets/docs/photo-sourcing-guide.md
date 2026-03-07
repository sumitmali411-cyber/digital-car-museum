# Car Photography — Sourcing Guide

This guide covers where to find legally usable car photos, organized by source
quality, license type, and how they map to the AutoVault data model.

---

## Primary Sources (Organized by Make/Model/Year)

### 1. Wikimedia Commons (Best for Historic Cars)

**URL**: https://commons.wikimedia.org/wiki/Commons:WikiProject_Automobiles

Wikimedia has the most organized collection of car photography on the internet,
categorized by manufacturer, model, and generation.

**How to find photos**:
```
# Category format:
Category:{Manufacturer} {Model} ({Generation Code}) — e.g. Toyota Corolla (E10)
Category:Automobiles by brand → {Brand} → {Model}
Category:Automobiles by year → {Year}
```

**Example search paths**:
- `commons.wikimedia.org/wiki/Category:Ford_Mustang` → all generations
- `commons.wikimedia.org/wiki/Category:Ferrari_250_GTO` → iconic 1960s Ferrari
- `commons.wikimedia.org/wiki/Category:Automobiles_by_year` → year browsing

**Download process**:
1. Find image → click for full resolution
2. Check license (CC-BY-SA is most common)
3. Download in highest resolution available
4. Convert to WebP for web delivery
5. Record attribution: `photographer name, via Wikimedia Commons, CC BY-SA 4.0`

**License types you'll find**:
- `CC0` — Public Domain, no attribution needed
- `CC BY` — Free use, credit required
- `CC BY-SA` — Free use, credit required, share-alike
- `PD-US` — Public Domain (US), pre-1928 works

Avoid: `CC BY-NC`, `CC BY-ND` — non-commercial or no-derivatives, not ideal.

---

### 2. Unsplash (Modern Cars, Clean Photography)

**URL**: https://unsplash.com/s/photos/cars

**API for programmatic download**:
```
GET https://api.unsplash.com/search/photos?query=ford+mustang+1967&client_id=YOUR_KEY
```

- All photos are free for commercial use
- No attribution required (but appreciated)
- Best for: modern cars, clean studio-style shots

---

### 3. Pexels (Modern, Diverse)

**URL**: https://www.pexels.com/search/cars/

**API**: https://www.pexels.com/api/

Similar to Unsplash. Free license, no attribution required.

---

### 4. NHTSA Image Library (US Government, Public Domain)

**URL**: https://www.nhtsa.gov/nhtsa-image-library

All images are in the **public domain** — no copyright, no restrictions.
Primarily safety-related content but includes many US car models.

---

### 5. Classic Car Photography Archives

For pre-1950s vehicles:
- **Library of Congress**: https://www.loc.gov/pictures/ (search "automobile")
- **National Archives**: https://catalog.archives.gov (search "automobiles")
- **Flickr Commons**: https://www.flickr.com/commons (CC-licensed historical)

All pre-1928 US works are public domain.

---

## Organized Datasets

### VMMRdb (Vehicle Make Model Recognition Database)

**GitHub**: https://github.com/faezetta/VMMRdb

- 291,752 images
- 9,170 labeled make/model/year combinations
- Coverage: 1950–2016
- Format: Organized directories `make/model/year/`
- License: Academic (check for commercial use)

---

### DVM-CAR Dataset

**URL**: https://deepvisualmarketing.github.io/

- 6M+ raw images
- UK market focus (good for European cars)
- Organization: `Brand/Model/Year/Colour/`
- License: Research use, contact for commercial

---

### Kingjosephm Vehicle Dataset (US Focus)

**GitHub**: https://github.com/kingjosephm/vehicle_make_model_dataset

- 700,000+ images
- 574 US make-model classes
- Years: 2000–2022
- Pre-organized directory structure

---

## Photo Processing Pipeline

### For Each Car Model

1. **Collect** 4–8 photos minimum per car:
   - Front 3/4 view (hero shot)
   - Side profile
   - Rear 3/4 view
   - Interior (dashboard)
   - Detail shots (grille, wheels, badge)

2. **Crop & Resize**:
   ```bash
   # Convert and resize with ImageMagick or cwebp
   cwebp -q 85 input.jpg -o output.webp

   # Create thumbnail
   convert input.jpg -resize 400x300^ -gravity Center -extent 400x300 thumb.webp
   ```

3. **Name correctly**:
   ```
   {manufacturer}-{model}-{year}-{angle}.webp
   # Examples:
   ferrari-f40-1987-front.webp
   mercedes-300sl-1954-side.webp
   ford-model-t-1908-front.jpg
   ```

4. **Place in correct folder**:
   ```
   assets/cars/by-country/{country}/{manufacturer}/images/
   ```

5. **Register in DB** via admin API

---

## Attribution Requirements

Always track attribution for CC-BY and CC-BY-SA images.
Store in the DB `Car.imageAttribution` field (add via migration).

Format:
```
"Photo by {Photographer}, via {Source}, licensed {License}"
# Example:
"Photo by John Smith, via Wikimedia Commons, licensed CC BY-SA 4.0"
```

---

## Automated Scraping (For Seeding)

The `DataSeederService` can be extended to auto-download car images.

### Wikimedia Commons API

```java
// Example: Get images for a specific car model
String url = "https://commons.wikimedia.org/w/api.php" +
    "?action=query&list=search&srsearch=Ferrari+250+GTO&srnamespace=6" +
    "&prop=imageinfo&iiprop=url|size|mime&format=json";
```

### NHTSA vPIC (already implemented)

The existing NHTSA integration can be extended with image lookup:
```
GET https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/{make}?format=json
```

---

## Country → Manufacturer → Car Mapping

For systematic asset collection, work through this priority list:

### Tier 1 (Most Iconic — Do First)
| Country | Manufacturer | Key Models |
|---------|-------------|------------|
| Germany | Mercedes-Benz | 300SL Gullwing (1954), W124 E-Class |
| Germany | Porsche | 911 (1963), 356 |
| Germany | BMW | 507 (1956), E30 M3 |
| Italy | Ferrari | 250 GTO (1962), F40, Testarossa |
| Italy | Lamborghini | Miura (1966), Countach, Diablo |
| USA | Ford | Model T (1908), Mustang (1964) |
| USA | Chevrolet | Corvette C1 (1953), Camaro |
| Japan | Toyota | 2000GT (1967), AE86, Supra |
| Japan | Honda | NSX (1990), S2000 |
| UK | Aston Martin | DB5 (1963), V8 Vantage |

### Tier 2 (Expand After Tier 1)
| Country | Manufacturer | Key Models |
|---------|-------------|------------|
| Germany | Volkswagen | Beetle (1938+), Golf GTI |
| France | Citroën | DS (1955), 2CV |
| France | Peugeot | 205 GTI |
| Sweden | Volvo | P1800 (1961) |
| UK | Bentley | Continental GT |
| UK | Rolls-Royce | Silver Ghost (1906) |

### Tier 3 (Historic Rarities)
- France: Bugatti Type 35 (1924)
- Germany: Auto Union Type C (1936 Grand Prix car)
- USA: Duesenberg Model J (1928)
- UK: Bentley 4.5L Blower (1929)

---

## Placeholder Assets

Until real photos are available, the app uses:

```
assets/cars/placeholder/
├── placeholder-sedan.jpg    ← Generic sedan silhouette (dark, museum-style)
├── placeholder-suv.jpg      ← Generic SUV silhouette
├── placeholder-sports.jpg   ← Generic sports car silhouette
└── placeholder-sedan.glb    ← Generic 3D sedan model
```

The backend serves these via the `/api/v1/cars/{id}/model3d/download` endpoint
when no specific model has been uploaded.
