import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Section, SubSection, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── Token Bucket Visualizer ──────────────────────────────────────────────────
function TokenBucketViz() {
  const MAX = 8
  const [tokens, setTokens] = useState(MAX)
  const [log, setLog] = useState([])
  const [refilling, setRefilling] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTokens(t => {
        if (t < MAX) {
          setRefilling(true)
          setTimeout(() => setRefilling(false), 400)
          return Math.min(MAX, t + 1)
        }
        return t
      })
    }, 1500)
    return () => clearInterval(timerRef.current)
  }, [])

  const sendRequest = () => {
    setTokens(t => {
      if (t > 0) {
        setLog(l => [{ id: Date.now(), status: 'allowed', msg: '✅ Request allowed — token consumed' }, ...l.slice(0, 4)])
        return t - 1
      } else {
        setLog(l => [{ id: Date.now(), status: 'blocked', msg: '❌ Request throttled — no tokens (429)' }, ...l.slice(0, 4)])
        return t
      }
    })
  }

  return (
    <div style={{
      background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10,
      padding: '20px', marginTop: 8,
    }}>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted,
        letterSpacing: '0.15em', marginBottom: 16,
      }}>
        TOKEN BUCKET SIMULATOR — capacity: {MAX} tokens, refill: 1 token/1.5s
      </div>

      {/* Bucket visualization */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            {/* Bucket */}
            <div style={{
              width: 120, height: 100,
              border: `2px solid ${C.border}`,
              borderTop: 'none',
              borderRadius: '0 0 12px 12px',
              position: 'relative',
              overflow: 'hidden',
              background: '#0d1117',
            }}>
              {/* Fill level */}
              <motion.div
                animate={{ height: `${(tokens / MAX) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: tokens === 0
                    ? `linear-gradient(180deg, ${C.red}30, ${C.red}50)`
                    : `linear-gradient(180deg, ${C.cyan}20, ${C.cyan}40)`,
                  borderRadius: '0 0 10px 10px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <span style={{
                  fontFamily: FONTS.mono, fontSize: 22, fontWeight: 700,
                  color: tokens === 0 ? C.red : C.cyan,
                }}>
                  {tokens}
                </span>
              </motion.div>
            </div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: C.textMuted }}>
              {tokens} / {MAX} tokens
            </div>
            {refilling && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ fontFamily: FONTS.mono, fontSize: 9, color: C.green }}
              >
                +1 refilled
              </motion.div>
            )}
          </div>
        </div>

        {/* Controls + log */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <button
            onClick={sendRequest}
            style={{
              width: '100%',
              padding: '10px',
              background: 'rgba(6,182,212,0.1)',
              border: `1px solid ${C.cyan}`,
              borderRadius: 6,
              color: C.cyan,
              fontFamily: FONTS.mono,
              fontSize: 12,
              cursor: 'pointer',
              marginBottom: 12,
            }}
          >
            ▶ SEND REQUEST
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <AnimatePresence>
              {log.map(entry => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 10,
                    color: entry.status === 'allowed' ? C.green : C.red,
                    padding: '4px 8px',
                    background: entry.status === 'allowed' ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
                    border: `1px solid ${entry.status === 'allowed' ? C.green : C.red}30`,
                    borderRadius: 4,
                  }}
                >
                  {entry.msg}
                </motion.div>
              ))}
            </AnimatePresence>
            {log.length === 0 && (
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted }}>
                Click "SEND REQUEST" to test...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Algorithm Comparison ─────────────────────────────────────────────────────
function AlgorithmCard({ name, icon, pros, cons, memory, complexity, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: active ? 'rgba(6,182,212,0.06)' : C.bgCard,
        border: `1px solid ${active ? C.cyan : C.border}`,
        borderRadius: 8,
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{ fontFamily: FONTS.sans, fontSize: 13, fontWeight: 700, color: active ? C.white : C.text }}>
            {name}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <span style={{
            fontFamily: FONTS.mono, fontSize: 8, color: C.green,
            background: 'rgba(16,185,129,0.1)', border: `1px solid rgba(16,185,129,0.2)`,
            borderRadius: 3, padding: '2px 5px',
          }}>
            {memory}
          </span>
        </div>
      </div>
      {active && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: C.green, marginBottom: 2 }}>✓ PROS</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textDim }}>{pros}</div>
          </div>
          <div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: C.red, marginBottom: 2 }}>✗ CONS</div>
            <div style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textDim }}>{cons}</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

const ALGORITHMS = [
  {
    name: 'Token Bucket',
    icon: '🪣',
    pros: 'Allows bursts up to bucket capacity. Memory efficient. Widely used (AWS, Stripe).',
    cons: 'Challenging to tune bucket size and refill rate simultaneously.',
    memory: 'O(1)',
    complexity: 'Low',
  },
  {
    name: 'Leaking Bucket',
    icon: '💧',
    pros: 'Smoothes out bursts — requests processed at constant rate. Good for stable output rate.',
    cons: 'Burst traffic fills queue; recent requests may be dropped. Stale requests in queue.',
    memory: 'O(queue)',
    complexity: 'Low',
  },
  {
    name: 'Fixed Window Counter',
    icon: '🪟',
    pros: 'Simple to implement. Memory efficient. Easy to understand.',
    cons: 'Boundary problem: 2× traffic allowed at window edges. Not truly rate limited.',
    memory: 'O(1)',
    complexity: 'Lowest',
  },
  {
    name: 'Sliding Window Log',
    icon: '📋',
    pros: 'Accurate. No boundary spike problem. Consistent rate limiting.',
    cons: 'Stores all request timestamps. Memory grows with traffic. O(n) memory per user.',
    memory: 'O(n)',
    complexity: 'Medium',
  },
  {
    name: 'Sliding Window Counter',
    icon: '🎰',
    pros: 'Low memory. Smoothes window boundary spikes. Best of both worlds.',
    cons: 'Approximate (assumes uniform distribution in prev window). ~0.003% error in experiments.',
    memory: 'O(1)',
    complexity: 'Low',
  },
]

// ─── Distributed Rate Limiter Diagram ────────────────────────────────────────
function DistributedDiagram() {
  return (
    <svg viewBox="0 0 680 260" style={{ width: '100%', maxHeight: 260 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr2" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={C.cyan} />
        </marker>
      </defs>

      {/* Clients */}
      {[40, 100, 160].map((y, i) => (
        <g key={i}>
          <rect x="10" y={y} width="60" height="30" rx="5" fill="#1a2236" stroke={C.border} strokeWidth="1"/>
          <text x="40" y={y+19} textAnchor="middle" fill={C.textDim} fontSize="9" fontFamily="JetBrains Mono">Client {i+1}</text>
          <line x1="70" y1={y+15} x2="120" y2="130" stroke={C.border} strokeWidth="1" markerEnd="url(#arr2)"/>
        </g>
      ))}

      {/* API Gateway */}
      <rect x="120" y="105" width="100" height="50" rx="6" fill="rgba(245,158,11,0.1)" stroke={C.amber} strokeWidth="1.5"/>
      <text x="170" y="126" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">API GATEWAY</text>
      <text x="170" y="142" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">+ Rate Limiter</text>

      {/* Redis Cluster */}
      <rect x="260" y="80" width="110" height="100" rx="6" fill="rgba(239,68,68,0.08)" stroke={`${C.red}60`} strokeWidth="1.5" strokeDasharray="5,3"/>
      <text x="315" y="100" textAnchor="middle" fill={`${C.red}90`} fontSize="9" fontFamily="JetBrains Mono">REDIS CLUSTER</text>
      <text x="315" y="116" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">shared counters</text>
      {/* Redis nodes */}
      {[[275,130],[315,150],[355,130]].map(([x,y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="14" fill="rgba(239,68,68,0.15)" stroke={`${C.red}40`} strokeWidth="1"/>
          <text x={x} y={y+4} textAnchor="middle" fill={`${C.red}90`} fontSize="8" fontFamily="JetBrains Mono">R{i+1}</text>
        </g>
      ))}

      {/* Arrow from gateway to Redis */}
      <line x1="220" y1="130" x2="260" y2="130" stroke={C.red} strokeWidth="1.5" strokeDasharray="4,2" markerEnd="url(#arr2)"/>
      <text x="240" y="122" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">INCR/TTL</text>

      {/* Backend services */}
      {[70, 130, 190].map((y, i) => (
        <g key={i}>
          <rect x="420" y={y} width="90" height="32" rx="5" fill="rgba(6,182,212,0.08)" stroke={`${C.cyan}40`} strokeWidth="1"/>
          <text x="465" y={y+20} textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono">Service {i+1}</text>
          <line x1="380" y1="130" x2="420" y2={y+16} stroke={C.green} strokeWidth="1" markerEnd="url(#arr2)"/>
        </g>
      ))}

      {/* Arrow from gateway to services */}
      <rect x="370" y="110" width="50" height="40" rx="5" fill="rgba(16,185,129,0.08)" stroke={`${C.green}40`} strokeWidth="1"/>
      <text x="395" y="129" textAnchor="middle" fill={C.green} fontSize="8" fontFamily="JetBrains Mono">allowed</text>
      <text x="395" y="143" textAnchor="middle" fill={C.green} fontSize="8" fontFamily="JetBrains Mono">→ route</text>
      <line x1="220" y1="130" x2="370" y2="130" stroke={C.green} strokeWidth="1" markerEnd="url(#arr2)"/>

      {/* 429 path */}
      <text x="170" y="175" textAnchor="middle" fill={C.red} fontSize="8" fontFamily="JetBrains Mono">429 Too Many Requests</text>
      <path d="M170,165 L170,195 L80,195 L80,125" stroke={C.red} strokeWidth="1" strokeDasharray="3,2" fill="none" markerEnd="url(#arr2)"/>

      {/* Rule store */}
      <rect x="260" y="210" width="110" height="34" rx="5" fill="rgba(167,139,250,0.08)" stroke={`#a78bfa50`} strokeWidth="1"/>
      <text x="315" y="225" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono">RULES STORE</text>
      <text x="315" y="238" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">configs (DB/cache)</text>
      <line x1="170" y1="155" x2="315" y2="210" stroke="#a78bfa30" strokeWidth="1" strokeDasharray="3,3" markerEnd="url(#arr2)"/>
    </svg>
  )
}

// ─── Main Chapter ─────────────────────────────────────────────────────────────
export default function Ch04RateLimiter() {
  const [activeAlgo, setActiveAlgo] = useState(0)

  return (
    <div>
      <Section title="What Is a Rate Limiter?" icon="⚡">
        <InfoBox type="info">
          A rate limiter controls the rate of requests a client or service can send in a given time window.
          Exceeding the limit returns HTTP <code style={{ color: C.cyan }}>429 Too Many Requests</code>.
        </InfoBox>

        <ConceptGrid>
          <ConceptCard title="Prevent DoS Attacks" icon="🛡️" color={C.red}>
            Intentional or unintentional — rate limiting blocks request floods from overwhelming your service.
          </ConceptCard>
          <ConceptCard title="Cost Control" icon="💰" color={C.green}>
            Third-party APIs (Stripe, Twilio) cost money per call. Rate limiting prevents runaway costs.
          </ConceptCard>
          <ConceptCard title="Fair Usage" icon="⚖️" color={C.cyan}>
            Prevent heavy users from starving others. Enforce per-user, per-IP, or per-API-key quotas.
          </ConceptCard>
          <ConceptCard title="Server Stability" icon="🔒" color={C.amber}>
            Protect downstream services from being overwhelmed during traffic spikes. Acts as a circuit breaker.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="The 5 Algorithms" icon="🧮">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Click each algorithm to expand its trade-offs:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ALGORITHMS.map((algo, i) => (
            <AlgorithmCard
              key={algo.name}
              {...algo}
              active={activeAlgo === i}
              onClick={() => setActiveAlgo(activeAlgo === i ? -1 : i)}
            />
          ))}
        </div>

        <InfoBox type="key" style={{ marginTop: 16 }}>
          <strong>Alex Xu's Recommendation:</strong> Use <strong>Token Bucket</strong> for burst-tolerant APIs,
          <strong> Sliding Window Counter</strong> for strict per-minute limits. Fixed Window Counter is
          simplest but has the boundary spike vulnerability.
        </InfoBox>
      </Section>

      <Section title="Token Bucket — Interactive Demo" icon="🪣">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 8px' }}>
          Bucket holds up to 8 tokens. Refills 1 token every 1.5 seconds. Each request consumes 1 token.
          Hit the button rapidly to see throttling in action:
        </p>
        <TokenBucketViz />

        <SubSection title="Token Bucket Pseudocode">
          <CodeBlock lang="python" code={`class TokenBucket:
    def __init__(self, capacity, refill_rate):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate  # tokens per second
        self.last_refill = time.now()

    def allow_request(self) -> bool:
        self._refill()
        if self.tokens >= 1:
            self.tokens -= 1
            return True   # ✅ Allow
        return False      # ❌ 429 Too Many Requests

    def _refill(self):
        now = time.now()
        elapsed = now - self.last_refill
        new_tokens = elapsed * self.refill_rate
        self.tokens = min(self.capacity, self.tokens + new_tokens)
        self.last_refill = now`} />
        </SubSection>
      </Section>

      <Section title="Fixed Window Problem" icon="⚠️">
        <InfoBox type="warn">
          <strong>The Boundary Spike Vulnerability:</strong> If limit is 5 req/min, a client can send
          5 requests at 00:59 and 5 more at 01:00 — effectively 10 requests in 2 seconds!
        </InfoBox>

        <div style={{
          background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8,
          padding: '16px', margin: '12px 0',
        }}>
          <svg viewBox="0 0 600 100" style={{ width: '100%' }}>
            <text x="10" y="20" fill={C.textMuted} fontSize="10" fontFamily="JetBrains Mono">Timeline (1 min windows)</text>

            {/* Window 1 */}
            <rect x="10" y="35" width="280" height="40" rx="4" fill="rgba(6,182,212,0.05)" stroke={`${C.cyan}30`} strokeWidth="1"/>
            <text x="150" y="52" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">Window 1 (00:00–01:00)</text>

            {/* Window 2 */}
            <rect x="300" y="35" width="280" height="40" rx="4" fill="rgba(239,68,68,0.05)" stroke={`${C.red}30`} strokeWidth="1"/>
            <text x="440" y="52" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">Window 2 (01:00–02:00)</text>

            {/* Requests in last 10% of window 1 */}
            {[230, 244, 258, 272, 286].map((x, i) => (
              <g key={i}>
                <circle cx={x} cy="62" r="5" fill={C.cyan}/>
                <text x={x} y="85" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="JetBrains Mono">req</text>
              </g>
            ))}

            {/* Requests in first 10% of window 2 */}
            {[304, 318, 332, 346, 360].map((x, i) => (
              <g key={i}>
                <circle cx={x} cy="62" r="5" fill={C.red}/>
                <text x={x} y="85" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="JetBrains Mono">req</text>
              </g>
            ))}

            {/* Brace showing 10 requests in 2 seconds */}
            <line x1="225" y1="30" x2="365" y2="30" stroke={C.amber} strokeWidth="1"/>
            <text x="295" y="22" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">10 requests in ~2 seconds!</text>

            {/* Boundary line */}
            <line x1="295" y1="30" x2="295" y2="80" stroke={C.amber} strokeWidth="1.5" strokeDasharray="3,2"/>
            <text x="295" y="95" textAnchor="middle" fill={C.amber} fontSize="8" fontFamily="JetBrains Mono">boundary</text>
          </svg>
        </div>

        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7 }}>
          <strong style={{ color: C.white }}>Sliding Window Counter</strong> solves this by prorating the
          previous window's count: <code style={{ color: C.cyan, fontFamily: FONTS.mono }}>
          current = prev_count × (1 - elapsed%) + curr_count</code>
        </p>
      </Section>

      <Section title="Distributed Rate Limiter Architecture" icon="🏗️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          In a distributed system with multiple servers, counters must be shared. Without a central
          store, each server would have its own counter — easily bypassed by hitting different servers.
        </p>

        <div style={{
          background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8,
          padding: '16px', marginBottom: 16,
        }}>
          <DistributedDiagram />
        </div>

        <SubSection title="Redis Implementation">
          <CodeBlock lang="redis + lua" code={`-- Atomic Lua script (runs on Redis server, no race conditions)
local key = KEYS[1]          -- "rate_limit:user_123:2024-01-15-14:30"
local limit = tonumber(ARGV[1])  -- 100
local window = tonumber(ARGV[2]) -- 60 (seconds)

local current = redis.call("INCR", key)
if current == 1 then
    redis.call("EXPIRE", key, window)  -- set TTL on first request
end

if current > limit then
    return 0  -- ❌ throttled
end
return 1      -- ✅ allowed`} />
        </SubSection>

        <InfoBox type="warn">
          <strong>Race Condition:</strong> Without Lua scripts or Redis transactions, two simultaneous
          requests could both read count=99, both increment to 100, and both get allowed — violating
          the limit. Always use atomic operations.
        </InfoBox>

        <SubSection title="Rate Limiting Rules (Lyft Envoy format)">
          <CodeBlock lang="yaml" code={`domain: messaging
descriptors:
  - key: user_id
    value: premium
    rate_limit:
      unit: minute
      requests_per_unit: 1000
  - key: user_id
    rate_limit:
      unit: minute
      requests_per_unit: 100    # free tier
  - key: ip_address
    rate_limit:
      unit: second
      requests_per_unit: 20     # per-IP burst limit`} />
        </SubSection>
      </Section>

      <Section title="Where to Deploy the Rate Limiter" icon="🗺️">
        <TradeoffTable rows={[
          {
            approach: 'Client-side',
            pros: 'No network overhead. Immediate feedback.',
            cons: 'Client can bypass it. Not a reliable enforcement point.',
            when: 'UX only (debounce, disable button). Never for security.',
          },
          {
            approach: 'API Gateway (Middleware)',
            pros: 'One place to manage all limits. Works before traffic hits services. Cloud-native.',
            cons: 'Gateway becomes a bottleneck. Must be HA.',
            when: 'Most production systems. AWS API Gateway, Kong, Envoy.',
          },
          {
            approach: 'Server-side (In-process)',
            pros: 'Full control. No extra network hop.',
            cons: 'Each service must implement it. Not shared across instances without Redis.',
            when: 'Internal services. Microservices with their own rate limits.',
          },
        ]} />
      </Section>

      <Section title="Response Headers" icon="📨">
        <CodeBlock lang="http response headers" code={`HTTP/1.1 200 OK
X-RateLimit-Limit: 100           # max requests per window
X-RateLimit-Remaining: 43        # remaining in current window
X-RateLimit-Reset: 1705320600    # Unix timestamp when window resets

# When throttled:
HTTP/1.1 429 Too Many Requests
Retry-After: 30                  # seconds until client can retry`} />

        <InfoBox type="tip">
          Always return <code style={{ color: C.cyan }}>Retry-After</code> header so well-behaved
          clients can back off and retry at the right time. Without it, clients may hammer
          the server immediately after the 429.
        </InfoBox>
      </Section>

      <Section title="Handling Races in Distributed Systems" icon="⚡">
        <StepList steps={[
          { title: 'Problem: Race condition', body: 'Two servers simultaneously read count=4 (limit=5). Both increment. Both return 200. Actual count is 6 > limit. Limit violated.' },
          { title: 'Solution 1: Lua script in Redis', body: 'INCR + EXPIRE in a single atomic Lua script. Redis runs scripts single-threaded. No race possible.' },
          { title: 'Solution 2: Redis MULTI/EXEC', body: 'Transaction block ensures atomicity: WATCH key → MULTI → INCR → EXEC. Fails if key changed between WATCH and EXEC — retry.' },
          { title: 'Solution 3: Accept slight inaccuracy', body: 'For most rate limiting scenarios, ±0.1% inaccuracy is acceptable. Use eventual consistency with local counters + periodic sync.' },
        ]} />
      </Section>

      <Section title="Interview Summary" icon="✅">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'Clarify: per-user, per-IP, per-API-key, or per-endpoint limits?',
            'Single server or distributed? → Redis for distributed shared counters',
            'Choose algorithm: Token Bucket (bursts OK) or Sliding Window Counter (strict)',
            'Store rules in config (not hardcoded) — use workers to push to cache',
            'Rate limiter at API Gateway layer for centralized enforcement',
            'Use Lua scripts for atomic Redis operations — no race conditions',
            'Return proper HTTP 429 with Retry-After and X-RateLimit-* headers',
            'Handle rate limiter failure: fail-open (allow) or fail-closed (block)?',
            'Monitor: track throttle rate, token consumption patterns',
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
