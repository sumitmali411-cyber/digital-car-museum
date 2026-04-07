import { Section, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

const geohashCode = `// Geohash neighbor lookup (8 surrounding cells)
function getNeighbors(geohash) {
  return [
    geohashlib.neighbor(geohash, 'n'),
    geohashlib.neighbor(geohash, 'ne'),
    geohashlib.neighbor(geohash, 'e'),
    geohashlib.neighbor(geohash, 'se'),
    geohashlib.neighbor(geohash, 's'),
    geohashlib.neighbor(geohash, 'sw'),
    geohashlib.neighbor(geohash, 'w'),
    geohashlib.neighbor(geohash, 'nw'),
  ]
}

// Redis GEORADIUS query for nearby businesses
GEOADD locations -73.9857 40.7484 "business:42"

GEORADIUS locations -73.9857 40.7484 5 km
  ASC COUNT 100 WITHCOORD WITHDIST`

const haversineCode = `// Haversine formula — great-circle distance between two points
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371  // Earth radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat/2)**2
          + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2))
          * Math.sin(dLon/2)**2
  return R * 2 * Math.asin(Math.sqrt(a))
}`

function GeohashGrid() {
  const cells = [
    { id: 'dp3w', x: 0,   y: 0,   businesses: 12 },
    { id: 'dp3x', x: 100, y: 0,   businesses: 87 },
    { id: 'dp3y', x: 200, y: 0,   businesses: 34 },
    { id: 'dp3q', x: 0,   y: 80,  businesses: 56 },
    { id: 'dp3r', x: 100, y: 80,  businesses: 103, highlight: true },
    { id: 'dp3s', x: 200, y: 80,  businesses: 29 },
    { id: 'dp3m', x: 0,   y: 160, businesses: 8 },
    { id: 'dp3n', x: 100, y: 160, businesses: 44 },
    { id: 'dp3p', x: 200, y: 160, businesses: 71 },
  ]
  return (
    <svg viewBox="0 0 320 260" style={{ width: '100%', maxHeight: 260 }}>
      {cells.map(c => (
        <g key={c.id}>
          <rect
            x={c.x + 2} y={c.y + 2} width={96} height={76} rx={4}
            fill={c.highlight ? `rgba(6,182,212,0.15)` : `rgba(17,24,39,0.8)`}
            stroke={c.highlight ? C.cyan : C.border}
            strokeWidth={c.highlight ? 1.5 : 1}
          />
          <text x={c.x + 50} y={c.y + 30} textAnchor="middle" fill={c.highlight ? C.cyan : C.textMuted} fontSize="9" fontFamily="JetBrains Mono">{c.id}</text>
          <text x={c.x + 50} y={c.y + 48} textAnchor="middle" fill={c.highlight ? C.white : C.textDim} fontSize="13" fontFamily="JetBrains Mono" fontWeight="700">{c.businesses}</text>
          <text x={c.x + 50} y={c.y + 63} textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">biz</text>
          {c.highlight && (
            <text x={c.x + 50} y={c.y + 75} textAnchor="middle" fill={C.cyan} fontSize="7" fontFamily="JetBrains Mono">USER HERE</text>
          )}
        </g>
      ))}
      <text x="160" y="248" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="Space Grotesk">
        Geohash precision 5 — each cell ~4.9km × 4.9km
      </text>
    </svg>
  )
}

export default function Ch01Proximity() {
  return (
    <div>
      <Section title="Requirements & Scale" icon="📍" accent={C.cyan}>
        <InfoBox type="info">
          Design a proximity service like Yelp or Google Places: find businesses within a given radius,
          add/update/delete business records, and serve hundreds of millions of search queries per day.
        </InfoBox>
        <ConceptGrid>
          <ConceptCard title="Search Radius" icon="🔍" color={C.cyan}>
            Users specify a search radius: 500m, 1km, 5km, or up to 20km. Default radius is 5km.
          </ConceptCard>
          <ConceptCard title="CRUD for Businesses" icon="🏪" color={C.green}>
            Businesses can be added, updated, or deleted. Changes may not reflect in search results immediately
            (eventual consistency acceptable).
          </ConceptCard>
          <ConceptCard title="Read-Heavy" icon="📊" color={C.amber}>
            Location search is far more frequent than business writes. System must scale reads independently
            using replicas and caching.
          </ConceptCard>
          <ConceptCard title="Low Latency" icon="⚡" color={C.purple}>
            Search results must return in under 200ms. Geospatial indexing is critical — a full table scan
            of millions of businesses is not acceptable.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Geohashing — Dividing the Earth" icon="🌐" accent={C.cyan}>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 16px' }}>
          Geohash encodes any latitude/longitude pair into a short alphanumeric string. The Earth is recursively
          subdivided into a grid — longer strings mean smaller, more precise cells.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, marginBottom: 12, letterSpacing: '0.1em' }}>
              GEOHASH PRECISION TABLE
            </div>
            {[
              { len: 4, dims: '39km × 20km',  use: 'Country/region level' },
              { len: 5, dims: '4.9km × 4.9km', use: 'City-level search' },
              { len: 6, dims: '1.2km × 0.6km', use: 'Neighborhood search' },
              { len: 7, dims: '153m × 153m',   use: 'Street-level' },
            ].map(row => (
              <div key={row.len} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '7px 0', borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 700, color: C.cyan }}>L{row.len}</span>
                <span style={{ fontFamily: FONTS.mono, fontSize: 11, color: C.white }}>{row.dims}</span>
                <span style={{ fontFamily: FONTS.sans, fontSize: 11, color: C.textMuted }}>{row.use}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8, padding: 16 }}>
            <GeohashGrid />
          </div>
        </div>

        <InfoBox type="warn">
          <strong>Boundary problem:</strong> Two locations very close to each other may fall in adjacent geohash
          cells. Always search the target cell plus all 8 neighboring cells to avoid missing nearby results.
        </InfoBox>

        <CodeBlock lang="javascript" code={geohashCode} />
      </Section>

      <Section title="Quadtree — Alternative Spatial Index" icon="🌲" accent={C.green}>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          A quadtree recursively splits a 2D area into four quadrants until each cell has at most K businesses
          (typically K=100). Dense urban areas subdivide further; sparse rural areas stay as large cells.
        </p>
        <ConceptGrid>
          <ConceptCard title="Leaf Node" icon="🍃" color={C.green}>
            Contains a list of business IDs. Split when count exceeds K=100. Depth grows in dense areas like Manhattan.
          </ConceptCard>
          <ConceptCard title="Internal Node" icon="🌿" color={C.cyan}>
            Stores bounding box and four child pointers. No business data — purely structural.
          </ConceptCard>
          <ConceptCard title="Memory Size" icon="💾" color={C.amber}>
            With 200M businesses: ~1GB for the full tree. Fits in memory on a single machine — fast traversal.
          </ConceptCard>
          <ConceptCard title="Build Time" icon="⏱️" color={C.purple}>
            Building takes minutes. Typically pre-built offline and loaded into memory. Rebuild nightly for updates.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Search Flow" icon="🔎" accent={C.cyan}>
        <StepList steps={[
          {
            title: 'Get user location',
            body: 'Mobile/web client sends latitude, longitude, and desired radius to the API gateway.',
          },
          {
            title: 'Convert to geohash',
            body: 'API server converts (lat, lon) to a geohash string of appropriate precision based on the search radius.',
          },
          {
            title: 'Fetch cell + 8 neighbors',
            body: 'Query the geohash index for all businesses in the target cell and its 8 surrounding neighbors to handle boundary edge cases.',
          },
          {
            title: 'Filter by actual radius',
            body: 'Apply the Haversine formula to filter out businesses that are inside a neighboring cell but beyond the requested radius.',
          },
          {
            title: 'Rank and paginate',
            body: 'Sort by distance (or relevance score). Return paginated results with business IDs, names, and distances.',
          },
          {
            title: 'Enrich from business DB',
            body: 'Fetch full business details (rating, hours, photos) from MySQL read replicas using the returned IDs.',
          },
        ]} />
      </Section>

      <Section title="Data Storage" icon="🗄️" accent={C.amber}>
        <ConceptGrid>
          <ConceptCard title="Business DB — MySQL" icon="🏦" color={C.amber}>
            CRUD operations for business data (name, address, category, rating). ACID compliance needed.
            Read replicas handle high read volume from search enrichment queries.
          </ConceptCard>
          <ConceptCard title="Location Index — Redis Geo" icon="⚡" color={C.red}>
            GEOADD stores (lon, lat, businessId). GEORADIUS returns nearby IDs in O(N+log M) time.
            Fits entire index in memory for sub-millisecond lookups.
          </ConceptCard>
          <ConceptCard title="Geohash Index — DB Table" icon="🗃️" color={C.cyan}>
            Table: (geohash, business_id). Indexed on geohash prefix. Simple prefix query returns all
            businesses in a cell: WHERE geohash LIKE 'dp3r%'.
          </ConceptCard>
          <ConceptCard title="CDN / App Cache" icon="🔁" color={C.green}>
            Cache popular search results (e.g., "coffee near Times Square") for 60–300 seconds.
            Dramatically reduces DB load for hotspot queries.
          </ConceptCard>
        </ConceptGrid>

        <InfoBox type="tip">
          <strong>Why not SQL BETWEEN for geo search?</strong> A query like <code style={{ color: C.cyan }}>WHERE lat BETWEEN x AND y AND lon BETWEEN a AND b</code> uses
          only one column index at a time. It does a full scan on the second column. Geohash converts 2D
          coordinates to a 1D string that can be indexed efficiently with a B-tree.
        </InfoBox>
      </Section>

      <Section title="Approach Comparison" icon="⚖️" accent={C.purple}>
        <TradeoffTable rows={[
          {
            approach: 'Geohash',
            pros: 'Simple string prefix queries. Easy to implement. Works with any DB that has string indexes.',
            cons: 'Boundary problem requires neighbor search. Cell shape distorts at poles.',
            when: 'Default choice. Most proximity services at moderate scale.',
          },
          {
            approach: 'Quadtree',
            pros: 'Adapts to data density. Fast range queries. Naturally handles sparse/dense areas.',
            cons: 'Complex to implement. Must rebuild on data changes. Higher memory footprint.',
            when: 'When data density varies wildly (e.g., rural vs. urban). In-memory systems.',
          },
          {
            approach: 'H3 (Uber Hexagonal)',
            pros: 'Hexagonal cells have equal distance to all neighbors. Better for radius queries.',
            cons: 'More complex library. Less tooling support. Harder to explain in interviews.',
            when: 'Ride-sharing, delivery routing. When boundary distortion causes real problems.',
          },
        ]} />
        <InfoBox type="key">
          Google Maps uses the <strong>S2 library</strong> (space-filling Hilbert curves) for geographic indexing.
          S2 cells cover the globe without the distortion issues of geohash near the poles.
        </InfoBox>
      </Section>

      <Section title="Distance Calculation" icon="📐" accent={C.green}>
        <CodeBlock lang="javascript" code={haversineCode} />
        <InfoBox type="info">
          The Haversine formula calculates great-circle distance on a sphere and is accurate to within 0.5%
          for most use cases. For extreme precision (surveying), use the Vincenty formula which accounts for
          Earth's ellipsoidal shape.
        </InfoBox>
      </Section>
    </div>
  )
}
