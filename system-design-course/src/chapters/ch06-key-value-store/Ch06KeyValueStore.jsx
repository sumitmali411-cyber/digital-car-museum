import { useState } from 'react'
import { Section, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

function CAPTriangle() {
  const [active, setActive] = useState(null)
  const corners = [
    { id: 'C', label: 'Consistency', x: 200, y: 30, color: C.cyan, desc: 'Every read receives the most recent write or an error. All nodes see the same data at the same time.' },
    { id: 'A', label: 'Availability', x: 50, y: 250, color: C.green, desc: 'Every request receives a (non-error) response — without guarantee it\'s the latest data.' },
    { id: 'P', label: 'Partition Tolerance', x: 350, y: 250, color: C.amber, desc: 'System continues operating even when network messages are dropped or delayed between nodes.' },
  ]
  const tradeoffs = [
    { combo: 'CA', label: 'MySQL (single node)', color: '#a78bfa', x: 125, y: 140 },
    { combo: 'CP', label: 'HBase / Zookeeper', color: C.cyan, x: 225, y: 140 },
    { combo: 'AP', label: 'Cassandra / DynamoDB', color: C.green, x: 200, y: 250 },
  ]

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px' }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, letterSpacing: '0.15em', marginBottom: 12 }}>
        CAP THEOREM — PICK ANY TWO
      </div>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <svg width="400" height="290" viewBox="0 0 400 290">
          {/* Triangle */}
          <polygon points="200,40 55,260 345,260"
            fill="rgba(6,182,212,0.02)" stroke={C.border} strokeWidth="1.5"/>

          {/* Edge labels */}
          <text x="108" y="168" fill={C.textMuted} fontSize="9" fontFamily="JetBrains Mono" transform="rotate(-60,108,168)">C + A → no partition</text>
          <text x="280" y="168" fill={C.textMuted} fontSize="9" fontFamily="JetBrains Mono" transform="rotate(60,280,168)">C + P → no availability</text>
          <text x="200" y="278" fill={C.textMuted} fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">A + P → eventual consistency</text>

          {/* Corners */}
          {corners.map(c => (
            <g key={c.id} onClick={() => setActive(active === c.id ? null : c.id)} style={{ cursor: 'pointer' }}>
              <circle cx={c.x} cy={c.y} r="26"
                fill={active === c.id ? `${c.color}30` : 'rgba(255,255,255,0.03)'}
                stroke={c.color} strokeWidth={active === c.id ? 2 : 1}/>
              <text x={c.x} y={c.y-3} textAnchor="middle" fill={c.color} fontSize="14" fontFamily="JetBrains Mono" fontWeight="700">{c.id}</text>
              <text x={c.x} y={c.y+11} textAnchor="middle" fill={c.color} fontSize="7" fontFamily="JetBrains Mono">{c.label}</text>
            </g>
          ))}

          {/* DB labels */}
          {tradeoffs.map(t => (
            <text key={t.combo} x={t.x} y={t.y} textAnchor="middle" fill={t.color} fontSize="8" fontFamily="Space Grotesk" fontWeight="600">{t.label}</text>
          ))}
        </svg>

        <div style={{ flex: 1, minWidth: 160 }}>
          {active ? (
            <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: 6 }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: corners.find(c=>c.id===active)?.color, letterSpacing: '0.1em', marginBottom: 6 }}>
                {corners.find(c=>c.id===active)?.label.toUpperCase()}
              </div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textDim, lineHeight: 1.65 }}>
                {corners.find(c=>c.id===active)?.desc}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textMuted, lineHeight: 1.7 }}>
                Click a corner to learn about each property.
              </div>
              <InfoBox type="key">
                In practice, <strong>network partitions happen</strong> — you must choose between CP or AP.
                Pure CA systems only work on single nodes.
              </InfoBox>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Ch06KeyValueStore() {
  return (
    <div>
      <Section title="CAP Theorem" icon="🔺">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Any distributed data store can guarantee at most 2 of 3 properties: Consistency, Availability, Partition Tolerance.
        </p>
        <CAPTriangle />
      </Section>

      <Section title="Core Design Decisions" icon="⚙️">
        <ConceptGrid>
          <ConceptCard title="Consistent Hashing" icon="🔄" color={C.cyan}>
            Route each key to the correct node using a hash ring. Virtual nodes ensure even distribution.
            See Chapter 5 for full details.
          </ConceptCard>
          <ConceptCard title="Replication Factor N" icon="📋" color={C.green}>
            Store N copies of each key on N consecutive nodes in the ring.
            DynamoDB / Cassandra default to N=3. Higher N = more durability, more write cost.
          </ConceptCard>
          <ConceptCard title="Quorum (W + R > N)" icon="✅" color={C.amber}>
            W writes + R reads must exceed N replicas to guarantee consistency.
            W=2, R=2, N=3: strongly consistent. W=1, R=1: eventual consistency, max performance.
          </ConceptCard>
          <ConceptCard title="Gossip Protocol" icon="💬" color={C.purple}>
            Nodes gossip membership info to random peers. Every node eventually learns
            about all other nodes. No central coordinator. O(log N) rounds to propagate.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Data Versioning & Conflict Resolution" icon="⚔️">
        <InfoBox type="warn">
          When two clients write to the same key concurrently on different replicas,
          which value wins? Vector clocks track causality to detect conflicts.
        </InfoBox>

        <CodeBlock lang="vector clock example" code={`# Server A handles write: D1([Sx,1])
# Server A handles another write: D2([Sx,2])
# Server B handles write (out of sync): D3([Sy,1],[Sx,2])
# Server C handles write: D4([Sz,1],[Sx,2])

# D3 and D4 are concurrent (conflict!)
# Neither caused the other → client must reconcile
# Amazon shopping cart: merge both (union of items)
# Last-write-wins: timestamp comparison (possible data loss)`} />

        <ConceptGrid>
          <ConceptCard title="Last Write Wins (LWW)" icon="⏰" color={C.amber}>
            Use timestamps. Highest timestamp wins. Simple but risks losing concurrent writes.
            Cassandra uses this by default.
          </ConceptCard>
          <ConceptCard title="Vector Clocks" icon="🕰️" color={C.cyan}>
            Track causality: [server, version] pairs per key. Detect true conflicts vs.
            before/after writes. Used in Amazon DynamoDB, Riak.
          </ConceptCard>
          <ConceptCard title="Merkle Trees" icon="🌳" color={C.green}>
            Tree of hashes for data comparison during anti-entropy sync. Only compare
            differing branches — efficient reconciliation without full data scan.
          </ConceptCard>
          <ConceptCard title="CRDT" icon="🔢" color={C.purple}>
            Conflict-free Replicated Data Types. Data structures designed to always merge
            safely. G-counters, OR-Sets. No conflicts by design.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Handling Failures" icon="🛡️">
        <StepList steps={[
          { title: 'Fault detection with gossip', body: 'Each node maintains heartbeat counters. Gossiped to random peers every second. If a node\'s counter doesn\'t increment for T seconds → marked down.' },
          { title: 'Sloppy quorum + Hinted handoff', body: 'If W/R nodes are down, temporarily store on other available nodes with "hints". When original nodes come back, hints are forwarded. Increases availability during partial failures.' },
          { title: 'Anti-entropy with Merkle trees', body: 'Background sync process compares Merkle trees between replicas. Only syncs differing subtrees — O(differences) not O(all data). Used in Cassandra and DynamoDB.' },
          { title: 'Read repair', body: 'On read, coordinator fetches from R replicas, compares versions. Stale replicas are updated inline. Repairs inconsistency on the read path without a separate process.' },
        ]} />
      </Section>

      <Section title="Write Path (LSM Tree + SSTable)" icon="✍️">
        <InfoBox type="info">
          Key-value stores like Cassandra and LevelDB use LSM (Log-Structured Merge) trees
          for extremely fast writes — never do in-place updates, always append.
        </InfoBox>

        <StepList steps={[
          { title: 'Write to WAL (Write-Ahead Log)', body: 'Every write first goes to the WAL for crash recovery. Sequential append — very fast.' },
          { title: 'Write to Memtable (in-memory)', body: 'Sorted in-memory structure (usually a red-black tree). Sub-millisecond writes.' },
          { title: 'Flush to SSTable when full', body: 'When Memtable exceeds threshold, flush to immutable SSTable (Sorted String Table) on disk. Sequential write — fast.' },
          { title: 'Compaction', body: 'Background process merges SSTables, removes tombstones (deletes), deduplicates. Keeps read performance from degrading.' },
        ]} />
      </Section>

      <Section title="Trade-offs Summary" icon="⚖️">
        <TradeoffTable rows={[
          {
            approach: 'Strong Consistency (W+R>N)',
            pros: 'Always reads latest value. Simpler application logic.',
            cons: 'Higher latency. Unavailable during partitions.',
            when: 'Financial data, inventory, user auth.',
          },
          {
            approach: 'Eventual Consistency (W=R=1)',
            pros: 'Lowest latency. Highest availability. Best throughput.',
            cons: 'May read stale data. Conflict resolution complexity.',
            when: 'Social feeds, shopping carts, DNS, caches.',
          },
          {
            approach: 'Read Repair',
            pros: 'Lazy consistency — heals on read. No background process needed.',
            cons: 'Slow reads (must compare R replicas). Inconsistency visible between repairs.',
            when: 'Low-traffic keys, rarely updated data.',
          },
        ]} />
      </Section>
    </div>
  )
}
