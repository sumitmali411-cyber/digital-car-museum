import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Section, SubSection, InfoBox, ConceptGrid, ConceptCard,
  StepList, TradeoffTable, CodeBlock,
} from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── WebSocket vs Polling Comparison ─────────────────────────────────────────
function ProtocolComparison() {
  const [selected, setSelected] = useState('websocket')

  const protocols = {
    websocket: {
      label: 'WebSocket',
      color: C.cyan,
      latency: '< 5ms',
      overhead: 'Low (2 bytes/frame)',
      direction: 'Full-duplex',
      desc: 'Single TCP connection with persistent two-way channel. Server can push at any time without a pending request. Ideal for chat.',
      use: 'Real-time chat, live collaboration, gaming, live feeds.',
      code: `// Client
const ws = new WebSocket('wss://chat.example.com/ws')
ws.onopen  = () => ws.send(JSON.stringify({ type: 'auth', token }))
ws.onmessage = (e) => dispatch(JSON.parse(e.data))
ws.onerror = (e) => reconnect()

// Server (Go)
conn.WriteMessage(websocket.TextMessage, payload)`,
    },
    sse: {
      label: 'Server-Sent Events',
      color: C.green,
      latency: '< 50ms',
      overhead: 'Low (HTTP/1.1)',
      direction: 'Server → Client only',
      desc: 'HTTP long-lived response stream. Server pushes events, client sends via normal HTTP POST. Works through proxies and firewalls easily.',
      use: 'Notifications, dashboards, one-way live updates.',
      code: `// Client
const es = new EventSource('/events?userId=123')
es.onmessage = (e) => handleEvent(JSON.parse(e.data))
es.addEventListener('message', handler)

// Server sends:
data: {"type":"msg","text":"Hello"}\\n\\n`,
    },
    longpoll: {
      label: 'Long Polling',
      color: C.amber,
      latency: '50–200ms',
      overhead: 'High (HTTP headers)',
      direction: 'Half-duplex',
      desc: 'Client opens HTTP request, server holds it until a message arrives or timeout. Client immediately re-connects. Simulates push over HTTP.',
      use: 'Legacy systems, environments blocking WebSocket.',
      code: `// Client loops
async function poll() {
  const res = await fetch('/poll?since=' + lastId)
  const msgs = await res.json()
  msgs.forEach(handleMessage)
  poll() // immediately reconnect
}

// Server: blocks until msg or 30s timeout`,
    },
  }

  const proto = protocols[selected]

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
        {Object.entries(protocols).map(([key, p]) => (
          <button
            key={key}
            onClick={() => setSelected(key)}
            style={{
              flex: 1,
              padding: '10px 8px',
              background: 'none',
              border: 'none',
              borderBottom: selected === key ? `2px solid ${p.color}` : '2px solid transparent',
              fontFamily: FONTS.mono,
              fontSize: 10,
              color: selected === key ? p.color : C.textMuted,
              cursor: 'pointer',
              transition: 'color 0.15s',
              letterSpacing: '0.06em',
            }}
          >
            {p.label.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
          {[
            { label: 'LATENCY', value: proto.latency, color: proto.color },
            { label: 'OVERHEAD', value: proto.overhead, color: C.purple },
            { label: 'DIRECTION', value: proto.direction, color: C.green },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 6,
              padding: '8px 12px', minWidth: 100,
            }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 8, color: C.textMuted, marginBottom: 3, letterSpacing: '0.1em' }}>{stat.label}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.65, margin: '0 0 12px' }}>
          {proto.desc}
        </p>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, marginBottom: 6, letterSpacing: '0.1em' }}>
          BEST FOR: <span style={{ color: proto.color }}>{proto.use}</span>
        </div>
        <CodeBlock lang={proto.label.toLowerCase()} code={proto.code} />
      </div>
    </div>
  )
}

// ─── Message Flow Simulator ───────────────────────────────────────────────────
function MessageFlowViz() {
  const [step, setStep] = useState(0)
  const steps = [
    { label: 'User A types & sends', node: 'client-a', color: C.cyan, desc: 'Client sends JSON over WebSocket: { to: "B", text: "Hey!", timestamp: ... }' },
    { label: 'Chat server receives', node: 'chat-server', color: C.amber, desc: 'Server assigns message_id via ID generator (Snowflake), persists to message DB, determines recipient.' },
    { label: 'Message stored in DB', node: 'db', color: C.purple, desc: 'Written to HBase/Cassandra keyed by (conversation_id, message_id). Enables history pagination.' },
    { label: 'Presence check', node: 'presence', color: C.green, desc: 'Query Redis presence service: Is user B online? Which chat server is user B connected to?' },
    { label: 'Push to recipient', node: 'client-b', color: C.cyan, desc: 'If online: push directly via WebSocket. If offline: send push notification via APNs/FCM.' },
    { label: 'Read receipt sent back', node: 'client-a', color: C.green, desc: 'User B\'s client sends ack. Server updates delivered/read status. User A sees double checkmark.' },
  ]

  const nodes = [
    { id: 'client-a', label: 'User A', x: 40, y: 100 },
    { id: 'chat-server', label: 'Chat Server', x: 200, y: 60 },
    { id: 'db', label: 'Message DB', x: 370, y: 100 },
    { id: 'presence', label: 'Presence', x: 370, y: 180 },
    { id: 'client-b', label: 'User B', x: 540, y: 100 },
  ]

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, letterSpacing: '0.12em', marginBottom: 8 }}>
          MESSAGE DELIVERY FLOW — step {step + 1}/{steps.length}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              style={{
                padding: '4px 10px',
                background: step === i ? `rgba(6,182,212,0.15)` : 'none',
                border: `1px solid ${step === i ? C.cyan : C.border}`,
                borderRadius: 4,
                fontFamily: FONTS.mono,
                fontSize: 9,
                color: step === i ? C.cyan : C.textMuted,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <svg viewBox="0 0 620 260" style={{ width: '100%', maxHeight: 220 }}>
            <defs>
              <marker id="arr-chat" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L7,3 z" fill={C.cyan} />
              </marker>
            </defs>
            {nodes.map(n => {
              const isActive = steps[step].node === n.id
              return (
                <g key={n.id}>
                  <rect
                    x={n.x - 45} y={n.y - 20} width={90} height={40} rx={6}
                    fill={isActive ? `rgba(6,182,212,0.15)` : '#1a2236'}
                    stroke={isActive ? C.cyan : C.border}
                    strokeWidth={isActive ? 2 : 1}
                  />
                  <text x={n.x} y={n.y + 5} textAnchor="middle" fill={isActive ? C.cyan : C.textDim}
                    fontSize="9" fontFamily="JetBrains Mono">{n.label}</text>
                </g>
              )
            })}
            {/* Connection lines */}
            <line x1="85" y1="100" x2="155" y2="80" stroke={C.border} strokeWidth="1" markerEnd="url(#arr-chat)" />
            <line x1="245" y1="75" x2="325" y2="95" stroke={C.border} strokeWidth="1" markerEnd="url(#arr-chat)" />
            <line x1="245" y1="85" x2="325" y2="175" stroke={C.border} strokeWidth="1" markerEnd="url(#arr-chat)" />
            <line x1="415" y1="100" x2="495" y2="100" stroke={C.border} strokeWidth="1" markerEnd="url(#arr-chat)" />
            <text x="310" y="250" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="JetBrains Mono">
              WebSocket connections maintained per chat server
            </text>
          </svg>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: `rgba(6,182,212,0.06)`,
            border: `1px solid ${C.cyan}30`,
            borderLeft: `3px solid ${C.cyan}`,
            borderRadius: 6,
            padding: '10px 14px',
          }}
        >
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.cyan, marginBottom: 4 }}>
            STEP {step + 1}: {steps[step].label.toUpperCase()}
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.6 }}>
            {steps[step].desc}
          </div>
        </motion.div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}
            style={{ background: 'none', border: `1px solid ${step === 0 ? C.border : C.cyan}`, color: step === 0 ? C.textMuted : C.cyan, fontFamily: FONTS.mono, fontSize: 11, padding: '6px 14px', borderRadius: 5, cursor: step === 0 ? 'default' : 'pointer' }}>
            ← PREV
          </button>
          <button onClick={() => setStep(Math.min(steps.length - 1, step + 1))} disabled={step === steps.length - 1}
            style={{ background: step === steps.length - 1 ? 'none' : 'rgba(6,182,212,0.1)', border: `1px solid ${step === steps.length - 1 ? C.border : C.cyan}`, color: step === steps.length - 1 ? C.textMuted : C.cyan, fontFamily: FONTS.mono, fontSize: 11, padding: '6px 14px', borderRadius: 5, cursor: step === steps.length - 1 ? 'default' : 'pointer' }}>
            NEXT →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Chapter ─────────────────────────────────────────────────────────────
export default function Ch12Chat() {
  return (
    <div>
      <Section title="Real-Time Communication Protocols" icon="🔌">
        <InfoBox type="info">
          <strong>Scale target:</strong> WhatsApp handles 100 billion messages/day. The choice of
          protocol directly determines your system's latency, scalability, and infrastructure cost.
        </InfoBox>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '12px 0' }}>
          Three primary approaches exist for real-time messaging. WebSocket is the dominant choice for
          modern chat — it maintains a persistent bidirectional connection, eliminating repeated HTTP
          handshake overhead.
        </p>
        <ProtocolComparison />
      </Section>

      <Section title="Message Delivery Flow" icon="📨">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Sending a single chat message involves 6 coordinated steps across multiple services. Step
          through the flow to understand each component's role:
        </p>
        <MessageFlowViz />
      </Section>

      <Section title="Message Storage Design" icon="🗄️">
        <SubSection title="Storage Requirements">
          <ConceptGrid>
            <ConceptCard title="High Write Throughput" icon="✍️" color={C.cyan}>
              Every message is a write. At WhatsApp scale: ~1M messages/second. Need a DB optimized for
              append-heavy workloads, not random reads.
            </ConceptCard>
            <ConceptCard title="Ordered by Time" icon="🕐" color={C.green}>
              Messages must be returned in send order within a conversation. Use message_id with monotonic
              ordering (Snowflake ID encodes timestamp).
            </ConceptCard>
            <ConceptCard title="Efficient Range Queries" icon="📊" color={C.amber}>
              Loading chat history = range scan: "all messages in conversation X after message_id Y".
              Needs efficient range scan support.
            </ConceptCard>
            <ConceptCard title="Long Retention" icon="📦" color={C.purple}>
              Users expect years of message history. Storage must be cheap at scale. Cold messages
              tiered to object storage (S3) after 90 days.
            </ConceptCard>
          </ConceptGrid>
        </SubSection>

        <SubSection title="Why HBase/Cassandra Over MySQL">
          <TradeoffTable rows={[
            {
              approach: 'HBase (Facebook Messenger)',
              pros: 'Optimized for time-series writes. Columnar storage. Scales horizontally. Row key = (user_id + reversed_timestamp).',
              cons: 'Operational complexity. Requires HDFS. Eventual consistency.',
              when: 'Massive scale (>10B messages/day), team with HBase expertise.',
            },
            {
              approach: 'Cassandra (Discord)',
              pros: 'Leaderless replication. Tunable consistency. Good write performance. Wide rows for message buckets.',
              cons: 'No joins. Careful data modeling required. Compaction overhead.',
              when: 'Large scale with simpler ops than HBase. Good for most chat systems.',
            },
            {
              approach: 'MySQL/PostgreSQL',
              pros: 'Simple. Familiar. ACID. Easy to query.',
              cons: 'Write bottleneck at massive scale. Sharding complexity. B-tree index overhead.',
              when: 'Up to ~100M messages/day with proper sharding strategy.',
            },
          ]} />
        </SubSection>

        <SubSection title="Cassandra Schema">
          <CodeBlock lang="cassandra CQL" code={`-- Primary table: conversation messages
CREATE TABLE messages (
  conversation_id  UUID,
  message_id       BIGINT,    -- Snowflake ID (time-ordered)
  sender_id        BIGINT,
  content          TEXT,
  content_type     TINYINT,   -- 0=text, 1=image, 2=video
  created_at       TIMESTAMP,
  PRIMARY KEY (conversation_id, message_id)
) WITH CLUSTERING ORDER BY (message_id DESC)
  AND default_time_to_live = 7776000;  -- 90 days

-- Load last 20 messages in conversation:
SELECT * FROM messages
WHERE conversation_id = ?
ORDER BY message_id DESC
LIMIT 20;`} />
        </SubSection>
      </Section>

      <Section title="Fanout Strategies: Write vs Read" icon="📡">
        <InfoBox type="key">
          <strong>Fanout</strong> = distributing one message to all recipients' mailboxes. The strategy
          chosen has massive performance implications at scale.
        </InfoBox>

        <TradeoffTable rows={[
          {
            approach: 'Fanout on Write',
            pros: 'Read is O(1) — just read your inbox. Fast message delivery. Best for active users.',
            cons: 'Write amplification for popular users. 1 celebrity → millions of writes. Hot partition risk.',
            when: 'Most users (non-celebrities). Group chats with < 1000 members.',
          },
          {
            approach: 'Fanout on Read',
            pros: 'Write is O(1). No fan-out cost. Good for celebrities / huge groups.',
            cons: 'Reads are slow — must gather from all senders. High read latency.',
            when: 'Celebrity accounts. Group chats > 1000 members. Notification feeds.',
          },
          {
            approach: 'Hybrid (WhatsApp / Facebook)',
            pros: 'Best of both: fanout on write for normal users, fanout on read for large groups.',
            cons: 'Implementation complexity. Threshold logic required.',
            when: 'Production at scale. Threshold: ~500 group members or >1M followers.',
          },
        ]} />

        <SubSection title="Group Message Fanout">
          <StepList steps={[
            { title: 'User sends to group (500 members)', body: 'Single message written to message DB. One write regardless of group size.' },
            { title: 'Fanout service reads group membership', body: 'Query group_members table to get all 500 member IDs.' },
            { title: 'For each online member: push via WebSocket', body: 'Check presence service. Push directly to connected chat server. Batched in parallel (50 goroutines).' },
            { title: 'For offline members: inbox queue', body: 'Write message reference to each offline user\'s inbox. Delivered on next login.' },
            { title: 'Push notifications for mobile', body: 'For members with mobile offline: enqueue to notification service → APNs/FCM.' },
          ]} />
        </SubSection>
      </Section>

      <Section title="Online Presence System" icon="🟢">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Showing accurate "online/last seen" status requires a dedicated presence service. The
          challenge: users can have multiple devices, connections drop unexpectedly, and millions
          of presence updates happen per second.
        </p>

        <ConceptGrid>
          <ConceptCard title="Heartbeat Mechanism" icon="💓" color={C.cyan}>
            Client sends heartbeat every 5 seconds. Presence service updates Redis TTL.
            If TTL expires (client gone offline), status flips to offline automatically.
          </ConceptCard>
          <ConceptCard title="Redis with TTL" icon="⏱️" color={C.green}>
            <code style={{ color: C.green, fontFamily: FONTS.mono }}>SETEX presence:userId 30 "online"</code>
            <br />TTL = 30s. Heartbeat resets it. TTL expiry = offline. No explicit logout needed.
          </ConceptCard>
          <ConceptCard title="Pub/Sub for Propagation" icon="📢" color={C.amber}>
            Status changes published to Redis channel. Subscribers (friends' chat servers) receive
            updates and push "X is online" events to connected clients.
          </ConceptCard>
          <ConceptCard title="Fan-out on Subscribe" icon="👁️" color={C.purple}>
            When user comes online, notify only subscribed friends (those who have the chat open).
            Not all followers — that would be too expensive.
          </ConceptCard>
        </ConceptGrid>

        <SubSection title="Presence Pseudocode">
          <CodeBlock lang="go" code={`// Heartbeat handler (every 5s from client)
func HandleHeartbeat(userId string) {
    rdb.Set(ctx, "presence:"+userId, "online", 30*time.Second)

    // Notify subscribed friends
    update := PresenceUpdate{UserId: userId, Status: "online"}
    rdb.Publish(ctx, "presence:"+userId, update)
}

// Subscriber (friend's chat server)
func SubscribePresence(friendId string, conn *WebSocket) {
    sub := rdb.Subscribe(ctx, "presence:"+friendId)
    for msg := range sub.Channel() {
        conn.Send(msg.Payload)  // push to client
    }
}`} />
        </SubSection>
      </Section>

      <Section title="Push Notifications for Offline Users" icon="🔔">
        <StepList steps={[
          { title: 'Message arrives for offline user', body: 'Chat server detects user is offline (no WebSocket connection, presence TTL expired).' },
          { title: 'Notification service enqueued', body: 'Message ID pushed to notification queue (Kafka topic per notification type).' },
          { title: 'APNs / FCM provider integration', body: 'Notification worker reads queue, constructs payload (title, body, badge count), sends to Apple Push Notification Service (iOS) or Firebase Cloud Messaging (Android).' },
          { title: 'Device receives notification', body: 'OS wakes the app or shows system notification. User taps → app opens → WebSocket connection established → full message sync.' },
          { title: 'Retry on failure', body: 'APNs/FCM returns error codes. Expired device tokens removed from DB. Retry transient failures with exponential backoff (max 3 retries).' },
        ]} />

        <InfoBox type="warn">
          <strong>Rate Limits:</strong> APNs limits burst to 2000 notifications/second per app certificate.
          For massive group chats, batch notifications and collapse them: "5 new messages from Group X".
        </InfoBox>
      </Section>

      <Section title="End-to-End Encryption Overview" icon="🔒">
        <InfoBox type="info">
          E2E encryption ensures only sender and recipient can read messages — not even the server.
          Signal Protocol (used by WhatsApp, Signal) is the gold standard.
        </InfoBox>

        <StepList steps={[
          { title: 'Key exchange (Double Ratchet Algorithm)', body: 'Each user generates key pair (public + private). Public key uploaded to server. Session keys derived via Diffie-Hellman — never sent over network.' },
          { title: 'Message encryption on device', body: 'Message encrypted with session key before leaving device. Ciphertext sent to server. Server stores/forwards ciphertext — cannot read it.' },
          { title: 'Ratchet forward secrecy', body: 'New session key derived for each message. Compromise of one key doesn\'t expose past messages. Keys deleted after use.' },
          { title: 'Key verification', body: 'Users can verify safety numbers (displayed as QR code or emoji fingerprint) to detect MITM attacks.' },
        ]} />

        <SubSection title="E2E Impact on System Design">
          <ConceptGrid>
            <ConceptCard title="Server-Side Search Impossible" icon="🚫" color={C.red}>
              Can't search encrypted messages on server. Must decrypt on device. Elasticsearch index
              of chat history is not possible with true E2E.
            </ConceptCard>
            <ConceptCard title="Backup Complexity" icon="🗄️" color={C.amber}>
              iCloud/Google Drive backups of E2E messages are a weak point — backup keys may not have
              E2E protection. WhatsApp offers optional E2E backup since 2021.
            </ConceptCard>
          </ConceptGrid>
        </SubSection>
      </Section>

      <Section title="Service Partitioning & Horizontal Scale" icon="🏗️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          A single chat server can't hold millions of WebSocket connections. The system is horizontally
          scaled with a stateful routing layer.
        </p>
        <ConceptGrid>
          <ConceptCard title="Chat Server Pool" icon="🖥️" color={C.cyan}>
            Multiple chat servers, each holding a subset of WebSocket connections. Service discovery
            via ZooKeeper registers which users are on which server.
          </ConceptCard>
          <ConceptCard title="Message Routing" icon="🗺️" color={C.green}>
            To deliver to User B: look up User B's chat server in service registry, then HTTP/gRPC
            to that server to push the message down the WebSocket.
          </ConceptCard>
          <ConceptCard title="Sticky Sessions" icon="📌" color={C.amber}>
            User's WebSocket must reconnect to same server during session. Load balancer uses
            consistent hashing on userId for session stickiness.
          </ConceptCard>
          <ConceptCard title="Cross-Server Pub/Sub" icon="📡" color={C.purple}>
            Alternatively: Redis Pub/Sub. Any server publishes to user's channel. User's chat server
            (subscribed to that channel) delivers to WebSocket. No service registry needed.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Interview Summary" icon="✅">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'Use WebSocket for full-duplex real-time messaging (not HTTP polling)',
            'Store messages in Cassandra/HBase: keyed by (conversation_id, message_id)',
            'Use Snowflake IDs for message ordering — timestamp-embedded, globally unique',
            'Fanout on write for 1:1 and small groups; fanout on read for large groups',
            'Presence service: Redis TTL + heartbeat every 5s from client',
            'Offline users: push notification via APNs (iOS) / FCM (Android)',
            'Scale chat servers horizontally; route cross-server messages via Redis Pub/Sub',
            'E2E encryption: Signal Protocol, keys never leave devices',
            'Read receipts: client sends ACK, server broadcasts delivery status',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '8px 0',
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
