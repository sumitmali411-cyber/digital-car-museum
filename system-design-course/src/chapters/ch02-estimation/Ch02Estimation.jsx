import { useState } from 'react'
import { Section, SubSection, InfoBox, ConceptGrid, ConceptCard, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

const POWERS = [
  { power: 10, val: '1 Thousand', bytes: '1 KB', example: 'A paragraph of text' },
  { power: 20, val: '1 Million', bytes: '1 MB', example: 'A small novel' },
  { power: 30, val: '1 Billion', bytes: '1 GB', example: 'Movie (compressed)' },
  { power: 40, val: '1 Trillion', bytes: '1 TB', example: 'Large database' },
  { power: 50, val: '1 Quadrillion', bytes: '1 PB', example: 'All internet traffic/day' },
]

const LATENCIES = [
  { op: 'L1 cache reference', ns: 0.5, color: C.green },
  { op: 'Branch misprediction', ns: 5, color: C.green },
  { op: 'L2 cache reference', ns: 7, color: C.green },
  { op: 'Mutex lock/unlock', ns: 25, color: C.cyan },
  { op: 'Main memory reference (RAM)', ns: 100, color: C.cyan },
  { op: 'Compress 1K bytes (Snappy)', ns: 3000, color: C.amber },
  { op: 'Send 1K bytes over 1Gbps', ns: 10000, color: C.amber },
  { op: 'Read 4K from SSD', ns: 150000, color: C.amber },
  { op: 'Read 1 MB sequentially (RAM)', ns: 250000, color: C.red },
  { op: 'Round trip in same DC', ns: 500000, color: C.red },
  { op: 'Read 1 MB sequentially (SSD)', ns: 1000000, color: C.red },
  { op: 'Disk seek (HDD)', ns: 10000000, color: '#ef4444' },
  { op: 'Read 1 MB sequentially (HDD)', ns: 20000000, color: '#ef4444' },
  { op: 'Send packet CA→Netherlands→CA', ns: 150000000, color: '#ef4444' },
]

function formatNs(ns) {
  if (ns < 1000) return `${ns} ns`
  if (ns < 1000000) return `${(ns/1000).toFixed(0)} μs`
  if (ns < 1000000000) return `${(ns/1000000).toFixed(0)} ms`
  return `${(ns/1000000000).toFixed(1)} s`
}

function LatencyBar({ op, ns, color, maxNs }) {
  const pct = Math.log10(ns) / Math.log10(maxNs) * 100
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
        <span style={{ fontFamily: FONTS.sans, fontSize: 11, color: C.textDim }}>{op}</span>
        <span style={{ fontFamily: FONTS.mono, fontSize: 10, color, flexShrink: 0, marginLeft: 8 }}>
          {formatNs(ns)}
        </span>
      </div>
      <div style={{ height: 4, background: C.border, borderRadius: 2 }}>
        <div style={{
          height: '100%', width: `${pct}%`, background: color,
          borderRadius: 2, transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  )
}

function Calculator() {
  const [dau, setDau] = useState(10)
  const [actionsPerDay, setActionsPerDay] = useState(10)
  const [storagePerAction, setStoragePerAction] = useState(1)

  const qps = Math.round((dau * 1e6 * actionsPerDay) / 86400)
  const peakQps = qps * 2
  const storagePerDay = dau * 1e6 * actionsPerDay * storagePerAction * 1024
  const storagePerYear = storagePerDay * 365

  const fmt = (bytes) => {
    if (bytes < 1e9) return `${(bytes/1e6).toFixed(1)} MB`
    if (bytes < 1e12) return `${(bytes/1e9).toFixed(1)} GB`
    return `${(bytes/1e12).toFixed(1)} TB`
  }

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px' }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, letterSpacing: '0.15em', marginBottom: 16 }}>
        QUICK ESTIMATION CALCULATOR
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Daily Active Users (M)', val: dau, set: setDau, min: 1, max: 1000, step: 1 },
          { label: 'Actions per User per Day', val: actionsPerDay, set: setActionsPerDay, min: 1, max: 100, step: 1 },
          { label: 'Storage per Action (KB)', val: storagePerAction, set: setStoragePerAction, min: 0.1, max: 100, step: 0.1 },
        ].map(({ label, val, set, min, max, step }) => (
          <div key={label}>
            <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: C.textDim, marginBottom: 6 }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="range" min={min} max={max} step={step} value={val}
                onChange={e => set(parseFloat(e.target.value))}
                style={{ flex: 1, accentColor: C.cyan }}
              />
              <span style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 700, color: C.cyan, minWidth: 40 }}>
                {val}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
        {[
          { label: 'Avg QPS', value: qps.toLocaleString(), color: C.cyan },
          { label: 'Peak QPS (2×)', value: peakQps.toLocaleString(), color: C.amber },
          { label: 'Storage/Day', value: fmt(storagePerDay), color: C.green },
          { label: 'Storage/Year', value: fmt(storagePerYear), color: C.purple },
        ].map(s => (
          <div key={s.label} style={{
            background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8,
            padding: '12px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 16, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 10, color: C.textMuted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Ch02Estimation() {
  return (
    <div>
      <Section title="Why Estimation Matters" icon="🧮">
        <InfoBox type="tip">
          Interviewers want to see that you can reason about scale. You don't need exact numbers —
          you need the right <strong>order of magnitude</strong> and clear assumptions.
        </InfoBox>
        <InfoBox type="key">
          <strong>The Golden Rule:</strong> Always state your assumptions explicitly, round aggressively,
          and use powers of 2 (because computers work in binary).
        </InfoBox>
      </Section>

      <Section title="Powers of Two" icon="2️⃣">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Power', 'Exact Value', 'Approx', 'Data Size', 'Example'].map(h => (
                  <th key={h} style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, textAlign: 'left', padding: '10px 12px', borderBottom: `1px solid ${C.border}`, letterSpacing: '0.1em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {POWERS.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < POWERS.length-1 ? `1px solid ${C.border}` : 'none' }}>
                  <td style={{ fontFamily: FONTS.mono, fontSize: 13, color: C.cyan, padding: '10px 12px', fontWeight: 700 }}>2^{row.power}</td>
                  <td style={{ fontFamily: FONTS.mono, fontSize: 11, color: C.textDim, padding: '10px 12px' }}>
                    {Math.pow(2, row.power).toLocaleString()}
                  </td>
                  <td style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.white, padding: '10px 12px', fontWeight: 600 }}>{row.val}</td>
                  <td style={{ fontFamily: FONTS.mono, fontSize: 12, color: C.green, padding: '10px 12px' }}>{row.bytes}</td>
                  <td style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textDim, padding: '10px 12px' }}>{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Latency Numbers Every Engineer Should Know" icon="⚡">
        <InfoBox type="info">
          These numbers from Jeff Dean (Google) give you intuition for what's fast vs slow.
          Memorize the orders of magnitude, not exact values.
        </InfoBox>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px' }}>
          {LATENCIES.map(l => (
            <LatencyBar key={l.op} {...l} maxNs={150000000} />
          ))}
        </div>
        <ConceptGrid>
          <ConceptCard title="Memory is Fast" icon="⚡" color={C.green}>
            L1 cache: 0.5ns. RAM: 100ns. That's 200× difference. Always cache hot data in memory.
          </ConceptCard>
          <ConceptCard title="SSD vs HDD" icon="💿" color={C.amber}>
            SSD seek: ~150μs. HDD seek: ~10ms. SSD is 65× faster — worth the cost for databases.
          </ConceptCard>
          <ConceptCard title="Network Is Slow" icon="🌐" color={C.red}>
            CA → Netherlands round trip: 150ms. Design systems to minimize network round trips.
            Batch operations when possible.
          </ConceptCard>
          <ConceptCard title="Compression Wins" icon="📦" color={C.purple}>
            Compress data before network transfer. Saves bandwidth, often reduces total time
            despite CPU cost of compression.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Common Availability Numbers" icon="📊">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['SLA', 'Uptime %', 'Downtime/Year', 'Downtime/Month', 'Downtime/Week'].map(h => (
                  <th key={h} style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, textAlign: 'left', padding: '8px 12px', borderBottom: `1px solid ${C.border}`, letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Two 9s', '99%', '87.6 hours', '7.2 hours', '1.68 hours'],
                ['Three 9s', '99.9%', '8.76 hours', '43.8 min', '10.1 min'],
                ['Four 9s', '99.99%', '52.6 min', '4.38 min', '1.01 min'],
                ['Five 9s', '99.999%', '5.26 min', '26.3 sec', '6.05 sec'],
              ].map(([sla, up, yr, mo, wk], i) => (
                <tr key={i} style={{ borderBottom: i < 3 ? `1px solid ${C.border}` : 'none' }}>
                  <td style={{ fontFamily: FONTS.mono, fontSize: 12, color: i >= 2 ? C.green : C.textDim, padding: '9px 12px', fontWeight: i >= 2 ? 700 : 400 }}>{sla}</td>
                  <td style={{ fontFamily: FONTS.mono, fontSize: 12, color: C.cyan, padding: '9px 12px' }}>{up}</td>
                  <td style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textDim, padding: '9px 12px' }}>{yr}</td>
                  <td style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textDim, padding: '9px 12px' }}>{mo}</td>
                  <td style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textDim, padding: '9px 12px' }}>{wk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <InfoBox type="tip">
          Enterprise services typically target 99.99% (four 9s). AWS S3 offers 99.999999999% (11 9s) durability.
          <strong> Note: durability ≠ availability.</strong>
        </InfoBox>
      </Section>

      <Section title="Interactive QPS Calculator" icon="🧮">
        <Calculator />
        <SubSection title="Estimation Framework">
          <CodeBlock lang="mental model" code={`QPS Estimation:
  DAU × actions/day / 86400 seconds = avg QPS
  Peak QPS ≈ 2-3× avg QPS (rule of thumb)

Storage Estimation:
  QPS × bytes/request × seconds-in-period = storage
  Add 20% buffer for metadata/indexes

Bandwidth Estimation:
  Peak QPS × avg request size = inbound bandwidth
  Peak QPS × avg response size = outbound bandwidth

Example: Twitter-like app
  300M DAU × 5 tweets/day = 1.5B tweets/day
  1.5B / 86400 ≈ 17,500 tweets/sec (avg QPS)
  Peak: ~35,000 QPS
  Storage: 17,500 × 280 bytes ≈ 4.9 MB/sec ≈ 420 GB/day`} />
        </SubSection>
      </Section>

      <Section title="Tips for the Interview" icon="💡">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'Write your assumptions at the top — "I\'ll assume 10M DAU, 10 actions/day"',
            'Use round numbers: 10M not 8.7M, 86,400 ≈ 100K seconds/day',
            'QPS: DAU × actions/day ÷ 86,400',
            'Peak QPS = average × 2-3 (depends on traffic pattern)',
            '1 character = 1 byte (ASCII). UTF-8 common text ≈ 1-2 bytes/char',
            'Typical metadata row ≈ 1-5 KB. Image ≈ 300 KB. Video minute ≈ 5 MB',
            'Always calculate both storage and bandwidth',
            'Mention caching reduces read bandwidth (cache hit ratio ~80-95%)',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', gap: 10, padding: '8px 0',
              borderBottom: i < 7 ? `1px solid ${C.border}` : 'none',
            }}>
              <span style={{ color: C.cyan, fontFamily: FONTS.mono, fontSize: 11, flexShrink: 0, lineHeight: 1.5 }}>
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
