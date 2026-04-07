import { Section, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

const pubSubCode = `// Redis Pub/Sub — subscribe to each friend's location channel
async function subscribeToFriends(userId, friendIds) {
  const subscriber = redis.createClient()
  const channels = friendIds.map(id => \`location:\${id}\`)
  await subscriber.subscribe(...channels, (message, channel) => {
    const { lat, lon, timestamp } = JSON.parse(message)
    const friendId = channel.replace('location:', '')
    broadcastToUser(userId, { friendId, lat, lon, timestamp })
  })
}

// Publish location update when user moves
async function publishLocation(userId, lat, lon) {
  const payload = JSON.stringify({ lat, lon, timestamp: Date.now() })
  // Store in Redis Geo with 5-min TTL
  await redis.geoadd('user_locations', lon, lat, userId)
  await redis.expire(\`user_loc:\${userId}\`, 300)
  // Notify all subscribers
  await redis.publish(\`location:\${userId}\`, payload)
}`

const locationSchema = `// Location update event schema (Cassandra time-series)
{
  "user_id":   "uuid",
  "timestamp": "2024-01-15T10:30:00Z",   // partition key (by day)
  "latitude":  40.7484,
  "longitude": -73.9857,
  "accuracy":  15,                         // metres
  "speed":     1.2                         // m/s
}

// WebSocket message to client
{
  "type":      "FRIEND_LOCATION_UPDATE",
  "friend_id": "uuid",
  "lat":       40.7484,
  "lon":       -73.9857,
  "distance":  2.3,                        // km from current user
  "updated_at": 1705312200000
}`

function BroadcastDiagram() {
  return (
    <svg viewBox="0 0 580 240" style={{ width: '100%', maxHeight: 240 }}>
      <defs>
        <marker id="arr2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={C.cyan} />
        </marker>
        <marker id="arr2g" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={C.green} />
        </marker>
      </defs>

      {/* Alice — sends location */}
      <rect x="10" y="90" width="80" height="44" rx="6" fill="rgba(6,182,212,0.1)" stroke={C.cyan} strokeWidth="1.5"/>
      <text x="50" y="108" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono">ALICE</text>
      <text x="50" y="122" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">WebSocket</text>
      <text x="50" y="134" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="JetBrains Mono">client</text>

      {/* WS Server 1 */}
      <rect x="130" y="84" width="90" height="56" rx="6" fill="rgba(245,158,11,0.1)" stroke={C.amber} strokeWidth="1"/>
      <text x="175" y="106" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">WS SERVER</text>
      <text x="175" y="119" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">handles Alice</text>
      <text x="175" y="132" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="JetBrains Mono">+ Bob</text>
      <line x1="90" y1="112" x2="130" y2="112" stroke={C.cyan} strokeWidth="1.5" markerEnd="url(#arr2)"/>

      {/* Redis Pub/Sub */}
      <rect x="270" y="78" width="90" height="68" rx="6" fill="rgba(239,68,68,0.1)" stroke={C.red} strokeWidth="1"/>
      <text x="315" y="100" textAnchor="middle" fill={C.red} fontSize="9" fontFamily="JetBrains Mono">REDIS</text>
      <text x="315" y="113" textAnchor="middle" fill={C.red} fontSize="9" fontFamily="JetBrains Mono">PUB/SUB</text>
      <text x="315" y="128" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="JetBrains Mono">channel:</text>
      <text x="315" y="139" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="JetBrains Mono">location:alice</text>
      <line x1="220" y1="112" x2="270" y2="112" stroke={C.amber} strokeWidth="1.5" markerEnd="url(#arr2)"/>

      {/* WS Server 2 */}
      <rect x="410" y="60" width="90" height="44" rx="6" fill="rgba(245,158,11,0.1)" stroke={C.amber} strokeWidth="1"/>
      <text x="455" y="78" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">WS SERVER</text>
      <text x="455" y="91" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">handles Carol</text>
      <line x1="360" y1="100" x2="410" y2="82" stroke={C.red} strokeWidth="1" strokeDasharray="4,2" markerEnd="url(#arr2)"/>

      {/* WS Server 3 */}
      <rect x="410" y="120" width="90" height="44" rx="6" fill="rgba(245,158,11,0.1)" stroke={C.amber} strokeWidth="1"/>
      <text x="455" y="138" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">WS SERVER</text>
      <text x="455" y="151" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">handles Dave</text>
      <line x1="360" y1="118" x2="410" y2="140" stroke={C.red} strokeWidth="1" strokeDasharray="4,2" markerEnd="url(#arr2)"/>

      {/* Carol client */}
      <rect x="510" y="60" width="60" height="44" rx="6" fill="rgba(16,185,129,0.1)" stroke={C.green} strokeWidth="1"/>
      <text x="540" y="80" textAnchor="middle" fill={C.green} fontSize="9" fontFamily="JetBrains Mono">CAROL</text>
      <text x="540" y="93" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="JetBrains Mono">friend</text>
      <line x1="500" y1="82" x2="510" y2="82" stroke={C.green} strokeWidth="1.5" markerEnd="url(#arr2g)"/>

      {/* Dave client */}
      <rect x="510" y="120" width="60" height="44" rx="6" fill="rgba(16,185,129,0.1)" stroke={C.green} strokeWidth="1"/>
      <text x="540" y="140" textAnchor="middle" fill={C.green} fontSize="9" fontFamily="JetBrains Mono">DAVE</text>
      <text x="540" y="153" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="JetBrains Mono">friend</text>
      <line x1="500" y1="142" x2="510" y2="142" stroke={C.green} strokeWidth="1.5" markerEnd="url(#arr2g)"/>

      <text x="290" y="220" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="Space Grotesk">
        Alice's location update fans out to Carol and Dave via Redis Pub/Sub across multiple WS servers
      </text>
    </svg>
  )
}

export default function Ch02NearbyFriends() {
  return (
    <div>
      <Section title="Requirements & Scale" icon="👥" accent={C.cyan}>
        <InfoBox type="info">
          Design a real-time nearby friends feature like Snapchat Map or Facebook Nearby Friends.
          Show friends within a configurable radius, updated every 30 seconds.
        </InfoBox>
        <ConceptGrid>
          <ConceptCard title="100M DAU" icon="📊" color={C.cyan}>
            10% active simultaneously = 10M concurrent WebSocket connections.
            Location update every 30 seconds = ~333K updates/sec.
          </ConceptCard>
          <ConceptCard title="5km Default Radius" icon="📍" color={C.green}>
            Configurable by user. Distance calculated server-side to avoid spoofing.
            Stale locations older than 5 minutes are hidden.
          </ConceptCard>
          <ConceptCard title="Privacy First" icon="🔒" color={C.amber}>
            Ghost mode, time-limited sharing, trusted-friends-only modes.
            Users can opt out entirely. Privacy settings cached per-user.
          </ConceptCard>
          <ConceptCard title="Low Latency" icon="⚡" color={C.purple}>
            Sub-second broadcast when a friend moves. WebSocket eliminates polling overhead.
            Redis Pub/Sub fan-out under 100ms.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="WebSocket vs Polling" icon="🔌" accent={C.amber}>
        <TradeoffTable rows={[
          {
            approach: 'Short Polling',
            pros: 'Simple. Works everywhere. No persistent connection needed.',
            cons: '30s polling interval = 30s stale data. Massive wasted requests. CPU overhead on server.',
            when: 'Prototypes or when WebSocket is blocked by corporate firewalls.',
          },
          {
            approach: 'Long Polling',
            pros: 'Near real-time. Simpler than WebSocket for some stacks.',
            cons: 'Holds HTTP connections open. High server concurrency at scale.',
            when: 'Fallback when WebSocket is unavailable.',
          },
          {
            approach: 'WebSocket',
            pros: 'True bidirectional, persistent, low overhead. Ideal for continuous location updates.',
            cons: 'Stateful connections require sticky sessions or shared state (Redis). LB must support WS.',
            when: 'Real-time location, chat, live feeds. Always prefer for 30s+ update frequency.',
          },
          {
            approach: 'SSE (Server-Sent Events)',
            pros: 'One-way server push. Simpler than WebSocket. Native browser support.',
            cons: 'Unidirectional only — cannot send location from client over SSE.',
            when: 'Live dashboards, notifications where client does not need to send data.',
          },
        ]} />
      </Section>

      <Section title="Architecture: Redis Pub/Sub Fan-Out" icon="📡" accent={C.red}>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 16px' }}>
          The core challenge: Alice is connected to WS Server 1, but her friend Carol is on WS Server 3.
          When Alice moves, Carol must still receive the update. Redis Pub/Sub bridges multiple WS servers.
        </p>
        <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <BroadcastDiagram />
        </div>
        <InfoBox type="warn">
          <strong>Subscription cost:</strong> Each user subscribes to N friend channels. At 200 friends average,
          10M active users = 2 billion subscriptions. Redis Cluster shards channels across nodes.
          Consider batching subscriptions and using geohash-based channels for very large friend lists.
        </InfoBox>
      </Section>

      <Section title="Location Update Broadcast Flow" icon="🔄" accent={C.cyan}>
        <StepList steps={[
          {
            title: 'Client sends location update',
            body: 'Mobile app sends {lat, lon, timestamp} over WebSocket every 30 seconds. Batched to reduce overhead.',
          },
          {
            title: 'WebSocket server receives update',
            body: 'Validates the payload, checks that user is not in ghost mode, and writes to Redis.',
          },
          {
            title: 'Store in Redis GEOADD',
            body: 'GEOADD user_locations <lon> <lat> <userId> with a 5-minute TTL. Enables radius queries.',
          },
          {
            title: 'Persist to Cassandra',
            body: 'Asynchronously write the location event to Cassandra for location history, analytics, and replay.',
          },
          {
            title: 'Publish to Redis channel',
            body: 'PUBLISH location:<userId> <payload>. All WS servers subscribed to this channel receive it.',
          },
          {
            title: 'WS servers fan out to friends',
            body: 'Each WS server holding a subscriber\'s connection checks if the updater is within radius, then pushes the update.',
          },
        ]} />
      </Section>

      <Section title="Core Components" icon="🧩" accent={C.green}>
        <ConceptGrid>
          <ConceptCard title="WebSocket Server" icon="🔌" color={C.cyan}>
            Handles persistent connections. Stateful — needs sticky sessions via LB consistent hashing,
            or fully stateless with connection state in Redis.
          </ConceptCard>
          <ConceptCard title="Redis Pub/Sub" icon="📢" color={C.red}>
            Each user has a channel <code style={{ color: C.red }}>location:&lt;userId&gt;</code>.
            Friends subscribe on connection. Unsubscribe on disconnect or friendship change.
          </ConceptCard>
          <ConceptCard title="Location Store (Redis)" icon="📍" color={C.green}>
            Redis GEOADD stores current positions. GEORADIUS fetches all friends within radius.
            TTL of 5 min removes stale/offline users automatically.
          </ConceptCard>
          <ConceptCard title="Location History (Cassandra)" icon="📅" color={C.amber}>
            Time-series writes at massive scale. Partitioned by (user_id, date).
            Supports playback features and activity heatmaps.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Scale Math & Data Model" icon="🔢" accent={C.purple}>
        <InfoBox type="tip">
          <strong>Scale math:</strong> 100M DAU, 10% active = 10M concurrent connections.
          Each sends 1 update / 30s = <strong>333,333 updates/sec</strong> at peak.
          Each update fans out to avg. 200 friends = 66M messages/sec through Pub/Sub.
          Redis Cluster with 10 nodes handles this comfortably at ~6.6M msg/sec per node.
        </InfoBox>
        <CodeBlock lang="javascript" code={pubSubCode} />
        <CodeBlock lang="json" code={locationSchema} />
      </Section>

      <Section title="Privacy Modes" icon="🔒" accent={C.amber}>
        <ConceptGrid>
          <ConceptCard title="Ghost Mode" icon="👻" color={C.textMuted}>
            User invisible to all friends. No location published. No Pub/Sub messages sent.
            Status cached in Redis — checked before every publish.
          </ConceptCard>
          <ConceptCard title="Time-Limited Sharing" icon="⏰" color={C.amber}>
            Share location for 1 hour, then auto-disable. Implemented with a Redis key with TTL
            that gates publishing.
          </ConceptCard>
          <ConceptCard title="Trusted Friends Only" icon="⭐" color={C.green}>
            Maintain a separate friend tier. Only publish to trusted list. Extra ACL check on publish.
          </ConceptCard>
          <ConceptCard title="Precision Fuzzing" icon="🎯" color={C.purple}>
            Reduce location precision to ±500m for acquaintances. Apply jitter to lat/lon
            before publishing to non-close-friends tier.
          </ConceptCard>
        </ConceptGrid>
      </Section>
    </div>
  )
}
