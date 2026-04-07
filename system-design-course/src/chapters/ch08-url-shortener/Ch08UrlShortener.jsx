import { useState } from 'react'
import { Section, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

function Base62Demo() {
  const [input, setInput] = useState(2009215674938)
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  const toBase62 = (n) => {
    let num = BigInt(n)
    if (num === 0n) return chars[0]
    let result = ''
    while (num > 0n) {
      result = chars[Number(num % 62n)] + result
      num = num / 62n
    }
    return result
  }

  const code = toBase62(input)

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px' }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, letterSpacing: '0.15em', marginBottom: 12 }}>
        BASE62 ENCODER — 62^7 = 3.5 TRILLION UNIQUE CODES
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
        <input
          type="number"
          value={input}
          onChange={e => setInput(Math.max(0, parseInt(e.target.value) || 0))}
          style={{
            background: '#0d1117', border: `1px solid ${C.border}`,
            color: C.white, fontFamily: FONTS.mono, fontSize: 14,
            padding: '8px 12px', borderRadius: 6, width: 200,
          }}
        />
        <span style={{ fontFamily: FONTS.mono, fontSize: 18, color: C.textMuted }}>→</span>
        <div style={{
          background: 'rgba(6,182,212,0.1)', border: `1px solid ${C.cyan}`,
          borderRadius: 6, padding: '8px 16px',
          fontFamily: FONTS.mono, fontSize: 20, fontWeight: 700, color: C.cyan,
          letterSpacing: '0.1em',
        }}>
          {code}
        </div>
        <span style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textMuted }}>
          {code.length} chars
        </span>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted }}>alphabet:</span>
        {chars.split('').map((c, i) => (
          <span key={i} style={{
            fontFamily: FONTS.mono, fontSize: 9, color: C.textDim,
            background: code.includes(c) ? 'rgba(6,182,212,0.15)' : 'transparent',
            borderRadius: 2, padding: '1px 2px',
          }}>{c}</span>
        ))}
      </div>
    </div>
  )
}

function RedirectDiagram() {
  const [type, setType] = useState('302')
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px' }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['301', '302'].map(t => (
          <button key={t} onClick={() => setType(t)} style={{
            background: type === t ? 'rgba(6,182,212,0.15)' : 'transparent',
            border: `1px solid ${type === t ? C.cyan : C.border}`,
            color: type === t ? C.cyan : C.textMuted,
            fontFamily: FONTS.mono, fontSize: 11, padding: '6px 12px', borderRadius: 5, cursor: 'pointer',
          }}>
            HTTP {t} {t === '301' ? '(Permanent)' : '(Temporary)'}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 600 140" style={{ width: '100%' }}>
        <defs>
          <marker id="a3" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L7,3 z" fill={C.cyan} />
          </marker>
        </defs>
        {/* Client */}
        <rect x="10" y="55" width="80" height="36" rx="5" fill="#1a2236" stroke={C.border} strokeWidth="1"/>
        <text x="50" y="77" textAnchor="middle" fill={C.textDim} fontSize="10" fontFamily="JetBrains Mono">CLIENT</text>

        {/* Short URL Server */}
        <rect x="180" y="55" width="100" height="36" rx="5" fill="rgba(6,182,212,0.08)" stroke={C.cyan} strokeWidth="1"/>
        <text x="230" y="71" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono">SHORT URL</text>
        <text x="230" y="83" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="JetBrains Mono">SERVICE</text>

        {/* Cache */}
        {type === '302' && (
          <g>
            <rect x="180" y="10" width="100" height="30" rx="5" fill="rgba(16,185,129,0.08)" stroke={`${C.green}60`} strokeWidth="1"/>
            <text x="230" y="29" textAnchor="middle" fill={C.green} fontSize="9" fontFamily="JetBrains Mono">BROWSER CACHE</text>
          </g>
        )}
        {type === '301' && (
          <g>
            <rect x="180" y="10" width="100" height="30" rx="5" fill="rgba(16,185,129,0.2)" stroke={C.green} strokeWidth="1.5"/>
            <text x="230" y="29" textAnchor="middle" fill={C.green} fontSize="9" fontFamily="JetBrains Mono">BROWSER CACHE ✅</text>
          </g>
        )}

        {/* Original URL server */}
        <rect x="390" y="55" width="110" height="36" rx="5" fill="rgba(245,158,11,0.08)" stroke={`${C.amber}60`} strokeWidth="1"/>
        <text x="445" y="71" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">ORIGINAL URL</text>
        <text x="445" y="83" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="JetBrains Mono">SERVER</text>

        {/* Request */}
        <line x1="90" y1="73" x2="180" y2="73" stroke={C.cyan} strokeWidth="1.5" markerEnd="url(#a3)"/>
        <text x="135" y="65" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">GET /abc</text>

        {/* Redirect response */}
        <line x1="180" y1="76" x2="90" y2="76" stroke={type === '301' ? C.green : C.amber} strokeWidth="1.5" markerEnd="url(#a3)"/>
        <text x="135" y="88" textAnchor="middle" fill={type === '301' ? C.green : C.amber} fontSize="8" fontFamily="JetBrains Mono">
          {type} → location
        </text>

        {/* Client to original */}
        <path d={type === '301'
          ? 'M90,65 Q240,20 390,73'
          : 'M90,68 Q240,40 390,73'
        } stroke={type === '301' ? C.green : C.cyan} strokeWidth="1.5" fill="none" markerEnd="url(#a3)" strokeDasharray={type === '301' ? '5,3' : 'none'}/>
        <text x={type === '301' ? '240' : '240'} y={type === '301' ? '35' : '52'}
          textAnchor="middle" fill={type === '301' ? C.green : C.cyan} fontSize="8" fontFamily="JetBrains Mono">
          {type === '301' ? '2nd visit: browser cache (no server hit!)' : 'always hits server (analytics ✅)'}
        </text>
      </svg>

      <InfoBox type={type === '301' ? 'tip' : 'info'}>
        {type === '301' ? (
          <><strong>301 Permanent:</strong> Browser caches the redirect permanently. Reduces server load.
          Good if URL never changes. <strong>Bad for analytics</strong> — second visits bypass your server.</>
        ) : (
          <><strong>302 Temporary:</strong> Browser always asks your server. Every click is tracked.
          Higher server load but <strong>perfect for analytics</strong> use cases like bit.ly.</>
        )}
      </InfoBox>
    </div>
  )
}

export default function Ch08UrlShortener() {
  return (
    <div>
      <Section title="Requirements & Scale" icon="📋">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, marginBottom: 16 }}>
          {[
            { v: '100M', l: 'URLs/day created', c: C.cyan },
            { v: '1,157', l: 'writes/sec avg', c: C.green },
            { v: '~10:1', l: 'read:write ratio', c: C.amber },
            { v: '11,570', l: 'reads/sec', c: C.purple },
            { v: '36.5B', l: 'URLs stored (10yr)', c: C.cyan },
            { v: '3.65 TB', l: 'storage (10yr)', c: C.green },
          ].map(s => (
            <div key={s.l} style={{
              background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: '10px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 18, fontWeight: 700, color: s.c }}>{s.v}</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 10, color: C.textMuted, marginTop: 4, lineHeight: 1.3 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <InfoBox type="info">
          <strong>Assumptions:</strong> Average URL = 100 bytes. 100M new URLs/day.
          Retention: 10 years. Read-heavy (10:1 ratio, like most web services).
        </InfoBox>
      </Section>

      <Section title="Base62 Encoding" icon="🔤">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Converts a large integer (the auto-incremented DB ID) into a short alphanumeric code.
          62^7 = 3.5 trillion possible 7-char codes — enough for decades.
        </p>
        <Base62Demo />
      </Section>

      <Section title="301 vs 302 Redirect" icon="↪️">
        <RedirectDiagram />
      </Section>

      <Section title="System Architecture" icon="🏗️">
        <CodeBlock lang="api design" code={`POST /api/v1/data/shorten
  request:  { longUrl: "https://example.com/very/long/path?q=123" }
  response: { shortUrl: "https://tinyurl.com/y7ke-ocwj" }

GET /:shortCode
  → 301 or 302 redirect to original URL`} />

        <StepList steps={[
          {
            title: 'Write path: shorten URL',
            body: '1. Check if longUrl already exists in DB (avoid duplicates). 2. If new, INSERT into DB → get auto-increment ID. 3. Encode ID to base62 shortCode. 4. Store shortCode → longUrl mapping. 5. Return shortUrl.',
          },
          {
            title: 'Read path: redirect',
            body: '1. Extract shortCode from URL. 2. Check Redis cache (LRU). 3. On miss, query DB for longUrl. 4. Store in Redis with TTL. 5. Return 301/302 redirect.',
          },
          {
            title: 'Bloom filter for deduplication',
            body: 'Before DB lookup, check bloom filter. If "probably not in DB" → definitely new URL (no DB read needed). If "might be in DB" → check DB. Reduces read load by ~70%.',
          },
        ]} />
      </Section>

      <Section title="Database Design" icon="🗄️">
        <CodeBlock lang="sql" code={`CREATE TABLE url_mappings (
    id          BIGINT PRIMARY KEY AUTO_INCREMENT,
    short_code  VARCHAR(7)   NOT NULL UNIQUE,
    long_url    VARCHAR(2048) NOT NULL,
    user_id     BIGINT,
    created_at  TIMESTAMP DEFAULT NOW(),
    expires_at  TIMESTAMP,
    click_count BIGINT DEFAULT 0,
    INDEX idx_short_code (short_code),  -- hot read path
    INDEX idx_long_url_hash (crc32(long_url)) -- dedup check
);

-- For analytics: separate click events table (high write volume)
CREATE TABLE click_events (
    id          BIGINT AUTO_INCREMENT,
    short_code  VARCHAR(7),
    clicked_at  TIMESTAMP,
    country     VARCHAR(2),
    referrer    VARCHAR(255),
    PRIMARY KEY (id, clicked_at)  -- partitioned by date
) PARTITION BY RANGE (YEAR(clicked_at));`} />

        <InfoBox type="warn">
          Use NoSQL (DynamoDB/Cassandra) if you need extreme write throughput for analytics.
          SQL works well for core URL mappings since they're mostly read.
        </InfoBox>
      </Section>

      <Section title="Trade-offs" icon="⚖️">
        <TradeoffTable rows={[
          {
            approach: 'Hash function (MD5/SHA256)',
            pros: 'Deterministic. Same URL always same code. No DB needed for dedup.',
            cons: 'Hash collision possible. Must handle. First N chars = weak uniqueness.',
            when: 'When deduplication is critical and determinism is needed.',
          },
          {
            approach: 'Auto-increment + Base62',
            pros: 'No collisions. Simple. IDs are sequential. Easy to implement.',
            cons: 'DB becomes SPOF. Sequential IDs are predictable (enumerable).',
            when: 'Most production systems (bit.ly approach).',
          },
          {
            approach: 'Random base62',
            pros: 'Not guessable. No sequential pattern.',
            cons: 'Must check for collision on every insert. Rare but real at scale.',
            when: 'Privacy-sensitive use cases.',
          },
        ]} />
      </Section>
    </div>
  )
}
