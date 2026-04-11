import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Section, SubSection, InfoBox, ConceptGrid, ConceptCard,
  StepList, TradeoffTable, CodeBlock,
} from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── Geohash Visualizer ───────────────────────────────────────────────────────
function GeohashViz() {
  const [precision, setPrecision] = useState(3)

  const precisionData = {
    1: { size: '5000 km × 5000 km', cells: '32', use: 'Continental regions' },
    2: { size: '1250 km × 625 km', cells: '1024', use: 'Country level' },
    3: { size: '156 km × 156 km', cells: '32768', use: 'Large city' },
    4: { size: '39 km × 20 km', cells: '~1M', use: 'City district' },
    5: { size: '4.9 km × 4.9 km', cells: '~33M', use: 'Neighborhood' },
    6: { size: '1.2 km × 0.6 km', cells: '~1B', use: 'Street block' },
  }

  const current = precisionData[precision]

  // Draw a simple grid representation
  const cols = Math.min(precision * 2, 8)
  const rows = Math.min(precision, 4)

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px' }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, letterSpacing: '0.12em', marginBottom: 14 }}>
        GEOHASH PRECISION EXPLORER
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5, 6].map(p => (
          <button key={p} onClick={() => setPrecision(p)} style={{
            padding: '6px 14px', background: precision === p ? 'rgba(6,182,212,0.15)' : 'none',
            border: `1px solid ${precision === p ? C.cyan : C.border}`,
            borderRadius: 5, fontFamily: FONTS.mono, fontSize: 11,
            color: precision === p ? C.cyan : C.textMuted, cursor: 'pointer', transition: 'all 0.15s',
          }}>
            {p}-char
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8, padding: 12 }}>
          <svg viewBox="0 0 200 150" style={{ width: 200, height: 150 }}>
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((_, c) => {
                const isCenter = r === Math.floor(rows / 2) && c === Math.floor(cols / 2)
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={c * (200 / cols)} y={r * (150 / rows)}
                    width={200 / cols - 1} height={150 / rows - 1}
                    fill={isCenter ? `rgba(6,182,212,0.3)` : `rgba(6,182,212,0.05)`}
                    stroke={isCenter ? C.cyan : C.border}
                    strokeWidth={isCenter ? 1.5 : 0.5}
                    rx={2}
                  />
                )
              })
            )}
            {/* Label the center cell */}
            <text
              x={Math.floor(cols / 2) * (200 / cols) + (200 / cols) / 2}
              y={Math.floor(rows / 2) * (150 / rows) + (150 / rows) / 2 + 4}
              textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono"
            >
              {'9q8yy'.slice(0, precision)}
            </text>
          </svg>
        </div>

        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { label: 'CELL SIZE', value: current.size, color: C.cyan },
              { label: 'TOTAL CELLS', value: current.cells, color: C.green },
              { label: 'USE CASE', value: current.use, color: C.amber },
            ].map(s => (
              <div key={s.label} style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 8, color: C.textMuted, marginBottom: 2, letterSpacing: '0.1em' }}>{s.label}</div>
                <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <InfoBox type="tip">
        Adjacent geohash cells share a common prefix. To find nearby points, query the cell
        and its 8 neighbors. <strong>Edge case:</strong> cells at hash boundaries may be neighbors
        geographically but have completely different hashes — must always query 8 neighbors.
      </InfoBox>
    </div>
  )
}

// ─── Routing Algorithm Comparison ─────────────────────────────────────────────
function RoutingComparison() {
  const [active, setActive] = useState('dijkstra')

  const algorithms = {
    dijkstra: {
      label: "Dijkstra's",
      color: C.cyan,
      complexity: 'O((V + E) log V)',
      guarantee: 'Optimal path',
      desc: 'Explores nodes by increasing distance from source. Guaranteed shortest path. Explores in all directions — inefficient for large road networks.',
      code: `// Priority queue (min-heap by distance)
pq.push({node: source, dist: 0})
while pq not empty:
    curr = pq.pop_min()
    for neighbor in graph[curr]:
        new_dist = dist[curr] + edge_weight
        if new_dist < dist[neighbor]:
            dist[neighbor] = new_dist
            pq.push({neighbor, new_dist})`,
    },
    astar: {
      label: 'A* (A-Star)',
      color: C.green,
      complexity: 'O(E log V) best case',
      guarantee: 'Optimal (with admissible heuristic)',
      desc: 'Dijkstra with a heuristic that guides search toward destination. Uses f(n) = g(n) + h(n) where h is straight-line distance. 10× faster than Dijkstra in practice.',
      code: `// f(n) = g(n) + h(n)
// g = actual cost from start
// h = heuristic (straight-line to goal)
pq.push({node: source, f: 0})
while pq not empty:
    curr = pq.pop_min_f()
    if curr == goal: return path
    for neighbor in graph[curr]:
        g = g[curr] + edge_weight
        h = haversine(neighbor, goal)
        pq.push({neighbor, f: g + h})`,
    },
    contraction: {
      label: 'Contraction Hierarchies',
      color: C.amber,
      complexity: 'O(log V) query',
      guarantee: 'Optimal (preprocessed)',
      desc: 'Offline preprocessing creates highway network. Important nodes (highways) added to hierarchy. Queries run bidirectional Dijkstra on hierarchy only. Used by Google Maps, OSRM.',
      code: `// Preprocessing (offline, run once):
// 1. Order nodes by "importance"
// 2. Shortcut edges for contracted nodes
// 3. Build upward/downward graphs

// Query (real-time, microseconds):
// Bidirectional Dijkstra on CH graph
// Forward from source (upward)
// Backward from target (upward)
// Find meeting point in hierarchy`,
    },
  }

  const alg = algorithms[active]

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
        {Object.entries(algorithms).map(([key, a]) => (
          <button key={key} onClick={() => setActive(key)} style={{
            flex: 1, padding: '10px 8px', background: 'none', border: 'none',
            borderBottom: active === key ? `2px solid ${a.color}` : '2px solid transparent',
            fontFamily: FONTS.mono, fontSize: 9, color: active === key ? a.color : C.textMuted,
            cursor: 'pointer', transition: 'color 0.15s',
          }}>
            {a.label.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 12px' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 8, color: C.textMuted, marginBottom: 2, letterSpacing: '0.1em' }}>COMPLEXITY</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: alg.color }}>{alg.complexity}</div>
          </div>
          <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 12px' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 8, color: C.textMuted, marginBottom: 2, letterSpacing: '0.1em' }}>GUARANTEE</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: C.green }}>{alg.guarantee}</div>
          </div>
        </div>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.65, margin: '0 0 12px' }}>{alg.desc}</p>
        <CodeBlock lang="pseudocode" code={alg.code} />
      </div>
    </div>
  )
}

// ─── Main Chapter ─────────────────────────────────────────────────────────────
export default function V2Ch03Maps() {
  return (
    <div>
      <Section title="Geospatial Indexing" icon="📍">
        <InfoBox type="info">
          <strong>Core problem:</strong> Given millions of points on Earth, how do you efficiently
          answer "find all POIs within 5 km of this location"? You need a spatial index.
        </InfoBox>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '12px 0' }}>
          Three main approaches: Geohash (string prefix hierarchy), QuadTree (spatial subdivision),
          and Google's S2 (sphere-projected cells). Each maps 2D coordinates to a 1D key that can
          be indexed in a standard B-tree.
        </p>

        <SubSection title="Geohash — Precision vs Cell Size">
          <GeohashViz />
        </SubSection>

        <SubSection title="Spatial Index Comparison">
          <TradeoffTable rows={[
            {
              approach: 'Geohash',
              pros: 'Simple string prefix queries. Human-readable. Easy to implement with Redis (ZRANGEBYLEX).',
              cons: 'Edge cases at poles and hash boundaries. Cell shapes distort near poles.',
              when: 'POI search, nearby restaurants, ride-sharing location lookup.',
            },
            {
              approach: 'QuadTree',
              pros: 'Adapts density — splits dense areas more. No boundary distortion.',
              cons: 'More complex to implement. Harder to distribute across machines.',
              when: 'When data distribution is very uneven (cities vs oceans).',
            },
            {
              approach: 'Google S2 Geometry',
              pros: 'Uniform cell sizes globally. Excellent for range queries on sphere. Used by Google Maps, Foursquare.',
              cons: 'Complex library. Steeper learning curve.',
              when: 'Production maps system needing highest accuracy.',
            },
            {
              approach: 'PostGIS / Spatial DB',
              pros: 'Full SQL power. Built-in spatial functions. ST_Within, ST_Distance, etc.',
              cons: 'Vertical scale limits. Harder to shard than Redis-based approaches.',
              when: 'Medium scale (<100M POIs). Team familiar with PostgreSQL.',
            },
          ]} />
        </SubSection>
      </Section>

      <Section title="Map Tile Pyramid" icon="🗺️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          The world map is pre-rendered into a pyramid of tiles. Zoom level 0 = 1 tile (whole world).
          Each zoom level doubles resolution in both dimensions — 4× more tiles.
        </p>

        <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <svg viewBox="0 0 600 200" style={{ width: '100%', maxHeight: 200 }}>
            {/* Zoom level pyramid */}
            {[
              { z: 0, tiles: 1, x: 260, w: 80, label: '1 tile (256×256 px)' },
              { z: 1, tiles: 4, x: 200, w: 200, label: '4 tiles' },
              { z: 2, tiles: 16, x: 120, w: 360, label: '16 tiles' },
            ].map((level, i) => (
              <g key={i}>
                <rect x={level.x} y={10 + i * 55} width={level.w} height={40} rx={4}
                  fill={`rgba(6,182,212,${0.15 - i * 0.04})`} stroke={C.cyan} strokeWidth={1} />
                <text x={level.x + level.w / 2} y={28 + i * 55} textAnchor="middle"
                  fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono">z={level.z}</text>
                <text x={level.x + level.w / 2} y={42 + i * 55} textAnchor="middle"
                  fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">{level.label}</text>
              </g>
            ))}
            <text x="60" y="25" fill={C.textMuted} fontSize="9" fontFamily="JetBrains Mono">Zoom 0</text>
            <text x="60" y="80" fill={C.textMuted} fontSize="9" fontFamily="JetBrains Mono">Zoom 1</text>
            <text x="60" y="135" fill={C.textMuted} fontSize="9" fontFamily="JetBrains Mono">Zoom 2</text>
            <text x="300" y="190" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="JetBrains Mono">
              Zoom 20 = 1 trillion tiles (building-level detail)
            </text>
          </svg>
        </div>

        <ConceptGrid>
          <ConceptCard title="Tile URL Format" icon="🔗" color={C.cyan}>
            <code style={{ fontFamily: FONTS.mono, color: C.cyan, fontSize: 11 }}>
              /tiles/{'{z}/{x}/{y}'}.png
            </code>
            <br />z=zoom, x/y=tile coordinates. Client calculates needed tiles based on viewport
            and current zoom. Fetches in parallel.
          </ConceptCard>
          <ConceptCard title="CDN Caching" icon="⚡" color={C.green}>
            Tiles are static images. Perfect CDN candidates. Cache-Control: max-age=86400.
            Base map tiles change rarely (road construction). Traffic overlay tiles change every 2 minutes.
          </ConceptCard>
          <ConceptCard title="Vector vs Raster" icon="📐" color={C.amber}>
            Raster tiles = pre-rendered PNGs. Simple but large. Vector tiles = geometric data
            (roads, polygons). Rendered on-device. Smaller, zoomable without pixelation. Google Maps uses vector.
          </ConceptCard>
          <ConceptCard title="Tile Pre-rendering" icon="🏭" color={C.purple}>
            Offline pipeline generates tiles at all zoom levels when map data updates. Incremental
            re-rendering only for changed regions. Stored in object storage (S3), served via CDN.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Routing Algorithms" icon="🛣️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          The road network is modeled as a weighted directed graph. Nodes = intersections.
          Edges = road segments with weights (distance, travel time). Finding the shortest
          path is a classic graph problem, but at city scale it needs optimizations:
        </p>
        <RoutingComparison />
      </Section>

      <Section title="Real-Time Traffic Integration" icon="🚦">
        <StepList steps={[
          { title: 'Collect probe data from devices', body: 'GPS traces from anonymous users (with consent). Every phone running Google Maps / Waze is a traffic sensor. 1 billion GPS pings/day.' },
          { title: 'Map matching', body: 'Raw GPS coordinates matched to road segments using Hidden Markov Model. Handles GPS noise and inaccuracy (±5–15m).' },
          { title: 'Speed estimation', body: 'For each road segment: aggregate speed from all vehicles in last 2 minutes. Filter outliers. Compute confidence score based on sample size.' },
          { title: 'Update routing graph edge weights', body: 'Traffic processor updates edge weights in routing graph. Distributed cache (Redis) stores current segment speeds. TTL = 2 minutes.' },
          { title: 'Route recalculation with live traffic', body: 'ETA = sum of (segment_length / current_speed) along route. Re-route triggered when faster path detected during navigation.' },
        ]} />

        <InfoBox type="warn">
          <strong>Privacy:</strong> Raw GPS traces are never stored. Speed data is aggregated and
          anonymized at ingest. No individual's location history is retained beyond the session.
          This is a regulatory requirement in GDPR regions.
        </InfoBox>
      </Section>

      <Section title="ETA Prediction" icon="⏱️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Simple distance-based ETA is inaccurate. Production systems combine multiple signals:
        </p>

        <ConceptGrid>
          <ConceptCard title="Historical Patterns" icon="📈" color={C.cyan}>
            5 years of GPS data reveals "Monday 8 AM on I-101 is always congested". ML model
            predicts speed by (road segment, day-of-week, hour-of-day, historical weather).
          </ConceptCard>
          <ConceptCard title="Live Traffic Data" icon="🔴" color={C.green}>
            Real-time speed from current probes overrides historical baseline when available.
            Weighted blend: 70% live data + 30% historical when probe density is high.
          </ConceptCard>
          <ConceptCard title="Incident Detection" icon="🚧" color={C.amber}>
            Sudden speed drops across multiple probes = accident detected automatically.
            User reports (via app button) confirm. Segment marked as incident with estimated duration.
          </ConceptCard>
          <ConceptCard title="DeepMind ETA Model" icon="🤖" color={C.purple}>
            Google uses a graph neural network trained on historical driving patterns.
            Reduces ETA prediction error by 50% vs. weighted average. Input: route segments + context.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="POI Search (Points of Interest)" icon="🔍">
        <SubSection title="Search Pipeline">
          <StepList steps={[
            { title: 'User searches "coffee near me"', body: 'Search query + user\'s current GPS coordinates sent to search service.' },
            { title: 'Geohash-based candidate filtering', body: 'Compute geohash of user location (precision 6). Query Elasticsearch for POIs in same cell + 8 neighboring cells. Fast candidate set.' },
            { title: 'Distance ranking', body: 'Compute Haversine distance for each candidate. Sort by distance. Apply radius filter.' },
            { title: 'Relevance re-ranking', body: 'Blend distance with relevance signals: text match score, rating, review count, business hours, popularity. ML model for final ranking.' },
            { title: 'Return with map markers', body: 'Return top 20 results with coordinates. Client plots markers. Load more on scroll.' },
          ]} />
        </SubSection>

        <SubSection title="Haversine Distance Formula">
          <CodeBlock lang="python" code={`import math

def haversine(lat1, lon1, lat2, lon2) -> float:
    """Distance between two GPS coordinates in km"""
    R = 6371  # Earth's radius in km
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (math.sin(dphi/2)**2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2)
    return 2 * R * math.asin(math.sqrt(a))

# Example: 1.2 km between two Manhattan addresses
haversine(40.7589, -73.9851, 40.7505, -73.9934)  # → ~1.21 km`} />
        </SubSection>
      </Section>

      <Section title="Interview Summary" icon="✅">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'Geospatial index: Geohash (simplest), QuadTree (adaptive), S2 (most accurate)',
            'Geohash maps 2D coordinates to 1D string — prefix = proximity',
            'Always query target cell + 8 neighbors to handle boundary edge cases',
            'Map tiles: z/x/y addressing. CDN-cached. Vector tiles for modern clients',
            'Routing graph: nodes=intersections, edges=road segments with time weights',
            'A* with Contraction Hierarchies for sub-100ms routing queries at global scale',
            'Live traffic: GPS probe aggregation → speed estimation → graph edge weight update',
            'ETA: blend historical patterns + live data + ML model (DeepMind GNN)',
            'POI search: Geohash candidate filter → Haversine distance → relevance re-ranking',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0',
              borderBottom: i < 8 ? `1px solid ${C.border}` : 'none',
            }}>
              <span style={{ color: C.cyan, fontFamily: FONTS.mono, fontSize: 11, lineHeight: 1.5, flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
