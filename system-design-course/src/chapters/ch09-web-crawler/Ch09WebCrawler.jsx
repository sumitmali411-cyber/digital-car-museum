import { Section, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

export default function Ch09WebCrawler() {
  return (
    <div>
      <Section title="Requirements & Scale" icon="📋">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
          {[
            { v: '1B',     l: 'pages/month',       c: C.cyan },
            { v: '~400',   l: 'pages/sec',          c: C.green },
            { v: '~400',   l: 'worker threads',     c: C.amber },
            { v: '500 TB', l: 'storage/month',      c: C.purple },
            { v: '5yr',    l: 'content retention',  c: C.cyan },
            { v: 'BFS',    l: 'traversal strategy', c: C.green },
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
          <strong>Back-of-envelope:</strong> 1B pages/month = 33M pages/day = 400 pages/sec.
          Average page size 500KB → 500 TB/month raw HTML. With 5:1 compression → 100 TB/month stored.
        </InfoBox>
      </Section>

      <Section title="Core Components" icon="🧩">
        <ConceptGrid>
          <ConceptCard title="URL Frontier" icon="📬" color={C.cyan}>
            Priority queue of URLs to crawl. Split into a Prioritizer (assigns scores) and per-domain FIFO queues for politeness. Seeds the entire crawl.
          </ConceptCard>
          <ConceptCard title="DNS Resolver" icon="🌐" color={C.green}>
            Translates hostnames to IPs. Cached aggressively — DNS lookup latency (~10–200ms) is a major bottleneck. Use in-process cache with short TTL.
          </ConceptCard>
          <ConceptCard title="HTML Downloader" icon="⬇️" color={C.amber}>
            Fetches raw HTML over HTTP/HTTPS. Distributed across many worker nodes. Respects per-domain rate limits and robots.txt crawl-delay directives.
          </ConceptCard>
          <ConceptCard title="Link Extractor" icon="🔗" color={C.purple}>
            Parses HTML and extracts all anchor href values. Normalises relative URLs to absolute. Filters by URL filter rules before adding to frontier.
          </ConceptCard>
          <ConceptCard title="Content Seen Filter" icon="🔍" color={C.red}>
            Hashes page content (MD5 or SHA256). Stores hashes in a bloom filter + persistent hash store. Skips pages with duplicate content.
          </ConceptCard>
          <ConceptCard title="URL Filter" icon="🚫" color={C.cyan}>
            Strips fragments, normalises query strings, deduplicates URLs already visited. Uses a URL-level bloom filter (billions of entries, sub-1% false positive rate).
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Architecture Flow" icon="🏗️">
        <StepList steps={[
          {
            title: 'Seed URLs loaded into URL Frontier',
            body: 'A curated list of high-quality seed URLs (e.g. dmoz.org categories) are inserted into the priority queues to bootstrap the crawl.',
          },
          {
            title: 'Prioritiser assigns crawl priority',
            body: 'URLs are scored by PageRank, update frequency, and topic relevance. High-priority URLs go into queues served first by workers.',
          },
          {
            title: 'Worker fetches URL (rate-limited per host)',
            body: 'A worker thread picks the next URL from a per-domain FIFO queue. It enforces a minimum delay (e.g. 1s) between requests to the same host.',
          },
          {
            title: 'HTML Downloader fetches content',
            body: 'Sends HTTP GET with a crawl-bot User-Agent. Checks robots.txt cache first. Downloads HTML, follows up to 3 redirects.',
          },
          {
            title: 'Content deduplication check',
            body: 'Hash the page body. Check bloom filter first (fast). If positive, check persistent hash store (accurate). If duplicate, discard and move on.',
          },
          {
            title: 'Link Extractor parses and discovers new URLs',
            body: 'Extracts all links, normalises them, runs through URL filter (robots exclusion, blocked domains, visited set). Passes new URLs back to the Frontier.',
          },
          {
            title: 'Content stored in distributed object storage',
            body: 'Unique pages are compressed (gzip) and written to object storage (S3 / HDFS). Metadata (URL, crawl timestamp, HTTP status) written to a DB.',
          },
        ]} />
      </Section>

      <Section title="Priority URL Queues" icon="📊">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          The Frontier has two layers. The <span style={{ color: C.cyan }}>Prioritizer</span> computes a score for each URL
          and routes it into one of N priority FIFO queues (F1 = highest). A <span style={{ color: C.green }}>Queue Selector</span> picks
          from queues with probability proportional to their priority, then routes to a per-domain queue for politeness.
        </p>
        <CodeBlock lang="architecture" code={`URL Frontier (two-tier)

  Tier 1 — Prioritisation
  ┌──────────────────┐    ┌──────────┐
  │   Prioritiser    │───▶│ Queue F1 │  (priority = high)
  │  (PageRank +     │───▶│ Queue F2 │
  │   recency score) │───▶│ Queue F3 │  (priority = low)
  └──────────────────┘    └──────────┘
            │
            ▼  Queue Selector (weighted random pick)
  Tier 2 — Politeness (per-domain FIFO queues)
  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ google.* │  │ wiki.*   │  │ cnn.*    │  ...
  └────┬─────┘  └────┬─────┘  └────┬─────┘
       │              │              │
     Worker         Worker         Worker
   (delay ≥ 1s)   (delay ≥ 1s)  (delay ≥ 1s)`} />
      </Section>

      <Section title="Politeness & Robots.txt" icon="🤝">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Crawlers must be good citizens. Two mechanisms enforce this: per-domain download delays and robots.txt compliance.
          Robots.txt is fetched once per domain and cached for hours.
        </p>
        <CodeBlock lang="python pseudocode" code={`class RobotsTxtParser:
    cache = {}  # domain → rules, expires

    def is_allowed(self, url: str, user_agent: str = "MyCrawlerBot") -> bool:
        domain = extract_domain(url)
        if domain not in self.cache or self.cache[domain].expired():
            robots_url = f"https://{domain}/robots.txt"
            text = http_get(robots_url, timeout=5)  # fallback: allow all
            self.cache[domain] = parse_robots(text, ttl=3600)

        rules = self.cache[domain]
        path  = extract_path(url)

        # Check most specific matching User-agent block
        for agent in [user_agent, "*"]:
            if agent in rules.blocks:
                for disallow in rules.blocks[agent].disallow:
                    if path.startswith(disallow):
                        return False  # blocked
                crawl_delay = rules.blocks[agent].crawl_delay
                if crawl_delay:
                    enforce_delay(domain, crawl_delay)
                return True
        return True  # no matching block → allowed`} />
        <InfoBox type="warn">
          <strong>Spider traps</strong> — dynamically generated infinite URL spaces (e.g. /calendar?date=2024-01-01, /calendar?date=2024-01-02, …).
          Detect by setting a max URL depth (e.g. 32 hops from seed) and capping per-domain URL count.
        </InfoBox>
      </Section>

      <Section title="Content Deduplication" icon="🔄">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          ~30% of web pages are near-duplicates. Two-stage check keeps storage clean without expensive full-text comparison.
        </p>
        <CodeBlock lang="pseudocode" code={`# Stage 1: Bloom filter (in-memory, probabilistic — sub-millisecond)
bloom = BloomFilter(capacity=10_000_000_000, error_rate=0.001)

# Stage 2: Hash store (Redis or persistent KV — accurate)
hash_store = RedisDB()

def is_duplicate(page_html: bytes) -> bool:
    content_hash = sha256(page_html.strip())  # normalise whitespace first

    # Fast path: definitely not a duplicate
    if content_hash not in bloom:
        bloom.add(content_hash)
        hash_store.set(content_hash, 1, ex=86400 * 365 * 5)
        return False

    # Slow path: bloom says "maybe" — check accurate store
    return hash_store.exists(content_hash)`} />
        <InfoBox type="tip">
          <strong>URL normalisation</strong> eliminates trivial duplicates before crawling: lowercase scheme+host,
          remove default port (80/443), sort query params, remove tracking params (utm_*), strip trailing slash.
        </InfoBox>
      </Section>

      <Section title="BFS vs DFS Trade-offs" icon="⚖️">
        <TradeoffTable rows={[
          {
            approach: 'BFS (Breadth-First)',
            pros: 'Discovers high-authority pages faster. More balanced across domains. Better for building a broad index.',
            cons: 'Large frontier queue. All links at distance N must be held before going to N+1.',
            when: 'General-purpose web indexing (Google, Bing). Preferred default.',
          },
          {
            approach: 'DFS (Depth-First)',
            pros: 'Low memory for frontier. Fully crawls a site before moving on.',
            cons: 'Can get trapped in deep paths. Spider traps are catastrophic. Misses important cross-site links.',
            when: 'Focused crawls of a single known site (e.g. archiving one domain).',
          },
          {
            approach: 'Bloom Filter URL dedup',
            pros: 'Sub-millisecond lookups. Tiny memory (~1GB for 10B URLs). No false negatives.',
            cons: 'False positives (may skip ~0.1% of new URLs). Cannot delete entries.',
            when: 'Always use as the first-pass dedup layer before the accurate hash store.',
          },
          {
            approach: 'Consistent Hash partitioning',
            pros: 'Each worker owns a URL shard. No coordination needed. Cache-friendly DNS lookups.',
            cons: 'Hotspot domains (Wikipedia) concentrate load on one worker.',
            when: 'Distributed crawlers with 50+ worker nodes.',
          },
        ]} />
      </Section>

      <Section title="Common Pitfalls" icon="⚠️">
        <InfoBox type="danger">
          <strong>Infinite redirect loops</strong> — track redirect chain per crawl job and abort after 3 hops.
          Also set an absolute max URL length (2KB) to reject garbage URLs.
        </InfoBox>
        <InfoBox type="warn">
          <strong>Duplicate pages, different URLs</strong> — canonical link tags, HTTP 301 chains, and www vs non-www all
          produce duplicates. Use content hashing (not URL hashing) as the source of truth.
        </InfoBox>
        <InfoBox type="tip">
          <strong>Dynamic content</strong> — JavaScript-rendered pages require a headless browser (Chromium).
          Run a separate JS-render tier for high-value domains only; too slow for bulk crawling.
        </InfoBox>
      </Section>
    </div>
  )
}
