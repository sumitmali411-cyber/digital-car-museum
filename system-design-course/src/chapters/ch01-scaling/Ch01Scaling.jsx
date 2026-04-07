import { useState } from 'react'
import { motion } from 'motion/react'
import { Section, SubSection, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, NumberStat, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── Architecture Diagram ─────────────────────────────────────────────────────
function ArchDiagram({ stage }) {
  const stages = ['single', 'separate-db', 'load-balancer', 'cdn-cache', 'full']
  const idx = stages.indexOf(stage)

  return (
    <svg viewBox="0 0 700 320" style={{ width: '100%', maxHeight: 320 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill={C.cyan} />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Users */}
      <g>
        <rect x="20" y="130" width="70" height="40" rx="6" fill="#1a2236" stroke={C.border} strokeWidth="1"/>
        <text x="55" y="148" textAnchor="middle" fill={C.textDim} fontSize="9" fontFamily="JetBrains Mono">USERS</text>
        <text x="55" y="162" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">web/mobile</text>
      </g>

      {/* CDN (stage >= cdn-cache) */}
      {idx >= 3 && (
        <g>
          <rect x="120" y="60" width="80" height="36" rx="6" fill="rgba(167,139,250,0.1)" stroke="#a78bfa" strokeWidth="1"/>
          <text x="160" y="76" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono">CDN</text>
          <text x="160" y="89" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">static assets</text>
          <line x1="90" y1="145" x2="120" y2="80" stroke={C.border} strokeWidth="1" strokeDasharray="3,3"/>
        </g>
      )}

      {/* Load Balancer (stage >= load-balancer) */}
      {idx >= 2 ? (
        <g>
          <rect x="120" y="125" width="80" height="36" rx="6" fill="rgba(245,158,11,0.1)" stroke={C.amber} strokeWidth="1"/>
          <text x="160" y="141" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">LOAD</text>
          <text x="160" y="154" textAnchor="middle" fill={C.amber} fontSize="8" fontFamily="JetBrains Mono">BALANCER</text>
          <line x1="90" y1="150" x2="120" y2="143" stroke={C.cyan} strokeWidth="1.5" markerEnd="url(#arrow)"/>
        </g>
      ) : (
        // Arrow direct to server
        <line x1="90" y1="150" x2="230" y2="150" stroke={C.cyan} strokeWidth="1.5" markerEnd="url(#arrow)"/>
      )}

      {/* Web Server(s) */}
      {idx >= 2 ? (
        <g>
          {/* Server 1 */}
          <rect x="230" y="100" width="90" height="40" rx="6" fill="rgba(6,182,212,0.1)" stroke={C.cyan} strokeWidth="1" filter="url(#glow)"/>
          <text x="275" y="118" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono">WEB SERVER</text>
          <text x="275" y="131" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">instance 1</text>
          <line x1="200" y1="140" x2="230" y2="120" stroke={C.amber} strokeWidth="1" markerEnd="url(#arrow)"/>
          {/* Server 2 */}
          <rect x="230" y="160" width="90" height="40" rx="6" fill="rgba(6,182,212,0.1)" stroke={C.cyan} strokeWidth="1"/>
          <text x="275" y="178" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono">WEB SERVER</text>
          <text x="275" y="191" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">instance 2</text>
          <line x1="200" y1="150" x2="230" y2="178" stroke={C.amber} strokeWidth="1" markerEnd="url(#arrow)"/>
        </g>
      ) : (
        <g>
          <rect x="230" y="128" width="90" height="44" rx="6" fill="rgba(6,182,212,0.1)" stroke={C.cyan} strokeWidth="1" filter="url(#glow)"/>
          <text x="275" y="148" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono">WEB SERVER</text>
          <text x="275" y="163" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">+ database</text>
        </g>
      )}

      {/* Cache (stage >= cdn-cache) */}
      {idx >= 3 && (
        <g>
          <rect x="360" y="95" width="80" height="36" rx="6" fill="rgba(16,185,129,0.1)" stroke={C.green} strokeWidth="1"/>
          <text x="400" y="111" textAnchor="middle" fill={C.green} fontSize="9" fontFamily="JetBrains Mono">CACHE</text>
          <text x="400" y="124" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">Redis/Memcached</text>
          <line x1="320" y1="120" x2="360" y2="113" stroke={C.green} strokeWidth="1" strokeDasharray="4,2" markerEnd="url(#arrow)"/>
          <line x1="320" y1="180" x2="360" y2="116" stroke={C.green} strokeWidth="1" strokeDasharray="4,2" markerEnd="url(#arrow)"/>
        </g>
      )}

      {/* Database(s) */}
      {idx >= 1 ? (
        <g>
          {/* Primary DB */}
          <rect x="460" y="100" width="90" height="40" rx="6" fill="rgba(239,68,68,0.1)" stroke={C.red} strokeWidth="1"/>
          <text x="505" y="118" textAnchor="middle" fill={C.red} fontSize="9" fontFamily="JetBrains Mono">PRIMARY DB</text>
          <text x="505" y="131" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">(write)</text>

          {/* Arrow from server to DB */}
          {idx < 3
            ? <line x1="320" y1="150" x2="460" y2="120" stroke={C.border} strokeWidth="1" markerEnd="url(#arrow)"/>
            : <line x1="440" y1="113" x2="460" y2="115" stroke={C.red} strokeWidth="1" markerEnd="url(#arrow)"/>
          }

          {idx >= 2 && (
            <g>
              <rect x="460" y="165" width="90" height="40" rx="6" fill="rgba(239,68,68,0.05)" stroke={`${C.red}50`} strokeWidth="1"/>
              <text x="505" y="183" textAnchor="middle" fill={`${C.red}80`} fontSize="9" fontFamily="JetBrains Mono">REPLICA DB</text>
              <text x="505" y="196" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">(read)</text>
              <line x1="505" y1="140" x2="505" y2="165" stroke={`${C.red}50`} strokeWidth="1" strokeDasharray="3,2" markerEnd="url(#arrow)"/>
              <text x="515" y="158" fill={C.textMuted} fontSize="7" fontFamily="JetBrains Mono">replication</text>
            </g>
          )}
        </g>
      ) : (
        // Single server contains DB
        null
      )}

      {/* Message Queue (full stage) */}
      {idx >= 4 && (
        <g>
          <rect x="360" y="240" width="90" height="36" rx="6" fill="rgba(245,158,11,0.08)" stroke={`${C.amber}60`} strokeWidth="1"/>
          <text x="405" y="256" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">MSG QUEUE</text>
          <text x="405" y="269" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">async tasks</text>
        </g>
      )}

      {/* Labels */}
      <text x="350" y="310" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="Space Grotesk">
        {stage === 'single' && 'Phase 1: Single Server'}
        {stage === 'separate-db' && 'Phase 2: Separate Web + DB'}
        {stage === 'load-balancer' && 'Phase 3: Load Balancer + Replication'}
        {stage === 'cdn-cache' && 'Phase 4: CDN + Cache Layer'}
        {stage === 'full' && 'Phase 5: Full Production Architecture'}
      </text>
    </svg>
  )
}

// ─── Interactive Scaling Stepper ──────────────────────────────────────────────
function ScalingStepper() {
  const stages = ['single', 'separate-db', 'load-balancer', 'cdn-cache', 'full']
  const [current, setCurrent] = useState(0)

  const labels = [
    { title: 'Single Server', users: '< 1K', desc: 'Web app, DB, and everything runs on one machine. Simple but single point of failure.' },
    { title: 'Separate DB',   users: '1K–10K', desc: 'Move database to its own server. Web tier and data tier scale independently.' },
    { title: 'Load Balancer + DB Replication', users: '10K–500K', desc: 'Add horizontal web servers behind a load balancer. Primary DB handles writes, replicas serve reads.' },
    { title: 'CDN + Cache',   users: '500K–5M', desc: 'Serve static content from CDN edge nodes. Cache DB queries in Redis/Memcached. Reduce latency 10x.' },
    { title: 'Full Scale',    users: '5M+', desc: 'Message queues for async processing, data sharding, multiple data centers, and stateless servers.' },
  ]

  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Stage tabs */}
      <div style={{
        display: 'flex',
        borderBottom: `1px solid ${C.border}`,
        overflowX: 'auto',
      }}>
        {labels.map((l, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              flex: '0 0 auto',
              padding: '10px 16px',
              background: 'none',
              border: 'none',
              borderBottom: current === i ? `2px solid ${C.cyan}` : '2px solid transparent',
              fontFamily: FONTS.mono,
              fontSize: 10,
              color: current === i ? C.cyan : C.textMuted,
              cursor: 'pointer',
              transition: 'color 0.15s',
              whiteSpace: 'nowrap',
              letterSpacing: '0.05em',
            }}
          >
            {String(i + 1).padStart(2, '0')}. {l.title}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 24px' }}>
        {/* Diagram */}
        <div style={{
          background: '#0d1117',
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: '16px',
          marginBottom: 16,
        }}>
          <ArchDiagram stage={stages[current]} />
        </div>

        {/* Description */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{
            background: `rgba(6,182,212,0.08)`,
            border: `1px solid rgba(6,182,212,0.2)`,
            borderRadius: 6,
            padding: '8px 12px',
            minWidth: 80,
            textAlign: 'center',
          }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: C.textMuted, marginBottom: 2 }}>USERS</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 700, color: C.cyan }}>{labels[current].users}</div>
          </div>
          <p style={{
            fontFamily: FONTS.sans, fontSize: 13, color: C.textDim,
            lineHeight: 1.65, margin: 0,
          }}>
            {labels[current].desc}
          </p>
        </div>

        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
          <button
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            style={{
              background: 'none',
              border: `1px solid ${current === 0 ? C.border : C.cyan}`,
              color: current === 0 ? C.textMuted : C.cyan,
              fontFamily: FONTS.mono, fontSize: 11,
              padding: '6px 14px', borderRadius: 5,
              cursor: current === 0 ? 'default' : 'pointer',
            }}
          >
            ← PREV
          </button>
          <button
            onClick={() => setCurrent(Math.min(stages.length - 1, current + 1))}
            disabled={current === stages.length - 1}
            style={{
              background: current === stages.length - 1 ? 'none' : 'rgba(6,182,212,0.1)',
              border: `1px solid ${current === stages.length - 1 ? C.border : C.cyan}`,
              color: current === stages.length - 1 ? C.textMuted : C.cyan,
              fontFamily: FONTS.mono, fontSize: 11,
              padding: '6px 14px', borderRadius: 5,
              cursor: current === stages.length - 1 ? 'default' : 'pointer',
            }}
          >
            NEXT →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Chapter ─────────────────────────────────────────────────────────────
export default function Ch01Scaling() {
  return (
    <div>
      <Section title="Evolution: Zero to Millions" icon="📈">
        <InfoBox type="tip">
          <strong>Interview Insight:</strong> Always start with a simple design and evolve it.
          Explain the bottleneck at each stage before jumping to the solution.
        </InfoBox>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '12px 0' }}>
          No system starts at scale. The art of system design is knowing <em>when</em> and <em>how</em> to evolve
          your architecture as user load grows. Click through the stages below to see how the architecture evolves.
        </p>
        <ScalingStepper />
      </Section>

      <Section title="Vertical vs Horizontal Scaling" icon="⚖️">
        <TradeoffTable rows={[
          {
            approach: 'Vertical Scaling (Scale Up)',
            pros: 'Simple. No code change. Works for initial growth.',
            cons: 'Hardware limits. Single point of failure. Expensive beyond a point.',
            when: 'Early stage. DB servers (easier to manage). < 100K users.',
          },
          {
            approach: 'Horizontal Scaling (Scale Out)',
            pros: 'No hard ceiling. Fault tolerant. Cost-effective at scale.',
            cons: 'Requires stateless design. More complex ops. Network overhead.',
            when: 'Web/API tier. > 100K users. Any service requiring HA.',
          },
        ]} />

        <InfoBox type="key">
          <strong>Stateless Architecture is mandatory for horizontal scaling.</strong> Move session state
          out of web servers into a shared store (Redis, Memcached). Then any server can serve any request.
        </InfoBox>
      </Section>

      <Section title="Load Balancers" icon="⚡">
        <ConceptGrid>
          <ConceptCard title="Round Robin" icon="🔄" color={C.cyan}>
            Requests distributed sequentially across servers. Simple and effective when servers have equal capacity.
          </ConceptCard>
          <ConceptCard title="Least Connections" icon="📊" color={C.green}>
            Route to server with fewest active connections. Better for variable request durations.
          </ConceptCard>
          <ConceptCard title="IP Hashing" icon="🔑" color={C.amber}>
            Hash client IP to always route to same server. Useful for stateful apps during migration.
          </ConceptCard>
          <ConceptCard title="Health Checks" icon="💓" color={C.purple}>
            LB pings servers every N seconds. Automatically removes unhealthy instances from rotation.
          </ConceptCard>
        </ConceptGrid>

        <InfoBox type="warn" style={{ marginTop: 12 }}>
          If a web server fails, the load balancer automatically reroutes traffic to healthy servers —
          this eliminates the web tier as a single point of failure.
        </InfoBox>
      </Section>

      <Section title="Database Replication" icon="🗄️">
        <SubSection title="Master-Slave (Primary-Replica) Pattern">
          <StepList steps={[
            { title: 'Primary handles all writes', body: 'INSERT, UPDATE, DELETE go to the primary/master database only. Ensures consistency.' },
            { title: 'Replicas handle reads', body: 'SELECT queries spread across multiple replica servers. Most apps are 80-90% reads — huge throughput gain.' },
            { title: 'Async replication', body: 'Primary writes to its binlog, replicas pull changes. Small replication lag (milliseconds) — acceptable for most use cases.' },
            { title: 'Failover', body: 'If primary fails, promote a replica to primary. If a replica fails, reads route to other replicas until replacement is ready.' },
          ]} />
        </SubSection>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, marginTop: 16 }}>
          {[
            { value: '80%', label: 'Typical read ratio', color: C.cyan },
            { value: '1-5ms', label: 'Replication lag', color: C.green },
            { value: '3x', label: 'Read throughput boost (3 replicas)', color: C.purple },
            { value: '99.99%', label: 'Uptime with replicas', color: C.amber },
          ].map(s => (
            <div key={s.label} style={{
              background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: '12px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 10, color: C.textMuted, marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Caching Strategies" icon="⚡">
        <ConceptGrid>
          <ConceptCard title="Cache-Aside (Lazy Loading)" icon="💤" color={C.cyan}>
            App checks cache first. On miss → read from DB → store in cache. Most common pattern.
            Risk: Cache stampede on cold start.
          </ConceptCard>
          <ConceptCard title="Write-Through" icon="✍️" color={C.green}>
            Write to cache AND DB simultaneously. Cache always consistent. Higher write latency.
            Good for read-heavy workloads.
          </ConceptCard>
          <ConceptCard title="Write-Back (Write-Behind)" icon="📬" color={C.amber}>
            Write to cache only, async to DB later. Very fast writes. Risk of data loss on cache failure.
          </ConceptCard>
          <ConceptCard title="TTL (Time To Live)" icon="⏱️" color={C.purple}>
            Every cached item has an expiry. Prevents stale data buildup. Balance between freshness and hit rate.
          </ConceptCard>
        </ConceptGrid>

        <InfoBox type="warn">
          <strong>When not to use cache:</strong> Data that changes frequently, financial transactions requiring
          consistency, or data that's accessed rarely (low hit rate). Cache misses have latency overhead.
        </InfoBox>
      </Section>

      <Section title="CDN (Content Delivery Network)" icon="🌐">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 16px' }}>
          CDN servers are geographically distributed. Users fetch static content (images, JS, CSS, video)
          from the nearest CDN edge server, reducing latency from 100ms+ to &lt;10ms.
        </p>

        <StepList steps={[
          { title: 'User requests static asset', body: 'Browser requests image.jpg from your domain.' },
          { title: 'DNS routes to nearest CDN POP', body: 'CDN\'s Anycast DNS resolves to the closest Point of Presence (edge node).' },
          { title: 'Cache hit → instant response', body: 'If edge has the file, serves it immediately. Typical hit rates: 80-95%.' },
          { title: 'Cache miss → origin fetch + cache', body: 'Edge fetches from your origin server, caches with configured TTL, then serves to user. All future users in that region hit cache.' },
        ]} />

        <InfoBox type="tip">
          <strong>Cost consideration:</strong> CDN providers charge per GB of data transfer. Set appropriate
          TTLs — too short defeats the purpose, too long serves stale content. Use versioned URLs
          (e.g., <code style={{ color: C.cyan }}>app.v3.js</code>) to force cache busting on deploys.
        </InfoBox>
      </Section>

      <Section title="Stateless Architecture" icon="🏗️">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{
            background: C.bgCard, border: `1px solid ${C.red}30`, borderRadius: 8, padding: '16px',
          }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.red, letterSpacing: '0.1em', marginBottom: 10 }}>
              ❌ STATEFUL (BAD)
            </div>
            <CodeBlock lang="scenario" code={`User logged in to Server 1
Next request → Server 2
Server 2 has no session data
→ User gets logged out!`} />
          </div>
          <div style={{
            background: C.bgCard, border: `1px solid ${C.green}30`, borderRadius: 8, padding: '16px',
          }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.green, letterSpacing: '0.1em', marginBottom: 10 }}>
              ✅ STATELESS (GOOD)
            </div>
            <CodeBlock lang="scenario" code={`User session stored in Redis
Any server can handle any request
Server 1 fails → Server 2 continues
No session loss`} />
          </div>
        </div>
      </Section>

      <Section title="Data Centers & Global Scale" icon="🌍">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 16px' }}>
          At true scale, a single data center creates too much latency for distant users and a geographical
          single point of failure. Multi-DC deployment addresses both.
        </p>
        <ConceptGrid>
          <ConceptCard title="GeoDNS Routing" icon="🗺️" color={C.cyan}>
            DNS resolves different IPs based on user location. Users in EU hit EU data center, US users hit US DC.
            Reduces latency by routing to nearest DC.
          </ConceptCard>
          <ConceptCard title="Data Synchronization" icon="🔄" color={C.amber}>
            Challenge: Keeping data consistent across DCs. Netflix/Airbnb replicate databases asynchronously
            and handle conflicts with last-write-wins or vector clocks.
          </ConceptCard>
          <ConceptCard title="Failover" icon="🛡️" color={C.green}>
            If DC1 goes down, GeoDNS automatically routes all traffic to DC2. Critical for 99.99% SLA.
            Data must be pre-replicated to DC2.
          </ConceptCard>
          <ConceptCard title="Test in Production" icon="🧪" color={C.purple}>
            Run chaos experiments (Netflix Chaos Monkey). Intentionally kill services to verify failover
            works before you actually need it.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Message Queues" icon="📨">
        <InfoBox type="info">
          Message queues decouple producers from consumers, enabling async processing. If a downstream
          service is slow, the queue absorbs the spike. Producers and consumers can scale independently.
        </InfoBox>
        <StepList steps={[
          { title: 'Producer publishes to queue', body: 'Web server posts a "resize image" task to the queue and immediately returns 200 OK to the user.' },
          { title: 'Queue persists the message', body: 'Message is stored durably. Even if all workers die, the task won\'t be lost.' },
          { title: 'Workers consume at their pace', body: 'Worker instances poll the queue. Process tasks one by one. Scale workers independently based on queue depth.' },
          { title: 'Acknowledgement on success', body: 'Worker sends ACK after processing. If worker crashes before ACK, message is re-queued and another worker picks it up.' },
        ]} />
      </Section>

      <Section title="Interview Checklist" icon="✅">
        <div style={{
          background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px',
        }}>
          {[
            'Start with single server, evolve to justify each component',
            'Separate web tier and data tier early',
            'Use load balancer + multiple web servers for horizontal scaling',
            'Add DB replication: primary for writes, replicas for reads',
            'Cache DB queries with Redis (cache-aside pattern)',
            'Serve static content via CDN',
            'Make web servers stateless (sessions in Redis)',
            'Consider multi-DC for 99.99% availability and geo latency',
            'Use message queues to decouple async workloads',
            'Monitor + alert on every component',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '8px 0',
              borderBottom: i < 9 ? `1px solid ${C.border}` : 'none',
            }}>
              <span style={{ color: C.green, fontFamily: FONTS.mono, fontSize: 13, lineHeight: 1.5 }}>✓</span>
              <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
