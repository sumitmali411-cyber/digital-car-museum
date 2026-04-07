import { useState } from 'react'
import { Section, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

function SnowflakeViz() {
  const [generated, setGenerated] = useState(null)

  const generate = () => {
    const ts = Date.now() - 1288834974657 // Twitter epoch
    const dc = Math.floor(Math.random() * 32)
    const machine = Math.floor(Math.random() * 32)
    const seq = Math.floor(Math.random() * 4096)
    const id = BigInt(ts) << 22n | BigInt(dc) << 17n | BigInt(machine) << 12n | BigInt(seq)
    setGenerated({ ts, dc, machine, seq, id: id.toString() })
  }

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px' }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, letterSpacing: '0.15em', marginBottom: 16 }}>
        TWITTER SNOWFLAKE — 64-BIT ID STRUCTURE
      </div>

      {/* Bit layout */}
      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <svg viewBox="0 0 680 80" style={{ width: '100%', minWidth: 400 }}>
          {[
            { label: '1 bit', sublabel: 'sign', width: 30, color: C.red, x: 5 },
            { label: '41 bits', sublabel: 'timestamp (ms)', width: 200, color: C.cyan, x: 35 },
            { label: '5 bits', sublabel: 'datacenter', width: 80, color: C.green, x: 235 },
            { label: '5 bits', sublabel: 'machine', width: 80, color: C.amber, x: 315 },
            { label: '12 bits', sublabel: 'sequence', width: 130, color: C.purple, x: 395 },
          ].map((seg, i) => (
            <g key={i}>
              <rect x={seg.x} y="5" width={seg.width - 4} height="44" rx="4"
                fill={`${seg.color}15`} stroke={seg.color} strokeWidth="1"/>
              <text x={seg.x + (seg.width-4)/2} y="24" textAnchor="middle"
                fill={seg.color} fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">{seg.label}</text>
              <text x={seg.x + (seg.width-4)/2} y="40" textAnchor="middle"
                fill={C.textMuted} fontSize="8" fontFamily="Space Grotesk">{seg.sublabel}</text>
            </g>
          ))}
          <text x="5" y="70" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">bit 63</text>
          <text x="525" y="70" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">bit 0</text>
        </svg>
      </div>

      <button onClick={generate} style={{
        background: 'rgba(6,182,212,0.1)', border: `1px solid ${C.cyan}`,
        color: C.cyan, fontFamily: FONTS.mono, fontSize: 11,
        padding: '8px 16px', borderRadius: 6, cursor: 'pointer',
        marginBottom: 12,
      }}>
        ⚡ GENERATE SNOWFLAKE ID
      </button>

      {generated && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {[
            { label: 'Snowflake ID', value: generated.id, color: C.white },
            { label: 'Timestamp offset', value: `${generated.ts}ms`, color: C.cyan },
            { label: 'Data Center ID', value: generated.dc, color: C.green },
            { label: 'Machine ID', value: generated.machine, color: C.amber },
            { label: 'Sequence', value: generated.seq, color: C.purple },
          ].map(s => (
            <div key={s.label} style={{
              background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 6, padding: '10px 12px',
            }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: C.textMuted, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 700, color: s.color, wordBreak: 'break-all' }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Ch07UniqueId() {
  return (
    <div>
      <Section title="Requirements" icon="📋">
        <InfoBox type="info">
          A distributed unique ID generator must produce IDs that are: globally unique,
          64-bit (fits in a long), sortable by time (for indexing), generated at &gt;10K/sec per machine,
          and highly available — all without a centralized coordinator.
        </InfoBox>
      </Section>

      <Section title="Approaches Compared" icon="⚖️">
        <TradeoffTable rows={[
          {
            approach: 'UUID (v4)',
            pros: 'Simple. No coordination. Universally supported.',
            cons: 'Not sortable. 128-bit (2× storage). Random = index fragmentation.',
            when: 'Non-time-series data. No sort requirement.',
          },
          {
            approach: 'Database AUTO_INCREMENT',
            pros: 'Simple. Sortable. Human-friendly.',
            cons: 'Single point of failure. Bottleneck at scale. Multi-master conflict.',
            when: 'Single-DB apps. Low write throughput.',
          },
          {
            approach: 'Ticket Server (Flickr)',
            pros: 'Numeric IDs. Simple. Works across services.',
            cons: 'Single ticket DB = SPOF. Network round-trip per ID.',
            when: 'Multi-service with moderate scale (< 10K/s).',
          },
          {
            approach: 'Twitter Snowflake',
            pros: 'Time-sortable. 64-bit. No coordination. 4096/ms per machine.',
            cons: 'Clock skew vulnerability. Requires NTP + guard logic.',
            when: 'High-scale distributed systems. Used by Twitter, Discord, Instagram.',
          },
        ]} />
      </Section>

      <Section title="Twitter Snowflake Deep Dive" icon="❄️">
        <SnowflakeViz />

        <div style={{ marginTop: 16 }}>
          <ConceptGrid>
            <ConceptCard title="41-bit Timestamp" icon="⏱️" color={C.cyan}>
              Milliseconds since custom epoch (e.g., 2010-11-04). Supports 2^41 ms ≈ 69 years.
              <strong style={{ color: C.white }}> Enables time-sorting without extra queries.</strong>
            </ConceptCard>
            <ConceptCard title="10-bit Machine ID" icon="🖥️" color={C.green}>
              5 bits datacenter + 5 bits machine = 32 DCs × 32 machines = 1024 nodes.
              Assigned at startup. Never conflicts.
            </ConceptCard>
            <ConceptCard title="12-bit Sequence" icon="🔢" color={C.amber}>
              Auto-increment per millisecond, resets to 0 each ms.
              Allows 4096 IDs per millisecond per machine = <strong style={{ color: C.white }}>4M IDs/sec per node.</strong>
            </ConceptCard>
            <ConceptCard title="Clock Skew Problem" icon="⚠️" color={C.red}>
              If NTP syncs clock backward, duplicate IDs are possible. Solution: wait until
              current time &gt; last generated time. For large skews, raise an exception.
            </ConceptCard>
          </ConceptGrid>
        </div>

        <CodeBlock lang="java" code={`public class SnowflakeIdGenerator {
    private static final long EPOCH = 1288834974657L; // Nov 04, 2010
    private static final int MACHINE_ID_BITS = 10;    // 5 DC + 5 machine
    private static final int SEQUENCE_BITS = 12;
    private static final long MAX_SEQUENCE = (1L << SEQUENCE_BITS) - 1; // 4095

    private final long machineId;
    private long lastTimestamp = -1L;
    private long sequence = 0L;

    public synchronized long nextId() {
        long ts = currentMs();
        if (ts < lastTimestamp) {
            throw new RuntimeException("Clock moved backwards! Refusing to generate id");
        }
        if (ts == lastTimestamp) {
            sequence = (sequence + 1) & MAX_SEQUENCE;
            if (sequence == 0) ts = waitNextMs(lastTimestamp); // sequence exhausted
        } else {
            sequence = 0;
        }
        lastTimestamp = ts;
        return ((ts - EPOCH) << (MACHINE_ID_BITS + SEQUENCE_BITS))
             | (machineId << SEQUENCE_BITS)
             | sequence;
    }
}`} />
      </Section>

      <Section title="Instagram's Approach" icon="📸">
        <InfoBox type="tip">
          Instagram generates IDs in Postgres using PL/pgSQL — no application changes needed.
          Each shard generates its own IDs with a shard suffix to prevent collisions.
        </InfoBox>
        <CodeBlock lang="sql" code={`-- Instagram's PL/pgSQL ID generator
CREATE SEQUENCE insta_id_seq;

CREATE OR REPLACE FUNCTION insta_id(shard_id INT) RETURNS BIGINT AS $$
DECLARE
    our_epoch BIGINT := 1314220021721;  -- Sep 2011 epoch
    seq_id BIGINT;
    now_ms BIGINT;
    shard BIGINT := shard_id;
BEGIN
    SELECT nextval('insta_id_seq') % 1024 INTO seq_id;
    SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000) INTO now_ms;
    RETURN (now_ms - our_epoch) << 23   -- 41 bits time
         | (shard << 10)                -- 13 bits shard
         | (seq_id);                    -- 10 bits sequence
END;
$$ LANGUAGE plpgsql;`} />
      </Section>
    </div>
  )
}
