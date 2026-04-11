import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Section, SubSection, InfoBox, ConceptGrid, ConceptCard,
  StepList, TradeoffTable, CodeBlock,
} from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── TSDB Internals Diagram ───────────────────────────────────────────────────
function TSDBDiagram() {
  return (
    <svg viewBox="0 0 700 240" style={{ width: '100%', maxHeight: 240 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr-ts" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={C.cyan} />
        </marker>
      </defs>

      {/* Ingestion */}
      <rect x="10" y="90" width="100" height="60" rx="6" fill="rgba(6,182,212,0.08)" stroke={C.cyan} strokeWidth="1.5"/>
      <text x="60" y="114" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono">METRIC</text>
      <text x="60" y="128" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono">INGESTOR</text>
      <text x="60" y="141" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">push/pull</text>
      <line x1="110" y1="120" x2="150" y2="120" stroke={C.cyan} strokeWidth="1.5" markerEnd="url(#arr-ts)"/>

      {/* Write-ahead buffer */}
      <rect x="150" y="80" width="110" height="80" rx="6" fill="rgba(245,158,11,0.08)" stroke={C.amber} strokeWidth="1.5"/>
      <text x="205" y="108" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">IN-MEMORY</text>
      <text x="205" y="122" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">BUFFER</text>
      <text x="205" y="138" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">WAL + hot data</text>
      <text x="205" y="150" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">2h window</text>
      <line x1="260" y1="120" x2="300" y2="120" stroke={C.amber} strokeWidth="1.5" markerEnd="url(#arr-ts)"/>

      {/* Compaction */}
      <rect x="300" y="90" width="100" height="60" rx="6" fill="rgba(16,185,129,0.08)" stroke={C.green} strokeWidth="1.5"/>
      <text x="350" y="114" textAnchor="middle" fill={C.green} fontSize="9" fontFamily="JetBrains Mono">COMPACTOR</text>
      <text x="350" y="128" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">chunk encoding</text>
      <text x="350" y="141" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">delta-of-delta</text>
      <line x1="400" y1="120" x2="440" y2="120" stroke={C.green} strokeWidth="1.5" markerEnd="url(#arr-ts)"/>

      {/* Storage tiers */}
      <rect x="440" y="60" width="110" height="50" rx="6" fill="rgba(6,182,212,0.08)" stroke={`${C.cyan}60`} strokeWidth="1"/>
      <text x="495" y="82" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono">HOT STORAGE</text>
      <text x="495" y="96" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">SSD — 0-15 days</text>
      <line x1="440" y1="85" x2="400" y2="105" stroke={`${C.cyan}40`} strokeWidth="1" strokeDasharray="3,2"/>

      <rect x="440" y="125" width="110" height="50" rx="6" fill="rgba(167,139,250,0.08)" stroke={`#a78bfa50`} strokeWidth="1"/>
      <text x="495" y="147" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono">COLD STORAGE</text>
      <text x="495" y="161" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">S3/GCS — months</text>

      {/* Query engine */}
      <rect x="590" y="90" width="100" height="60" rx="6" fill="rgba(239,68,68,0.08)" stroke={`${C.red}60`} strokeWidth="1.5"/>
      <text x="640" y="114" textAnchor="middle" fill={C.red} fontSize="9" fontFamily="JetBrains Mono">QUERY</text>
      <text x="640" y="128" textAnchor="middle" fill={C.red} fontSize="9" fontFamily="JetBrains Mono">ENGINE</text>
      <text x="640" y="141" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">PromQL / APIs</text>
      <line x1="550" y1="85" x2="590" y2="105" stroke={`${C.red}50`} strokeWidth="1" markerEnd="url(#arr-ts)"/>
      <line x1="550" y1="150" x2="590" y2="130" stroke={`${C.red}50`} strokeWidth="1" markerEnd="url(#arr-ts)"/>

      <text x="350" y="225" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="Space Grotesk">
        TSDB pipeline: ingest → buffer → compact → tiered storage → query
      </text>
    </svg>
  )
}

// ─── Metric Types Tab ─────────────────────────────────────────────────────────
function MetricTypeTabs() {
  const [active, setActive] = useState(0)
  const types = [
    {
      label: 'Counter',
      color: C.cyan,
      desc: 'Monotonically increasing value that resets to zero on restart. Never decreases. Used to count events.',
      examples: ['http_requests_total', 'errors_total', 'bytes_sent_total'],
      code: `# Prometheus counter
http_requests = Counter('http_requests_total',
    'Total HTTP requests', ['method', 'status'])

http_requests.labels(method='GET', status='200').inc()

# Query: requests per second over 5 min
rate(http_requests_total[5m])`,
    },
    {
      label: 'Gauge',
      color: C.green,
      desc: 'A value that can go up and down. Represents a snapshot of a current state.',
      examples: ['memory_usage_bytes', 'active_connections', 'queue_depth'],
      code: `# Prometheus gauge
memory_usage = Gauge('memory_usage_bytes',
    'Current memory usage')

memory_usage.set(get_memory_bytes())

# Query: current memory usage
memory_usage_bytes{instance="server1"}`,
    },
    {
      label: 'Histogram',
      color: C.amber,
      desc: 'Samples observations and counts them in configurable buckets. Used for latency percentiles.',
      examples: ['http_request_duration_seconds', 'db_query_duration_ms'],
      code: `# Prometheus histogram
request_duration = Histogram(
    'http_request_duration_seconds',
    'Request duration',
    buckets=[0.01, 0.05, 0.1, 0.5, 1.0, 5.0]
)

with request_duration.time():
    handle_request()

# Query: 99th percentile latency
histogram_quantile(0.99,
  rate(http_request_duration_seconds_bucket[5m]))`,
    },
  ]

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
        {types.map((t, i) => (
          <button key={i} onClick={() => setActive(i)} style={{
            flex: 1, padding: '10px', background: 'none', border: 'none',
            borderBottom: active === i ? `2px solid ${t.color}` : '2px solid transparent',
            fontFamily: FONTS.mono, fontSize: 10, color: active === i ? t.color : C.textMuted,
            cursor: 'pointer', transition: 'color 0.15s',
          }}>{t.label}</button>
        ))}
      </div>
      <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '20px 24px' }}>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          {types[active].desc}
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {types[active].examples.map(ex => (
            <span key={ex} style={{
              fontFamily: FONTS.mono, fontSize: 10, color: types[active].color,
              background: `${types[active].color}15`, border: `1px solid ${types[active].color}30`,
              borderRadius: 4, padding: '3px 8px',
            }}>{ex}</span>
          ))}
        </div>
        <CodeBlock lang="python + promql" code={types[active].code} />
      </motion.div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function V2Ch05Metrics() {
  return (
    <div>
      <Section title="Pull vs Push Collection" icon="📊">
        <InfoBox type="info">
          Two opposing models for how metrics flow from services to the monitoring system.
          Prometheus popularized pull; StatsD/Datadog agent use push. The choice affects
          network topology, service discovery, and failure modes.
        </InfoBox>

        <TradeoffTable rows={[
          {
            approach: 'Pull (Prometheus model)',
            pros: 'Central control of scrape interval. Easy to detect dead targets (no scrape = alert). Config in one place. Simpler firewall rules (scraper → targets).',
            cons: 'Scraper must be able to reach targets. Doesn\'t work well behind NAT/firewalls. Short-lived jobs (batch) die before scrape.',
            when: 'Long-running services, Kubernetes workloads. Use Pushgateway for batch jobs.',
          },
          {
            approach: 'Push (StatsD/Datadog/OpenTelemetry)',
            pros: 'Works with short-lived jobs (Lambda, batch). No need to expose HTTP endpoint. Fire-and-forget from services.',
            cons: 'Central aggregator can be overwhelmed. Harder to detect silent failures (service stops pushing without alerting).',
            when: 'Serverless, FaaS, batch jobs, mobile SDKs. Also when targets are behind NAT.',
          },
        ]} />

        <InfoBox type="tip">
          Modern observability platforms (Grafana Cloud, Datadog) support both. Prometheus remote_write
          allows push to remote endpoints, blending both models. For interviews, default to pull for
          server-side metrics and push for ephemeral jobs.
        </InfoBox>
      </Section>

      <Section title="TSDB Internals" icon="🗃️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 16px' }}>
          Time-series databases are optimized for write-heavy, time-ordered workloads. They exploit
          temporal locality — most queries target recent data — and use compression that leverages
          the predictable nature of time-series data.
        </p>
        <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px', marginBottom: 16 }}>
          <TSDBDiagram />
        </div>

        <SubSection title="Gorilla Compression (Used in Prometheus, Thanos)">
          <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
            Facebook's Gorilla paper (2015) demonstrated that time-series data is highly compressible.
            Two key insights: timestamps follow predictable cadences (delta-of-delta encoding), and
            values in monitoring metrics rarely change dramatically between scrapes (XOR encoding of
            IEEE 754 float64 representations).
          </p>
          <CodeBlock lang="compression insight" code={`# Delta-of-delta for timestamps
t0 = 1700000000 (base)
t1 = 1700000015 (delta = +15s)
t2 = 1700000030 (delta = +15s → delta-of-delta = 0)
t3 = 1700000045 (delta = +15s → delta-of-delta = 0)
# Most timestamps encode to 0 bits after first delta!

# XOR for float values (e.g. CPU = 42.3, 42.4, 42.2%)
value[i] XOR value[i-1]  →  only changed bits stored
# Typical compression: 1.37 bytes per data point (vs 16 bytes raw)`} />
        </SubSection>
      </Section>

      <Section title="Metric Types: Counter, Gauge, Histogram" icon="📐">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Prometheus defines four metric types. Understanding which to use for a given signal
          is a core observability skill:
        </p>
        <MetricTypeTabs />
      </Section>

      <Section title="Alerting and Anomaly Detection" icon="🚨">
        <SubSection title="Threshold-Based Alerts (Prometheus Alertmanager)">
          <CodeBlock lang="yaml (prometheus alert rule)" code={`groups:
- name: api_alerts
  rules:
  - alert: HighErrorRate
    expr: |
      rate(http_requests_total{status=~"5.."}[5m])
      / rate(http_requests_total[5m]) > 0.05
    for: 2m          # must be true for 2 min (avoid flapping)
    labels:
      severity: critical
    annotations:
      summary: "Error rate > 5% for {{ $labels.service }}"
      runbook_url: "https://runbooks.example.com/high-error-rate"

  - alert: P99LatencyHigh
    expr: |
      histogram_quantile(0.99,
        rate(request_duration_seconds_bucket[5m])) > 0.5
    for: 5m
    labels:
      severity: warning`} />
        </SubSection>

        <ConceptGrid>
          <ConceptCard title="Static Thresholds" icon="📏" color={C.cyan}>
            Simple and predictable. Set CPU alert at 80%, error rate at 1%. Brittle for metrics
            with strong seasonality — generates false positives on peak traffic days.
          </ConceptCard>
          <ConceptCard title="Anomaly Detection" icon="🤖" color={C.purple}>
            ML-based (Datadog, CloudWatch). Models seasonality and trends automatically.
            Alert when value deviates from predicted range by N sigma. Reduces false positives.
          </ConceptCard>
          <ConceptCard title="Burn Rate Alerts" icon="🔥" color={C.amber}>
            SLO-based alerting. If error budget burns 14x faster than normal, alert immediately.
            Correlates alert urgency with SLO impact — the most actionable alerting strategy.
          </ConceptCard>
          <ConceptCard title="Dead Man's Switch" icon="☠️" color={C.red}>
            Alert that fires when it STOPS receiving a heartbeat metric. Catches total failure
            of the monitoring pipeline itself — a critical blind spot for threshold alerts.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Cardinality Problem" icon="⚠️">
        <InfoBox type="danger">
          <strong>High cardinality is the #1 TSDB killer.</strong> Each unique combination of label
          values creates a new time series. A metric with labels {'{'}user_id, endpoint, status{'}'} across
          10M users × 1K endpoints × 5 statuses = 50 billion time series. Prometheus runs out of memory.
        </InfoBox>

        <SubSection title="Cardinality Anti-Patterns">
          <CodeBlock lang="prometheus labels (bad vs good)" code={`# BAD: high-cardinality label
http_requests_total{user_id="u_8f2a9c3d"}   # 10M unique users!
http_requests_total{url="/users/12345/profile"} # unique per user
http_requests_total{trace_id="abc123def456"}    # unbounded

# GOOD: low-cardinality labels
http_requests_total{endpoint="/users/:id/profile", method="GET", status="200"}
# Route template, not the actual URL value

# Rule: if a label's value set is > 1000 unique values, rethink
# Use tracing systems (Jaeger/Zipkin) for high-cardinality data like trace_id`} />
        </SubSection>

        <StepList steps={[
          { title: 'Audit label cardinality', body: 'Use Prometheus TSDB Analyzer or cardinality API to identify metrics with > 10K series. Common culprits: user IDs, request IDs, IP addresses, free-text labels.' },
          { title: 'Use recording rules for aggregation', body: 'Pre-compute expensive aggregations as new time series. Store sum(http_requests_total) by (service, status) instead of querying all individual series at dashboard load time.' },
          { title: 'Limit label values at ingestion', body: 'Implement a cardinality limiter at the ingestor layer — reject or drop new series above a per-metric threshold. Alert on approaching limits before they crash the TSDB.' },
        ]} />
      </Section>

      <Section title="Long-term Storage and Downsampling" icon="🗄️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Raw metrics at 15-second resolution are only useful for recent data. Storing years of data
          at full resolution wastes petabytes of storage. Downsampling retains statistical fidelity
          while dramatically reducing storage:
        </p>

        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Tier', 'Resolution', 'Retention', 'Storage', 'Use Case'].map(h => (
                  <th key={h} style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, letterSpacing: '0.1em', textAlign: 'left', padding: '10px 14px', borderBottom: `1px solid ${C.border}`, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Hot', '15s', '15 days', '~100GB/M series', 'Incident investigation, real-time dashboards'],
                ['Warm', '1m', '90 days', '~20GB/M series', 'Weekly trends, SLO tracking'],
                ['Cold', '5m', '1 year', '~5GB/M series', 'Capacity planning, QBRs'],
                ['Archive', '1h', '5+ years', '~500MB/M series', 'Compliance, long-term forecasting'],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: i < 3 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ fontFamily: FONTS.sans, fontSize: 12, color: j === 0 ? C.white : C.textDim, fontWeight: j === 0 ? 600 : 400, padding: '10px 14px', verticalAlign: 'top', lineHeight: 1.5 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InfoBox type="info">
          <strong>Thanos / Cortex / Mimir</strong> extend Prometheus with horizontally scalable
          long-term storage backed by object storage (S3/GCS). They implement downsampling
          automatically and provide global query across multiple Prometheus instances.
        </InfoBox>
      </Section>

      <Section title="Interview Checklist" icon="✅">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'Clarify: internal infra metrics or product analytics? SaaS or self-hosted?',
            'Pull model (Prometheus) for server workloads; push for ephemeral/batch jobs',
            'Use Counters for events, Gauges for state, Histograms for latency percentiles',
            'TSDB uses delta-of-delta + XOR compression — explain why it\'s efficient',
            'High cardinality kills TSDBs — never use user_id/trace_id as labels',
            'Implement recording rules to pre-aggregate expensive queries',
            'Alert on burn rate against SLOs, not just static thresholds',
            'Downsample: 15s hot (15d) → 1m warm (90d) → 5m cold (1y)',
            'Use Thanos/Cortex for multi-cluster, long-term, globally queryable metrics',
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
