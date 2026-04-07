import { Section, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

export default function Ch13Autocomplete() {
  return (
    <div>
      <Section title="Requirements & Scale" icon="📋">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
          {[
            { v: '10M',   l: 'DAU',                  c: C.cyan   },
            { v: 'Top 5', l: 'suggestions returned', c: C.green  },
            { v: '<100ms',l: 'response latency',      c: C.amber  },
            { v: '2B',    l: 'trie traversals/day',   c: C.purple },
            { v: '~23K',  l: 'traversals/sec',        c: C.cyan   },
            { v: '5min',  l: 'browser cache TTL',     c: C.green  },
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
          <strong>Scale math:</strong> 10M DAU × 10 searches/day × avg 20 characters typed = 2 billion trie
          traversals per day, roughly 23,000 traversals per second. Each keystroke is a potential API call
          — AJAX debouncing (300 ms) and browser caching collapse that to ~4K actual server requests/sec.
        </InfoBox>
      </Section>

      <Section title="Trie Data Structure" icon="🌳" accent={C.green}>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 16px' }}>
          A <strong style={{ color: C.white }}>trie</strong> (prefix tree) stores characters at each node.
          Every path from root to a leaf spells a query string. Leaf nodes (and intermediate nodes)
          store the query frequency so the top-k can be retrieved without a full traversal.
        </p>

        <CodeBlock lang="data structure" code={`// Trie node — stored in Redis as serialized JSON per prefix key
class TrieNode {
  children: Map<char, TrieNode>   // 26 letters (+ digits + space)
  isEnd:    boolean               // marks complete query
  freq:     number                // query frequency (aggregated weekly)
  topK:     string[]              // cached top-5 completions at this prefix
}

// Example: queries "apple" (500), "app" (300), "application" (150)
root
 └─ 'a' → topK: ["apple","app","application"]
     └─ 'p' → topK: ["apple","app","application"]
         └─ 'p' → topK: ["apple","app","application"]
             ├─ (end, freq=300)
             ├─ 'l' → topK: ["apple","application"]
             │    └─ 'e' (end, freq=500)
             └─ 'l' → 'i' → 'c' → ... (end, freq=150)

// Key insight: cache topK at every node so retrieval is O(prefix_length)
// instead of O(entire subtree).`} />

        <InfoBox type="tip">
          <strong>Trie optimization — Top-K cache at every node:</strong> Pre-compute and store the top-5
          queries at each prefix node during the weekly rebuild. Query time drops from O(p + n) — where
          n is the subtree size — to O(p) where p is the prefix length. Trade-off: trie size grows, but
          traversal is fast enough for sub-100 ms responses.
        </InfoBox>
      </Section>

      <Section title="System Components" icon="🏗️">
        <ConceptGrid>
          <ConceptCard title="Trie Structure" icon="🌳" color={C.green}>
            Each node represents one character. Nodes store pre-computed top-K completions so retrieval
            is O(prefix_length). Max depth is capped (e.g., 50 chars) to bound traversal cost.
          </ConceptCard>
          <ConceptCard title="Top-K Cache" icon="⚡" color={C.cyan}>
            Each trie node caches its top-5 children completions by frequency. Updated weekly during
            trie rebuild. Eliminates deep subtree scans at query time.
          </ConceptCard>
          <ConceptCard title="Data Gathering" icon="📊" color={C.amber}>
            Query logs ingested → aggregated weekly via Hadoop/Spark → new trie built offline →
            serialized → loaded into Redis. Real-time updates skipped to avoid trie thrashing.
          </ConceptCard>
          <ConceptCard title="Query Service" icon="🔍" color={C.purple}>
            API server fetches serialized trie prefix node from Redis → deserializes → returns topK.
            Redis key = prefix string (e.g., <code style={{ fontFamily: FONTS.mono }}>trie:app</code>).
            Cache miss falls back to DB-built trie.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Trie Operations — Time Complexity" icon="⏱️" accent={C.amber}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, marginBottom: 16 }}>
          {[
            { op: 'Insert query',        complexity: 'O(n)',      note: 'n = query length',          c: C.green  },
            { op: 'Find prefix node',    complexity: 'O(p)',      note: 'p = prefix length',         c: C.cyan   },
            { op: 'Top-K (with cache)',  complexity: 'O(p)',      note: 'cached at each node',       c: C.cyan   },
            { op: 'Top-K (no cache)',    complexity: 'O(p + n)',  note: 'n = subtree nodes',         c: C.amber  },
            { op: 'Delete query',        complexity: 'O(n)',      note: 'for content moderation',    c: C.purple },
            { op: 'Serialize to Redis',  complexity: 'O(N)',      note: 'N = total trie nodes',      c: C.textDim },
          ].map(r => (
            <div key={r.op} style={{
              background: C.bgCard, border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${r.c}`, borderRadius: 6, padding: '10px 14px',
            }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 4 }}>{r.op}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 14, fontWeight: 700, color: r.c, marginBottom: 2 }}>{r.complexity}</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: C.textMuted }}>{r.note}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Data Pipeline — Build Trie" icon="🔄" accent={C.purple}>
        <StepList steps={[
          {
            title: 'Log raw queries',
            body: 'Every search query is appended to a distributed log (Kafka). Includes query string, timestamp, user region. No PII stored.',
          },
          {
            title: 'Aggregate weekly (Spark / Hadoop)',
            body: 'Batch job runs weekly. Counts query frequency per string. Filters out adult content, spam, political terms. Outputs (query → freq) pairs.',
          },
          {
            title: 'Build trie offline',
            body: 'Sorted frequency list → insert all queries into trie. Compute top-K completions at every node bottom-up. Limit tree depth to 50 characters.',
          },
          {
            title: 'Serialize and load into Redis',
            body: 'Each prefix node serialized as JSON: { topK: [...], freq: N }. Stored at key "trie:<prefix>". Old keys replaced atomically via Redis pipeline.',
          },
          {
            title: 'Serve via Query Service',
            body: 'On each keystroke (after 300 ms debounce), API server fetches trie:<prefix> from Redis. Returns topK array. Browser caches result for 5 minutes.',
          },
        ]} />
      </Section>

      <Section title="Client-Side Optimizations" icon="💻" accent={C.green}>
        <InfoBox type="tip">
          <strong>AJAX debouncing (300 ms):</strong> Fire the API request only after the user pauses
          typing for 300 ms. Eliminates ~80% of keystrokes as actual server requests. Implemented with
          a clearTimeout/setTimeout pattern in the frontend.
        </InfoBox>
        <InfoBox type="info">
          <strong>Browser-side caching:</strong> Store prefix → suggestions in a local Map with a 5-minute
          TTL. If user types "app", gets results, then backtracks to "ap", the cached result is returned
          instantly with zero network round-trips.
        </InfoBox>
        <InfoBox type="warn">
          <strong>Filter layer:</strong> Before returning suggestions to the client, pass results through
          an adult content filter, political query filter, and spam filter. Blacklisted prefixes are
          stripped server-side — never cached in Redis in the first place.
        </InfoBox>
      </Section>

      <Section title="Top-K Retrieval Algorithm" icon="💾" accent={C.cyan}>
        <CodeBlock lang="javascript" code={`// Query Service — pseudocode
async function getSuggestions(prefix) {
  // 1. Check browser cache first (client side)
  if (browserCache.has(prefix) && !isExpired(prefix)) {
    return browserCache.get(prefix)
  }

  // 2. Fetch from Redis
  const node = await redis.get(\`trie:\${prefix}\`)
  if (node) {
    const result = JSON.parse(node).topK   // pre-computed top-5
    browserCache.set(prefix, result, TTL_5MIN)
    return result
  }

  // 3. Redis miss → rebuild from DB (slow path, rare)
  return await buildFromDB(prefix)
}

// Offline: compute topK at every node (bottom-up DFS)
function computeTopK(node, k = 5) {
  let candidates = []
  if (node.isEnd) candidates.push({ query: node.query, freq: node.freq })

  for (const child of node.children.values()) {
    computeTopK(child, k)           // recurse first
    candidates.push(...child.topK)  // bubble up children's topK
  }

  // Sort by frequency descending, take top-k
  node.topK = candidates
    .sort((a, b) => b.freq - a.freq)
    .slice(0, k)
    .map(c => c.query)
}`} />
      </Section>

      <Section title="Approach Trade-offs" icon="⚖️" accent={C.red}>
        <TradeoffTable rows={[
          {
            approach: 'Trie + Redis',
            pros: 'Sub-100 ms. Prefix-aware. Top-K cached at each node. Industry standard.',
            cons: 'Complex rebuild pipeline. Trie can be large (GB). Redis memory cost.',
            when: 'High-traffic autocomplete (Google, Amazon search).',
          },
          {
            approach: 'Elasticsearch prefix query',
            pros: 'Out-of-the-box. Supports fuzzy match, typo tolerance. Easy to update in real-time.',
            cons: 'Higher latency (~20–50 ms vs ~5 ms trie). More infra. Not as tuned for pure prefix.',
            when: 'Full-text search with autocomplete. Smaller scale or typo-tolerant use cases.',
          },
          {
            approach: 'Database LIKE query',
            pros: 'Trivially simple. No extra infra.',
            cons: 'Extremely slow at scale. Full table scan. Cannot meet <100 ms at 23K req/sec.',
            when: 'Prototypes or internal tools with < 1K users.',
          },
        ]} />
      </Section>

      <InfoBox type="key">
        <strong>Google Suggest at scale:</strong> Google handles billions of autocomplete queries daily
        with sub-100 ms response times globally. The trie is rebuilt continuously, not just weekly —
        using real-time streaming aggregation layered on top of the batch pipeline for trending queries.
        Each data center maintains its own regional trie replica served entirely from memory.
      </InfoBox>
    </div>
  )
}
