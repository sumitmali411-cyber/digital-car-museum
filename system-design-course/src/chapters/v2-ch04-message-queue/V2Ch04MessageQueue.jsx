import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Section, SubSection, InfoBox, ConceptGrid, ConceptCard,
  StepList, TradeoffTable, CodeBlock,
} from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── Partition Diagram ────────────────────────────────────────────────────────
function PartitionDiagram() {
  return (
    <svg viewBox="0 0 700 280" style={{ width: '100%', maxHeight: 280 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr-mq" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={C.cyan} />
        </marker>
      </defs>

      {/* Producers */}
      {[40, 100, 160].map((y, i) => (
        <g key={i}>
          <rect x="10" y={y} width="80" height="30" rx="5" fill="#1a2236" stroke={C.border} strokeWidth="1"/>
          <text x="50" y={y + 19} textAnchor="middle" fill={C.textDim} fontSize="9" fontFamily="JetBrains Mono">Producer {i + 1}</text>
        </g>
      ))}
      <line x1="90" y1="55" x2="150" y2="100" stroke={C.cyan} strokeWidth="1" markerEnd="url(#arr-mq)"/>
      <line x1="90" y1="115" x2="150" y2="130" stroke={C.cyan} strokeWidth="1" markerEnd="url(#arr-mq)"/>
      <line x1="90" y1="175" x2="150" y2="160" stroke={C.cyan} strokeWidth="1" markerEnd="url(#arr-mq)"/>

      {/* Topic box */}
      <rect x="150" y="50" width="200" height="160" rx="8" fill="rgba(6,182,212,0.05)" stroke={C.cyan} strokeWidth="1.5" strokeDasharray="5,3"/>
      <text x="250" y="72" textAnchor="middle" fill={C.cyan} fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">TOPIC: orders</text>

      {/* Partitions */}
      {['Partition 0', 'Partition 1', 'Partition 2'].map((label, i) => (
        <g key={i}>
          <rect x="165" y={90 + i * 42} width="170" height="32" rx="4" fill="rgba(6,182,212,0.08)" stroke={`${C.cyan}40`} strokeWidth="1"/>
          <text x="250" y={90 + i * 42 + 14} textAnchor="middle" fill={C.textDim} fontSize="9" fontFamily="JetBrains Mono">{label}</text>
          <text x="250" y={90 + i * 42 + 26} textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">[msg0][msg1][msg2]→</text>
        </g>
      ))}

      {/* Consumer group */}
      <rect x="390" y="50" width="140" height="160" rx="8" fill="rgba(16,185,129,0.05)" stroke={C.green} strokeWidth="1.5" strokeDasharray="5,3"/>
      <text x="460" y="72" textAnchor="middle" fill={C.green} fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">Consumer Group A</text>

      {['Consumer 0', 'Consumer 1', 'Consumer 2'].map((label, i) => (
        <g key={i}>
          <rect x="405" y={90 + i * 42} width="110" height="32" rx="4" fill="rgba(16,185,129,0.08)" stroke={`${C.green}40`} strokeWidth="1"/>
          <text x="460" y={90 + i * 42 + 14} textAnchor="middle" fill={C.textDim} fontSize="9" fontFamily="JetBrains Mono">{label}</text>
          <text x="460" y={90 + i * 42 + 26} textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">offset: tracked</text>
          <line x1="350" y1={90 + i * 42 + 16} x2="405" y2={90 + i * 42 + 16} stroke={C.green} strokeWidth="1" markerEnd="url(#arr-mq)"/>
        </g>
      ))}

      {/* Broker box label */}
      <rect x="570" y="90" width="110" height="70" rx="5" fill="rgba(167,139,250,0.08)" stroke={`#a78bfa50`} strokeWidth="1"/>
      <text x="625" y="118" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono">ZooKeeper /</text>
      <text x="625" y="132" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono">KRaft</text>
      <text x="625" y="147" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">coordination</text>
      <line x1="530" y1="125" x2="570" y2="125" stroke="#a78bfa30" strokeWidth="1" strokeDasharray="3,2"/>

      <text x="350" y="260" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="Space Grotesk">
        Each partition consumed by exactly one consumer per group — enabling parallel processing
      </text>
    </svg>
  )
}

// ─── Delivery Semantics Tabs ──────────────────────────────────────────────────
function DeliverySemantics() {
  const [active, setActive] = useState(0)
  const tabs = [
    {
      label: 'At-Most-Once',
      color: C.amber,
      desc: 'Messages may be lost but never redelivered. Producer fires and forgets (acks=0). Consumer commits offset before processing.',
      use: 'Metrics, logs, analytics — where occasional loss is acceptable and throughput matters most.',
      code: `# Producer: no acknowledgement wait
producer.send(record, acks=0)

# Consumer: commit BEFORE processing
consumer.commit_offset(msg.offset)
process(msg)  # if crash here → message lost`,
    },
    {
      label: 'At-Least-Once',
      color: C.cyan,
      desc: 'Messages are never lost but may be redelivered on failure. Producer waits for broker ack. Consumer commits offset AFTER processing.',
      use: 'Most production systems. Requires idempotent consumers to handle duplicates safely.',
      code: `# Producer: wait for leader ack
producer.send(record, acks=1)

# Consumer: commit AFTER processing
process(msg)
consumer.commit_offset(msg.offset)
# if crash before commit → reprocessed`,
    },
    {
      label: 'Exactly-Once',
      color: C.green,
      desc: 'Each message processed exactly once. Uses idempotent producers + transactional consumers. Kafka Transactions API (0.11+).',
      use: 'Financial transactions, payment processing — where both loss and duplication are unacceptable.',
      code: `# Idempotent producer (dedup by sequence num)
producer = KafkaProducer(enable_idempotence=True)

# Transactional consumer-producer
producer.init_transactions()
producer.begin_transaction()
process_and_produce(msg)
consumer.send_offsets_to_transaction(offsets)
producer.commit_transaction()  # atomic`,
    },
  ]

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              flex: 1, padding: '10px', background: 'none', border: 'none',
              borderBottom: active === i ? `2px solid ${t.color}` : '2px solid transparent',
              fontFamily: FONTS.mono, fontSize: 10, color: active === i ? t.color : C.textMuted,
              cursor: 'pointer', transition: 'color 0.15s', letterSpacing: '0.05em',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ padding: '20px 24px' }}
      >
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          {tabs[active].desc}
        </p>
        <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: tabs[active].color, marginBottom: 8, letterSpacing: '0.08em' }}>
          USE WHEN:
        </div>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.65, margin: '0 0 12px' }}>
          {tabs[active].use}
        </p>
        <CodeBlock lang="python" code={tabs[active].code} />
      </motion.div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function V2Ch04MessageQueue() {
  return (
    <div>
      <Section title="Producer / Consumer Model" icon="📨">
        <InfoBox type="info">
          A distributed message queue decouples producers (who write messages) from consumers
          (who process them), enabling async communication, load buffering, and fault isolation
          between microservices.
        </InfoBox>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '12px 0' }}>
          Producers publish records to a named <strong style={{ color: C.white }}>topic</strong>.
          Consumers subscribe to topics and process records independently. The broker stores
          records durably on disk — not in memory — so consumers can replay at any time.
          This is the fundamental shift from a traditional message queue (RabbitMQ) to a
          distributed log (Kafka).
        </p>
        <StepList steps={[
          { title: 'Producer publishes to topic', body: 'Producer serializes the message (JSON/Avro/Protobuf), optionally specifies a partition key, and sends to the broker. The key determines which partition receives the record — same key always routes to same partition, preserving order per entity.' },
          { title: 'Broker persists to partition log', body: 'The broker appends the record to the partition\'s append-only log file on disk. Each record is assigned a monotonically increasing offset. Records are retained by time or size policy (default 7 days), not deleted on consumption.' },
          { title: 'Consumer pulls from partition', body: 'Consumers pull records by specifying a topic, partition, and starting offset. Each consumer group independently tracks its own offset per partition — multiple groups can consume the same topic at different speeds without interfering.' },
          { title: 'Offset committed to broker', body: 'After processing, the consumer commits its offset to a special internal topic (__consumer_offsets). On restart or rebalance, the consumer resumes from this committed offset.' },
        ]} />
      </Section>

      <Section title="Partitions and Ordering Guarantees" icon="🗂️">
        <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px', marginBottom: 16 }}>
          <PartitionDiagram />
        </div>

        <ConceptGrid>
          <ConceptCard title="Intra-Partition Order" icon="📋" color={C.cyan}>
            Records within a single partition are strictly ordered by offset. All records with the same
            key (e.g., user_id) route to the same partition — guaranteeing per-user ordering.
          </ConceptCard>
          <ConceptCard title="No Cross-Partition Order" icon="⚠️" color={C.amber}>
            Kafka provides no ordering guarantees across partitions. If global order is required,
            use a single partition (sacrificing throughput) or add application-level sequencing.
          </ConceptCard>
          <ConceptCard title="Partition Count Tradeoffs" icon="⚖️" color={C.green}>
            More partitions = higher throughput + more parallelism. But each partition has overhead
            (file handles, memory). Typical: start with partitions = 3× expected peak consumers.
          </ConceptCard>
          <ConceptCard title="Partition Key Strategy" icon="🔑" color={C.purple}>
            Key = user_id → per-user ordering. Key = null → round-robin. Key = order_id → per-order
            ordering. Poor key choice causes hot partitions — one partition gets all the traffic.
          </ConceptCard>
        </ConceptGrid>

        <InfoBox type="warn">
          <strong>Hot Partition Problem:</strong> If 1% of users generate 80% of traffic and you
          partition by user_id, those partitions get overwhelmed. Solutions: sub-partition by
          composite key (user_id + timestamp shard), or use a random salt with server-side fan-out.
        </InfoBox>
      </Section>

      <Section title="Consumer Groups and Offsets" icon="👥">
        <SubSection title="Consumer Group Mechanics">
          <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
            A consumer group is a set of consumers that collectively consume a topic. Kafka assigns
            each partition to exactly one consumer in the group — ensuring each record is processed
            once per group. When a consumer joins or leaves, Kafka triggers a <strong style={{ color: C.white }}>rebalance</strong>,
            reassigning partitions to the remaining consumers.
          </p>
        </SubSection>

        <CodeBlock lang="kafka consumer pseudocode" code={`consumer = KafkaConsumer(
    topic='orders',
    group_id='order-processor',   # consumer group name
    bootstrap_servers=['broker1:9092'],
    auto_offset_reset='earliest', # start from beginning if no committed offset
    enable_auto_commit=False,     # manual commit for exactly-once control
)

for message in consumer:
    try:
        process_order(message.value)
        consumer.commit()         # commit AFTER successful processing
    except Exception as e:
        handle_error(e)
        # do NOT commit — message will be reprocessed on next poll`} />

        <SubSection title="Offset Management">
          <TradeoffTable rows={[
            {
              approach: 'Auto-commit (enable.auto.commit=true)',
              pros: 'Zero boilerplate. Simple to set up.',
              cons: 'Can commit before processing completes → at-most-once semantics on crash.',
              when: 'Logging, analytics where occasional loss is acceptable.',
            },
            {
              approach: 'Manual commit (commitSync)',
              pros: 'Precise control. At-least-once guaranteed.',
              cons: 'Blocks until broker confirms. Adds latency to processing loop.',
              when: 'Most production systems. Payment processing, order handling.',
            },
            {
              approach: 'Manual commit (commitAsync)',
              pros: 'Non-blocking. Higher throughput.',
              cons: 'On retry, later offsets may commit before earlier ones → gaps.',
              when: 'High-throughput analytics. Combine with commitSync on shutdown.',
            },
          ]} />
        </SubSection>
      </Section>

      <Section title="Replication and Fault Tolerance" icon="🛡️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 16px' }}>
          Kafka replicates each partition across multiple brokers. One broker is elected
          <strong style={{ color: C.white }}> partition leader</strong> — all reads and writes
          go through it. Other brokers hold <strong style={{ color: C.white }}>follower replicas</strong>
          that sync from the leader.
        </p>

        <StepList steps={[
          { title: 'In-Sync Replicas (ISR)', body: 'The ISR set contains replicas that are fully caught up with the leader (lag < replica.lag.time.max.ms). A message is "committed" only when all ISR replicas have written it.' },
          { title: 'acks configuration', body: 'acks=0: no wait (fire and forget). acks=1: wait for leader only (fast, but leader crash loses data). acks=all: wait for all ISR replicas (durable, higher latency). Production: acks=all + min.insync.replicas=2.' },
          { title: 'Leader election on failure', body: 'When a leader fails, the controller broker (managed by ZooKeeper or KRaft) elects a new leader from the ISR. Clients automatically discover the new leader via metadata refresh. Typical failover: < 30 seconds.' },
          { title: 'Unclean leader election', body: 'If ISR is empty (all replicas are lagging), Kafka can elect an out-of-sync replica as leader — risking data loss — or wait (prefer durability). Controlled by unclean.leader.election.enable.' },
        ]} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginTop: 16 }}>
          {[
            { value: 'RF=3', label: 'Recommended replication factor', color: C.cyan },
            { value: 'ISR≥2', label: 'min.insync.replicas for durability', color: C.green },
            { value: '<30s', label: 'Leader failover time', color: C.amber },
            { value: '99.99%', label: 'Durability with RF=3', color: C.purple },
          ].map(s => (
            <div key={s.label} style={{
              background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: '12px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 10, color: C.textMuted, marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Delivery Semantics" icon="📬">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          The three delivery guarantees represent fundamental trade-offs between performance,
          complexity, and correctness. Select the tab to explore each:
        </p>
        <DeliverySemantics />

        <InfoBox type="key">
          <strong>Idempotency is required for at-least-once.</strong> Every consumer must handle
          duplicate messages safely — use database unique constraints, idempotency keys, or
          check-then-act patterns to make processing idempotent.
        </InfoBox>
      </Section>

      <Section title="Kafka vs RabbitMQ vs SQS" icon="⚖️">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Feature', 'Apache Kafka', 'RabbitMQ', 'AWS SQS'].map(h => (
                  <th key={h} style={{
                    fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted,
                    letterSpacing: '0.1em', textAlign: 'left', padding: '10px 14px',
                    borderBottom: `1px solid ${C.border}`, textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Model', 'Distributed log (pull)', 'Message broker (push/pull)', 'Managed queue (pull)'],
                ['Throughput', '1M+ msg/sec', '50K–100K msg/sec', '3K–300K msg/sec'],
                ['Message Retention', 'Configurable (days/weeks)', 'Deleted after ack', 'Up to 14 days'],
                ['Ordering', 'Per-partition', 'Per-queue (FIFO)', 'Best-effort (FIFO queue)'],
                ['Consumer Model', 'Pull-based, offset tracking', 'Push to consumer', 'Pull-based, visibility timeout'],
                ['Replay', 'Yes — seek to any offset', 'No — messages deleted after ack', 'No'],
                ['Best For', 'Event streaming, audit logs, replayable pipelines', 'Task queues, RPC, routing', 'Simple async decoupling on AWS'],
              ].map((row, i) => (
                <tr key={i} style={{
                  borderBottom: i < 6 ? `1px solid ${C.border}` : 'none',
                  background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{
                      fontFamily: FONTS.sans, fontSize: 12,
                      color: j === 0 ? C.white : C.textDim,
                      fontWeight: j === 0 ? 600 : 400,
                      padding: '10px 14px', verticalAlign: 'top', lineHeight: 1.5,
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <InfoBox type="tip">
          <strong>Rule of thumb:</strong> Choose Kafka when you need replay, high throughput, or
          event sourcing. Choose RabbitMQ for complex routing (exchanges, bindings) and traditional
          task queues. Choose SQS for minimal operational overhead on AWS without replay needs.
        </InfoBox>
      </Section>

      <Section title="Interview Checklist" icon="✅">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'Clarify: pub/sub vs point-to-point? Replay needed? Ordering requirements?',
            'Choose Kafka for high-throughput streaming; RabbitMQ for task queues',
            'Partition by a meaningful key (user_id, order_id) — avoid hot partitions',
            'Set replication factor ≥ 3, min.insync.replicas ≥ 2 for durability',
            'Use acks=all for financial data; acks=1 for tolerable-loss analytics',
            'Implement idempotent consumers for at-least-once delivery safety',
            'Use Kafka Transactions API for exactly-once consumer-producer pipelines',
            'Monitor: consumer lag per partition (alert if lag grows unbounded)',
            'Plan for partition rebalancing — use static membership to reduce disruptions',
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
