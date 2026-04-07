import { useState, useEffect } from 'react'
import { Section, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

const TWO_PI = 2 * Math.PI
const toRad = (deg) => (deg * Math.PI) / 180

function HashRingViz() {
  const [servers, setServers] = useState([
    { id: 'A', angle: 0,   color: C.cyan,   virtual: [60, 120, 180] },
    { id: 'B', angle: 120, color: C.green,  virtual: [60, 120, 180] },
    { id: 'C', angle: 240, color: C.amber,  virtual: [60, 120, 180] },
  ])
  const [requests, setRequests] = useState([])
  const [showVirtual, setShowVirtual] = useState(false)
  const [lastHit, setLastHit] = useState(null)

  const cx = 150, cy = 150, r = 110

  const addRequest = () => {
    const angle = Math.random() * 360
    const angleRad = toRad(angle)
    // Find next server clockwise
    const allNodes = servers.flatMap(s => [
      { id: s.id, angle: s.angle, color: s.color },
      ...(showVirtual ? s.virtual.map(v => ({ id: s.id, angle: (s.angle + v) % 360, color: s.color, virtual: true })) : []),
    ]).sort((a, b) => a.angle - b.angle)

    let target = allNodes[0]
    for (const node of allNodes) {
      if (node.angle >= angle) { target = node; break }
    }
    setLastHit(target.id)
    const newReq = {
      id: Date.now(),
      angle,
      server: target.id,
      color: target.color,
    }
    setRequests(rs => [...rs.slice(-5), newReq])
    setTimeout(() => setRequests(rs => rs.filter(r => r.id !== newReq.id)), 2000)
  }

  const addServer = () => {
    if (servers.length >= 5) return
    const newAngle = Math.random() * 360
    const colors = [C.purple, '#f472b6', '#fb923c']
    const used = servers.length - 3
    setServers(s => [...s, {
      id: String.fromCharCode(65 + s.length),
      angle: newAngle,
      color: colors[used] || C.purple,
      virtual: [60, 120, 180],
    }])
  }

  const removeServer = () => {
    if (servers.length <= 2) return
    setServers(s => s.slice(0, -1))
  }

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px' }}>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Ring SVG */}
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Background circle */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="1.5" strokeDasharray="4,4"/>

          {/* Server arcs */}
          {servers.map((s, idx) => {
            const nextAngle = servers[(idx + 1) % servers.length].angle
            const start = toRad(s.angle)
            const end = toRad(nextAngle > s.angle ? nextAngle : nextAngle + 360)
            return null // Arc coloring would be complex - skip for clarity
          })}

          {/* Virtual nodes */}
          {showVirtual && servers.flatMap(s =>
            s.virtual.map((offset, i) => {
              const angle = toRad((s.angle + offset) % 360 - 90)
              const x = cx + r * Math.cos(angle)
              const y = cy + r * Math.sin(angle)
              return (
                <g key={`${s.id}-v${i}`}>
                  <circle cx={x} cy={y} r="5" fill={`${s.color}40`} stroke={s.color} strokeWidth="1" strokeDasharray="2,1"/>
                  <text x={x+7} y={y+4} fill={`${s.color}80`} fontSize="7" fontFamily="JetBrains Mono">{s.id}'</text>
                </g>
              )
            })
          )}

          {/* Requests */}
          {requests.map(req => {
            const angle = toRad(req.angle - 90)
            const x = cx + r * Math.cos(angle)
            const y = cy + r * Math.sin(angle)
            return (
              <g key={req.id}>
                <circle cx={x} cy={y} r="6" fill={req.color} opacity="0.7">
                  <animate attributeName="opacity" values="0.7;0" dur="2s" fill="freeze"/>
                  <animate attributeName="r" values="6;3" dur="2s" fill="freeze"/>
                </circle>
              </g>
            )
          })}

          {/* Servers */}
          {servers.map(s => {
            const angle = toRad(s.angle - 90)
            const x = cx + r * Math.cos(angle)
            const y = cy + r * Math.sin(angle)
            return (
              <g key={s.id}>
                <circle cx={x} cy={y} r="16"
                  fill={lastHit === s.id ? s.color : `${s.color}20`}
                  stroke={s.color} strokeWidth="1.5"
                  style={{ transition: 'fill 0.3s' }}
                />
                <text x={x} y={y+5} textAnchor="middle" fill={lastHit === s.id ? '#000' : s.color} fontSize="11" fontFamily="JetBrains Mono" fontWeight="700">
                  {s.id}
                </text>
              </g>
            )
          })}

          {/* Center label */}
          <text x={cx} y={cy-6} textAnchor="middle" fill={C.textMuted} fontSize="10" fontFamily="JetBrains Mono">HASH</text>
          <text x={cx} y={cy+8} textAnchor="middle" fill={C.textMuted} fontSize="10" fontFamily="JetBrains Mono">RING</text>
        </svg>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, justifyContent: 'center', minWidth: 180 }}>
          <button onClick={addRequest} style={{
            background: 'rgba(6,182,212,0.1)', border: `1px solid ${C.cyan}`,
            color: C.cyan, fontFamily: FONTS.mono, fontSize: 11,
            padding: '8px 14px', borderRadius: 6, cursor: 'pointer',
          }}>▶ HASH REQUEST</button>

          <button onClick={addServer} disabled={servers.length >= 5} style={{
            background: 'rgba(16,185,129,0.1)', border: `1px solid ${servers.length >= 5 ? C.border : C.green}`,
            color: servers.length >= 5 ? C.textMuted : C.green, fontFamily: FONTS.mono, fontSize: 11,
            padding: '8px 14px', borderRadius: 6, cursor: servers.length >= 5 ? 'default' : 'pointer',
          }}>+ ADD SERVER</button>

          <button onClick={removeServer} disabled={servers.length <= 2} style={{
            background: 'rgba(239,68,68,0.08)', border: `1px solid ${servers.length <= 2 ? C.border : C.red}`,
            color: servers.length <= 2 ? C.textMuted : C.red, fontFamily: FONTS.mono, fontSize: 11,
            padding: '8px 14px', borderRadius: 6, cursor: servers.length <= 2 ? 'default' : 'pointer',
          }}>− REMOVE SERVER</button>

          <button onClick={() => setShowVirtual(v => !v)} style={{
            background: showVirtual ? 'rgba(167,139,250,0.15)' : 'transparent',
            border: `1px solid ${showVirtual ? '#a78bfa' : C.border}`,
            color: showVirtual ? '#a78bfa' : C.textMuted, fontFamily: FONTS.mono, fontSize: 11,
            padding: '8px 14px', borderRadius: 6, cursor: 'pointer',
          }}>
            {showVirtual ? '◉' : '○'} VIRTUAL NODES
          </button>

          {/* Log */}
          <div style={{ marginTop: 8 }}>
            {requests.slice().reverse().map(req => (
              <div key={req.id} style={{
                fontFamily: FONTS.mono, fontSize: 9,
                color: req.color, marginBottom: 3,
              }}>
                → {req.angle.toFixed(0)}° → Server {req.server}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 4 }}>
            {servers.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textDim }}>
                  Server {s.id} @ {s.angle.toFixed(0)}°
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Ch05ConsistentHashing() {
  return (
    <div>
      <Section title="The Problem: Naive Hashing" icon="💥">
        <InfoBox type="warn">
          <strong>Naive approach:</strong> <code style={{ color: C.cyan, fontFamily: FONTS.mono }}>server = hash(key) % N</code>
          <br/>
          <strong>Problem:</strong> When N changes (server added/removed), almost ALL keys remap to different servers.
          In a cache cluster, this causes a thundering herd — everything misses.
        </InfoBox>
        <CodeBlock lang="example" code={`# 4 servers: hash("user:123") % 4 = 2 → Server 2 ✅
# Remove 1 server (N=3): hash("user:123") % 3 = 0 → Server 0 ❌ CACHE MISS

# Naive: removing 1 server remaps ~75% of all keys!
# Consistent hashing: removing 1 server remaps ~1/N of all keys ✅`} />
      </Section>

      <Section title="Hash Ring — Interactive Demo" icon="🔄">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Servers are placed on a ring at their hash position. A key is assigned to the
          <strong style={{ color: C.white }}> first server clockwise</strong> from its hash position.
          Add/remove servers to see minimal remapping:
        </p>
        <HashRingViz />
      </Section>

      <Section title="Virtual Nodes (vnodes)" icon="🔵">
        <InfoBox type="info">
          Without virtual nodes, real servers might cluster on one side of the ring, causing
          uneven load distribution. Virtual nodes solve this by placing each physical server
          at multiple positions around the ring.
        </InfoBox>

        <ConceptGrid>
          <ConceptCard title="More Positions = Better Balance" icon="⚖️" color={C.cyan}>
            Each server gets V virtual nodes (typically 100-200). Keys distribute more evenly
            across physical servers. Standard deviation of load ≈ 1/√V.
          </ConceptCard>
          <ConceptCard title="Heterogeneous Capacity" icon="💪" color={C.green}>
            Powerful servers get more virtual nodes (proportional to capacity).
            A server with 2× RAM can handle 2× virtual nodes → 2× the data.
          </ConceptCard>
          <ConceptCard title="Minimal Reshuffling" icon="🔄" color={C.amber}>
            When a server is removed, only its virtual node slots redistribute.
            ~1/N of total keys move (regardless of how many virtual nodes it had).
          </ConceptCard>
          <ConceptCard title="Used In Practice" icon="🏭" color={C.purple}>
            Amazon DynamoDB, Apache Cassandra, Discord, Chord DHT all use
            consistent hashing with virtual nodes.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="The Algorithm" icon="⚙️">
        <StepList steps={[
          { title: 'Map servers to ring', body: 'Hash each server (by name/IP) to a position on a 0-360° (or 0-2³²) ring. For vnodes, hash "ServerA:0", "ServerA:1", ..., "ServerA:99".' },
          { title: 'Map keys to ring', body: 'Apply same hash function to each key. Its position on the ring determines assignment.' },
          { title: 'Route to next clockwise server', body: 'Walk clockwise from key\'s position until you hit a server (or virtual node). That server owns the key.' },
          { title: 'Adding a server', body: 'New server takes over keys between it and the previous server clockwise. Only those keys need to migrate. Average: ~K/N keys move where K=total keys, N=server count.' },
          { title: 'Removing a server', body: 'Removed server\'s keys go to next clockwise server. Same O(K/N) impact.' },
        ]} />

        <CodeBlock lang="python" code={`import hashlib
from sortedcontainers import SortedDict

class ConsistentHashRing:
    def __init__(self, virtual_nodes=150):
        self.ring = SortedDict()
        self.virtual_nodes = virtual_nodes

    def add_server(self, server: str):
        for i in range(self.virtual_nodes):
            key = self._hash(f"{server}:vnode:{i}")
            self.ring[key] = server

    def remove_server(self, server: str):
        for i in range(self.virtual_nodes):
            key = self._hash(f"{server}:vnode:{i}")
            del self.ring[key]

    def get_server(self, request_key: str) -> str:
        if not self.ring:
            return None
        h = self._hash(request_key)
        # Find first server clockwise
        idx = self.ring.bisect_left(h)
        if idx == len(self.ring):
            idx = 0  # wrap around
        return self.ring.values()[idx]

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)`} />
      </Section>

      <Section title="Trade-offs" icon="⚖️">
        <TradeoffTable rows={[
          {
            approach: 'No vnodes (real nodes only)',
            pros: 'Simple. Low memory overhead.',
            cons: 'Uneven distribution. Large reshuffling on changes.',
            when: 'Dev/testing environments. Homogeneous servers.',
          },
          {
            approach: 'Virtual Nodes (100-200)',
            pros: 'Even distribution. Heterogeneous support. Industry standard.',
            cons: 'More memory for ring metadata. More complex.',
            when: 'Production. Any system with varying server capacities.',
          },
          {
            approach: 'Rendezvous Hashing',
            pros: 'No ring needed. Simpler. Equally balanced.',
            cons: 'O(n) per lookup (scan all servers). Slower for large clusters.',
            when: 'Small clusters (< 20 servers). CDN content routing.',
          },
        ]} />
      </Section>
    </div>
  )
}
