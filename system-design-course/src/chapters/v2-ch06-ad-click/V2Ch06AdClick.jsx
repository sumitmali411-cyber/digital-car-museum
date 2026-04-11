import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Section, SubSection, InfoBox, ConceptGrid, ConceptCard,
  StepList, TradeoffTable, CodeBlock,
} from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── Lambda Architecture Diagram ─────────────────────────────────────────────
function LambdaDiagram() {
  return (
    <svg viewBox="0 0 700 300" style={{ width: '100%', maxHeight: 300 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr-ad" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={C.cyan} />
        </marker>
      </defs>

      {/* Data source */}
      <rect x="10" y="120" width="80" height="50" rx="6" fill="rgba(6,182,212,0.08)" stroke={C.cyan} strokeWidth="1.5"/>
      <text x="50" y="142" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono">AD CLICK</text>
      <text x="50" y="156" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono">EVENTS</text>
      <text x="50" y="168" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">Kafka topic</text>

      {/* Fork to batch and stream */}
      <line x1="90" y1="145" x2="130" y2="80" stroke={C.cyan} strokeWidth="1" markerEnd="url(#arr-ad)"/>
      <line x1="90" y1="145" x2="130" y2="215" stroke={C.cyan} strokeWidth="1" markerEnd="url(#arr-ad)"/>

      {/* Batch Layer */}
      <rect x="130" y="50" width="150" height="60" rx="6" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" strokeWidth="1.5"/>
      <text x="205" y="74" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">BATCH LAYER</text>
      <text x="205" y="90" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">Spark / MapReduce</text>
      <text x="205" y="103" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">hourly / daily jobs</text>

      {/* Speed Layer */}
      <rect x="130" y="185" width="150" height="60" rx="6" fill="rgba(16,185,129,0.08)" stroke={C.green} strokeWidth="1.5"/>
      <text x="205" y="209" textAnchor="middle" fill={C.green} fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">SPEED LAYER</text>
      <text x="205" y="225" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">Flink / Spark Streaming</text>
      <text x="205" y="238" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">real-time processing</text>

      {/* Batch views */}
      <rect x="330" y="50" width="120" height="60" rx="6" fill="rgba(167,139,250,0.05)" stroke={`#a78bfa50`} strokeWidth="1"/>
      <text x="390" y="74" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono">BATCH VIEWS</text>
      <text x="390" y="90" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">HDFS / S3</text>
      <text x="390" y="103" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">accurate, slow</text>
      <line x1="280" y1="80" x2="330" y2="80" stroke="#a78bfa50" strokeWidth="1" markerEnd="url(#arr-ad)"/>

      {/* Real-time views */}
      <rect x="330" y="185" width="120" height="60" rx="6" fill="rgba(16,185,129,0.05)" stroke={`${C.green}50`} strokeWidth="1"/>
      <text x="390" y="209" textAnchor="middle" fill={C.green} fontSize="9" fontFamily="JetBrains Mono">REALTIME VIEWS</text>
      <text x="390" y="225" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">Redis / Druid</text>
      <text x="390" y="238" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">approximate, fast</text>
      <line x1="280" y1="215" x2="330" y2="215" stroke={`${C.green}50`} strokeWidth="1" markerEnd="url(#arr-ad)"/>

      {/* Serving layer */}
      <rect x="500" y="110" width="110" height="70" rx="6" fill="rgba(245,158,11,0.08)" stroke={C.amber} strokeWidth="1.5"/>
      <text x="555" y="133" textAnchor="middle" fill={C.amber} fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">SERVING</text>
      <text x="555" y="149" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">LAYER</text>
      <text x="555" y="165" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">merge + serve</text>
      <line x1="450" y1="80" x2="500" y2="130" stroke={`#a78bfa50`} strokeWidth="1" markerEnd="url(#arr-ad)"/>
      <line x1="450" y1="215" x2="500" y2="165" stroke={`${C.green}50`} strokeWidth="1" markerEnd="url(#arr-ad)"/>

      {/* Advertiser dashboard */}
      <rect x="620" y="120" width="70" height="50" rx="5" fill="#1a2236" stroke={C.border} strokeWidth="1"/>
      <text x="655" y="142" textAnchor="middle" fill={C.textDim} fontSize="8" fontFamily="JetBrains Mono">ADVERTISER</text>
      <text x="655" y="155" textAnchor="middle" fill={C.textDim} fontSize="8" fontFamily="JetBrains Mono">DASHBOARD</text>
      <line x1="610" y1="145" x2="620" y2="145" stroke={C.amber} strokeWidth="1" markerEnd="url(#arr-ad)"/>

      <text x="350" y="285" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="Space Grotesk">
        Lambda Architecture: batch accuracy + stream freshness, merged at serving layer
      </text>
    </svg>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function V2Ch06AdClick() {
  return (
    <div>
      <Section title="High-Throughput Ingestion" icon="📢">
        <InfoBox type="info">
          At Google/Facebook scale, ad click events arrive at billions per day — roughly
          100K–500K events/second at peak. The ingestion layer must absorb spikes without
          dropping events or blocking the user-facing ad server.
        </InfoBox>

        <StepList steps={[
          { title: 'Browser/app fires click event', body: 'On ad click, client sends a POST to the click tracking endpoint with: ad_id, user_id (hashed), timestamp, placement context. Response must be sub-10ms — user is waiting for redirect.' },
          { title: 'Click server validates and publishes', body: 'The click server performs minimal validation (valid ad_id, not obviously malformed), stamps server-side timestamp, and publishes to Kafka click_events topic. Returns redirect immediately without waiting for processing.' },
          { title: 'Kafka buffers the event stream', body: 'Kafka acts as a durable buffer, absorbing spikes. Partitioned by ad_id for per-ad ordering. Multiple consumer groups (aggregator, fraud detector, billing) consume independently at their own pace.' },
          { title: 'Stream processors consume and aggregate', body: 'Apache Flink or Spark Streaming reads from Kafka, applies time-windowed aggregations (clicks per ad per minute), deduplicates, and writes results to both real-time views (Redis) and batch storage (HDFS/S3).' },
        ]} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginTop: 16 }}>
          {[
            { value: '500K', label: 'Peak clicks/sec', color: C.cyan },
            { value: '<10ms', label: 'Click API latency', color: C.green },
            { value: '10B+', label: 'Events/day at scale', color: C.amber },
            { value: '7 days', label: 'Kafka retention', color: C.purple },
          ].map(s => (
            <div key={s.label} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 10, color: C.textMuted, marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Lambda Architecture" icon="λ">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 16px' }}>
          Lambda Architecture solves the fundamental tension between <strong style={{ color: C.white }}>accuracy</strong>
          (batch processing) and <strong style={{ color: C.white }}>freshness</strong> (stream processing).
          Data flows through two paths simultaneously: a batch layer for accurate historical reports
          and a speed layer for real-time approximations.
        </p>
        <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px', marginBottom: 16 }}>
          <LambdaDiagram />
        </div>

        <ConceptGrid>
          <ConceptCard title="Batch Layer" icon="🏗️" color="#a78bfa">
            Reprocesses all historical data on a schedule (hourly/daily). Produces accurate,
            complete aggregate views. Slow — results available with N-hour delay. Uses Spark
            or MapReduce on HDFS/S3.
          </ConceptCard>
          <ConceptCard title="Speed Layer" icon="⚡" color={C.green}>
            Processes only recent data (last N minutes). Produces approximate results within
            seconds. Compensates for batch latency. Uses Flink/Spark Streaming writing to
            Redis or Druid.
          </ConceptCard>
          <ConceptCard title="Serving Layer" icon="🍽️" color={C.amber}>
            Merges batch views + real-time views on read. Advertiser sees: accurate batch data
            for old periods + approximate real-time data for the current window. Hides complexity.
          </ConceptCard>
          <ConceptCard title="Kappa Architecture" icon="κ" color={C.cyan}>
            Simplified alternative: stream processing only, reprocess by replaying Kafka.
            Avoids maintaining two codebases. Works when stream processor is fast enough for
            historical reprocessing.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Exactly-Once Counting Challenges" icon="🎯">
        <InfoBox type="warn">
          <strong>The deduplication problem:</strong> A user may click the same ad multiple times
          (double-click, retry on slow network, browser back/forward). At-least-once Kafka delivery
          can redeliver events. Billing requires exactly-once counting — charging advertisers
          for phantom clicks is a legal and financial liability.
        </InfoBox>

        <SubSection title="Deduplication Strategies">
          <TradeoffTable rows={[
            {
              approach: 'Client-side dedup key',
              pros: 'Simple. Key generated at client (UUID or hash of ad_id + user + timestamp window).',
              cons: 'Malicious clients can forge keys. Requires key storage at server.',
              when: 'First line of defense for legitimate user behavior.',
            },
            {
              approach: 'Server-side idempotency key',
              pros: 'Authoritative. Check against Redis SET before counting. Bloom filter for efficiency.',
              cons: 'Redis memory scales with unique events (limit to 24h window).',
              when: 'Standard approach: dedupe window matches billing period.',
            },
            {
              approach: 'Flink exactly-once processing',
              pros: 'End-to-end exactly-once with Flink checkpointing + Kafka transactions.',
              cons: 'Complex setup. Higher latency due to checkpointing intervals.',
              when: 'Highest-stakes counting (real-money billing pipelines).',
            },
          ]} />
        </SubSection>

        <CodeBlock lang="deduplication with redis bloom filter" code={`# Bloom filter: probabilistic set membership
# False positive rate: ~0.1% with optimal sizing
# Memory: 1B items ≈ 1.2GB (vs 40GB for exact HashSet)

CLICK_DEDUP_KEY = "dedup:clicks:{date}"

def process_click(event):
    # Check bloom filter first (fast path)
    if redis.bf_exists(CLICK_DEDUP_KEY, event.click_id):
        return  # Probable duplicate → skip

    # Add to bloom filter (no false negatives)
    redis.bf_add(CLICK_DEDUP_KEY, event.click_id)

    # Atomically increment counter
    redis.hincrby(f"ad_clicks:{event.ad_id}", event.date, 1)`} />
      </Section>

      <Section title="MapReduce Aggregation" icon="🗺️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Batch aggregation uses MapReduce to compute accurate click counts across dimensions
          (ad_id, campaign_id, creative_id, geo, device) for billing reports and analytics.
        </p>
        <CodeBlock lang="mapreduce pseudocode" code={`# Map phase: emit (key, 1) for each click event
def map(click_event):
    yield (click_event.ad_id + ":" + click_event.date, 1)
    yield (click_event.campaign_id + ":" + click_event.date, 1)

# Combiner (local pre-aggregation before shuffle):
def combine(key, values):
    yield (key, sum(values))

# Reduce phase: sum all counts per key
def reduce(key, values):
    total = sum(values)
    emit_to_results_table(key, total)

# Typical job: 10B events / 3600 mappers → 2-hour runtime
# Output: accurate click counts per (ad, campaign, date, hour)`} />

        <InfoBox type="tip">
          Modern systems use Apache Spark instead of raw MapReduce — same paradigm but
          with in-memory processing (100x faster). For real-time, Spark Structured Streaming
          or Apache Flink provides the speed layer equivalent.
        </InfoBox>
      </Section>

      <Section title="Real-time vs Near-Real-time Reporting" icon="⏱️">
        <ConceptGrid>
          <ConceptCard title="Real-time (seconds)" icon="⚡" color={C.green}>
            Flink windowed aggregations → Redis counters. Advertisers see clicks updated every
            ~10 seconds. Approximate — deduplication is probabilistic. Used for pacing and
            budget management.
          </ConceptCard>
          <ConceptCard title="Near-Real-time (minutes)" icon="🕒" color={C.cyan}>
            Micro-batch Spark jobs every 5 minutes → Druid OLAP. Accurate within the batch
            window. Used for real-time campaign dashboards with drill-down capability.
          </ConceptCard>
          <ConceptCard title="Batch Accurate (hours)" icon="📊" color="#a78bfa">
            Full MapReduce/Spark batch job every hour or daily. Authoritative numbers for
            billing, invoicing, and reconciliation. Results override near-real-time data
            in the serving layer.
          </ConceptCard>
          <ConceptCard title="Serving Layer Merge" icon="🔀" color={C.amber}>
            Query: "show clicks for ad 123 today". Serving layer returns batch data up to
            last batch boundary + real-time data since then. Invisible to advertiser.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Fraud Detection" icon="🕵️">
        <InfoBox type="danger">
          Click fraud costs advertisers ~$35B/year. Fraudsters use bot farms, click rings,
          and competitor sabotage. Detection must happen in real-time (before counting) or
          near-real-time (before billing runs).
        </InfoBox>

        <StepList steps={[
          { title: 'Rule-based detection (milliseconds)', body: 'Block clicks with: same IP > N clicks/minute on same ad, known bot user-agents, datacenter IP ranges, click timestamps with inhuman precision (exactly every 1000ms).' },
          { title: 'Statistical anomaly detection (minutes)', body: 'Stream processing computes click-through rates per ad. If CTR for an ad spikes from 0.1% to 15% within 5 minutes, flag for review. Model expected CTR from historical data.' },
          { title: 'ML model scoring (seconds)', body: 'Each click scored by a lightweight ML model: features include device fingerprint, mouse movement patterns, session depth, time-on-page. Clicks with fraud score > threshold marked invalid.' },
          { title: 'Post-billing reconciliation', body: 'Daily reconciliation job rechecks all clicks against updated fraud models. Invalid clicks credited back to advertiser in next billing cycle. Builds trust and reduces disputes.' },
        ]} />
      </Section>

      <Section title="Data Reconciliation" icon="🔍">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Discrepancies between advertiser-reported clicks and your system counts are inevitable.
          Reconciliation identifies and resolves these gaps before invoicing.
        </p>
        <CodeBlock lang="reconciliation pipeline" code={`# Daily reconciliation job
SELECT
    ad_id,
    our_click_count,
    advertiser_pixel_count,
    ABS(our_click_count - advertiser_pixel_count) AS discrepancy,
    ROUND(discrepancy / our_click_count * 100, 2) AS discrepancy_pct
FROM
    billing_clicks bc
    JOIN advertiser_reports ar USING (ad_id, date)
WHERE
    discrepancy_pct > 5  -- investigate > 5% discrepancy

-- Common causes of discrepancy:
-- 1. Advertiser pixel blocked by browser extensions
-- 2. Network timeouts on redirect chain
-- 3. Bot clicks our pixel but not advertiser's
-- 4. Clock skew between systems`} />

        <InfoBox type="info">
          Industry standard: accept up to 10% discrepancy between buy-side and sell-side
          click counts due to measurement methodology differences. For larger gaps, flag
          for manual review and potential credit issuance.
        </InfoBox>
      </Section>

      <Section title="Interview Checklist" icon="✅">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'Scale: clarify peak QPS — design for 500K clicks/sec with Kafka buffer',
            'Click API must respond <10ms: publish to Kafka, redirect immediately',
            'Lambda Architecture: batch (accurate) + stream (fresh) + serving layer merge',
            'Deduplication: Bloom filter in Redis, size for 24h window per billing period',
            'Exactly-once: Flink checkpointing + Kafka transactions for billing pipelines',
            'Fraud detection: rule-based (ms) → ML scoring (s) → reconciliation (daily)',
            'MapReduce/Spark batch for authoritative billing numbers',
            'Flink/Spark Streaming for real-time pacing and budget management',
            'Data reconciliation: alert on >5% discrepancy with advertiser pixel counts',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '8px 0', borderBottom: i < 8 ? `1px solid ${C.border}` : 'none',
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
