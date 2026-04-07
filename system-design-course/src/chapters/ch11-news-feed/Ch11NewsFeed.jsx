import { Section, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

export default function Ch11NewsFeed() {
  return (
    <div>
      <Section title="Requirements & Scale" icon="📋">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
          {[
            { v: '300M',   l: 'daily active users', c: C.cyan },
            { v: '10M',    l: 'posts/day',           c: C.green },
            { v: '~115',   l: 'writes/sec',          c: C.amber },
            { v: '500',    l: 'avg followers/user',  c: C.purple },
            { v: '5B',     l: 'fan-out ops/day',     c: C.cyan },
            { v: '<200ms', l: 'feed load target',    c: C.green },
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
          <strong>Two core operations:</strong> (1) <strong>Publish</strong> — a user creates a post, which must appear in followers'
          feeds. (2) <strong>Retrieve</strong> — a user opens their feed and sees a ranked list of recent posts.
        </InfoBox>
      </Section>

      <Section title="Fan-out Strategies" icon="📡">
        <ConceptGrid>
          <ConceptCard title="Fan-out on Write" icon="✍️" color={C.cyan}>
            When a user publishes a post, immediately push the post_id into every follower's feed cache (Redis sorted set).
            Feed reads are instant — no computation at read time. Expensive writes for users with many followers.
          </ConceptCard>
          <ConceptCard title="Fan-out on Read" icon="👁️" color={C.green}>
            When a user opens their feed, pull posts from all followees in real time, merge, and rank.
            Low write cost. High read latency (must query N followees). Impractical at 500+ followees.
          </ConceptCard>
          <ConceptCard title="Hybrid Approach" icon="⚡" color={C.amber}>
            Regular users (followers &lt; 1M) use fan-out on write. Celebrities/influencers use fan-out on read.
            At read time, merge pre-built cache (regular users) with live pull (celebrities). Best overall trade-off.
          </ConceptCard>
          <ConceptCard title="Feed Ranking" icon="🏆" color={C.purple}>
            Sorted set score = f(recency, engagement_score, user_interest_affinity). Re-rank periodically.
            Edge ranking: lighter signals on CDN, heavy ML model offline in batch.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Post Publish Flow" icon="📤">
        <StepList steps={[
          {
            title: 'User submits post to Post Service',
            body: 'POST /posts with content, media_ids, visibility settings. Post Service persists to Post DB (MySQL/Aurora) and returns a post_id (Snowflake ID).',
          },
          {
            title: 'Post Service enqueues fan-out task',
            body: 'Publishes { post_id, author_id, score } to the Fan-out Message Queue (Kafka). Returns 201 to the client immediately — fan-out is async.',
          },
          {
            title: 'Fan-out Worker reads follower list',
            body: 'Queries Social Graph Service for all followers of author_id. For authors with >1M followers, skip fan-out entirely (celebrity mode).',
          },
          {
            title: 'Fan-out Worker writes to feed caches',
            body: 'For each follower_id, executes ZADD feed:{follower_id} {score} {post_id} in Redis. Trims each sorted set to 500 entries (users rarely scroll past 500).',
          },
          {
            title: 'Media CDN pre-warms thumbnails',
            body: 'Concurrently, a media worker generates thumbnails and uploads to CDN. post_id → media_urls mapping is stored in a separate media metadata service.',
          },
        ]} />
      </Section>

      <Section title="Feed Retrieval Flow" icon="📥">
        <StepList steps={[
          {
            title: 'Client requests feed',
            body: 'GET /feed?user_id=123&cursor=0&limit=20. Feed Service checks Redis for pre-built sorted set.',
          },
          {
            title: 'Fetch post_ids from Redis feed cache',
            body: 'ZREVRANGE feed:123 0 19 WITHSCORES — returns up to 20 post_ids ranked by score. If cache is empty (cold user), fall back to fan-out on read.',
          },
          {
            title: 'Merge celebrity posts (hybrid path)',
            body: 'For each celebrity the user follows, fetch their recent N posts from Post DB. Merge with cached post_ids list and re-sort by score.',
          },
          {
            title: 'Hydrate post details in parallel',
            body: 'Batch-fetch Post objects (content, like_count, comment_count) from Post Cache (Redis) / Post DB. Also batch-fetch author profile data from User Cache.',
          },
          {
            title: 'Return ranked feed response',
            body: 'Assemble final JSON response with posts, author info, and a cursor token for pagination. p99 target: <200ms.',
          },
        ]} />
      </Section>

      <Section title="Data Models" icon="🗄️">
        <CodeBlock lang="sql" code={`-- Core tables
CREATE TABLE posts (
    post_id     BIGINT PRIMARY KEY,       -- Snowflake ID (time-ordered)
    user_id     BIGINT NOT NULL,
    content     TEXT,
    media_ids   JSON,                     -- array of media object IDs
    like_count  INT DEFAULT 0,
    created_at  TIMESTAMP NOT NULL,
    INDEX idx_user_created (user_id, created_at DESC)
);

CREATE TABLE follows (
    follower_id  BIGINT NOT NULL,
    followee_id  BIGINT NOT NULL,
    created_at   TIMESTAMP,
    PRIMARY KEY (follower_id, followee_id),
    INDEX idx_followee (followee_id)      -- "who follows this user?"
);

-- Redis feed cache (per-user sorted set)
-- Key:   feed:{user_id}
-- Value: post_id
-- Score: ranking_score (float, higher = higher in feed)
ZADD feed:123 1711000000.95 "post_9982"
ZADD feed:123 1711000000.50 "post_9901"
ZREVRANGE feed:123 0 19   -- top 20 posts`} />
      </Section>

      <Section title="Celebrity Problem & Cache Warming" icon="⭐">
        <InfoBox type="warn">
          <strong>The celebrity problem:</strong> A user with 50M followers creates a post.
          Fan-out on write = 50M Redis ZADD operations. At 10K ops/sec per Redis node, this takes
          ~83 minutes. Solution: skip fan-out on write for celebrities; merge at read time instead.
          Define "celebrity" as followers > threshold (e.g. 500K).
        </InfoBox>
        <InfoBox type="tip">
          <strong>Cache warming for new users:</strong> When a new user signs up and follows people,
          their feed cache is empty. Trigger a one-time backfill job: fetch the last 20 posts from each
          followee and populate feed:{new_user_id} before they open the app.
        </InfoBox>
        <InfoBox type="info">
          <strong>Feed staleness:</strong> Cached feeds can be slightly stale (seconds). This is acceptable.
          For real-time events (live sports scores), use a separate live-score overlay rather than
          forcing fresh feed loads.
        </InfoBox>
      </Section>

      <Section title="Fan-out Strategy Trade-offs" icon="⚖️">
        <TradeoffTable rows={[
          {
            approach: 'Fan-out on Write',
            pros: 'Feed reads are O(1) — just fetch from cache. Very fast user experience.',
            cons: 'Expensive for celebrity writes. Feed cache wasted for inactive users.',
            when: 'Users with moderate follower counts (<1M). Optimise for read performance.',
          },
          {
            approach: 'Fan-out on Read',
            pros: 'Writes are cheap. No wasted cache storage for inactive users.',
            cons: 'Read is expensive: O(followees) queries + merge. Slow for active social graphs.',
            when: 'Low-traffic systems or very high-follower-count publishers only.',
          },
          {
            approach: 'Hybrid (Write + Read)',
            pros: 'Balances write and read costs. Handles celebrity edge case gracefully.',
            cons: 'Complex fan-out routing logic. Need to classify users by follower count.',
            when: 'Production social platforms at scale. Facebook and Instagram use variants of this.',
          },
          {
            approach: 'Pull + Pagination cursor',
            pros: 'Simple. No fan-out infra needed. Users only pay for feeds they actually read.',
            cons: 'High read amplification. Not suitable for >100 followees per user.',
            when: 'Early-stage product or internal tools.',
          },
        ]} />
      </Section>
    </div>
  )
}
