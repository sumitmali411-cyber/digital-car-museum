import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Section, SubSection, InfoBox, ConceptGrid, ConceptCard,
  StepList, TradeoffTable, CodeBlock,
} from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── Interactive Redis Sorted Set Demo ────────────────────────────────────────
function SortedSetDemo() {
  const initialScores = [
    { player: 'AceGamer', score: 98500 },
    { player: 'XSniper', score: 87200 },
    { player: 'ProPlayer', score: 81000 },
    { player: 'TopFrag', score: 74300 },
    { player: 'QuickScope', score: 68900 },
  ]
  const [scores, setScores] = useState(initialScores)
  const [player, setPlayer] = useState('')
  const [points, setPoints] = useState('')

  const addScore = () => {
    if (!player.trim() || !points) return
    const p = parseInt(points, 10)
    if (isNaN(p)) return

    setScores(prev => {
      const existing = prev.find(s => s.player === player.trim())
      let updated
      if (existing) {
        updated = prev.map(s => s.player === player.trim() ? { ...s, score: s.score + p } : s)
      } else {
        updated = [...prev, { player: player.trim(), score: p }]
      }
      return updated.sort((a, b) => b.score - a.score).slice(0, 8)
    })
    setPlayer('')
    setPoints('')
  }

  const rankColors = [C.amber, C.textDim, C.amber]

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, letterSpacing: '0.15em', marginBottom: 12 }}>
          REDIS SORTED SET SIMULATOR — ZADD + ZREVRANK
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            value={player}
            onChange={e => setPlayer(e.target.value)}
            placeholder="Player name"
            onKeyDown={e => e.key === 'Enter' && addScore()}
            style={{
              background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 5,
              color: C.text, fontFamily: FONTS.mono, fontSize: 11, padding: '7px 12px',
              flex: '1 1 120px', outline: 'none',
            }}
          />
          <input
            value={points}
            onChange={e => setPoints(e.target.value)}
            placeholder="Score delta"
            type="number"
            onKeyDown={e => e.key === 'Enter' && addScore()}
            style={{
              background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 5,
              color: C.text, fontFamily: FONTS.mono, fontSize: 11, padding: '7px 12px',
              width: 110, outline: 'none',
            }}
          />
          <button
            onClick={addScore}
            style={{
              background: 'rgba(6,182,212,0.1)', border: `1px solid ${C.cyan}`,
              color: C.cyan, fontFamily: FONTS.mono, fontSize: 11,
              padding: '7px 16px', borderRadius: 5, cursor: 'pointer',
            }}
          >
            ZADD
          </button>
        </div>
      </div>
      <div style={{ padding: '12px 0' }}>
        {scores.map((s, i) => (
          <motion.div
            key={s.player}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '8px 20px',
              borderBottom: i < scores.length - 1 ? `1px solid ${C.border}` : 'none',
            }}
          >
            <span style={{
              fontFamily: FONTS.mono, fontSize: 12, fontWeight: 700,
              color: i === 0 ? C.amber : i === 1 ? C.textDim : i === 2 ? '#cd7f32' : C.textMuted,
              width: 24, textAlign: 'right',
            }}>#{i + 1}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.white, fontWeight: 600 }}>{s.player}</div>
            </div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 13, color: C.cyan, fontWeight: 700 }}>
              {s.score.toLocaleString()}
            </div>
            <div style={{
              background: 'rgba(6,182,212,0.08)', border: `1px solid rgba(6,182,212,0.2)`,
              borderRadius: 4, padding: '2px 6px', fontFamily: FONTS.mono, fontSize: 9, color: C.textMuted,
            }}>
              ZRANK: {i}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function V2Ch10Leaderboard() {
  return (
    <div>
      <Section title="Redis Sorted Sets" icon="🏆">
        <InfoBox type="info">
          Redis Sorted Sets (ZSETs) are the foundation of any real-time leaderboard.
          They maintain a collection of unique members, each with a floating-point score,
          automatically kept in sorted order. O(log N) for all operations — perfect for
          millions of players updated in real-time.
        </InfoBox>

        <SortedSetDemo />

        <SubSection title="Core Redis Commands">
          <CodeBlock lang="redis commands" code={`# Add/update a player's score (or increment with ZINCRBY)
ZADD  leaderboard:global 98500 "AceGamer"
ZADD  leaderboard:global XX INCRBY 500 "AceGamer"  # XX = only update existing

# Get rank (0-indexed from highest score)
ZREVRANK leaderboard:global "AceGamer"     → 0  (rank #1)
ZREVRANK leaderboard:global "QuickScope"   → 4  (rank #5)

# Get top 10 with scores
ZREVRANGE leaderboard:global 0 9 WITHSCORES

# Get player's score
ZSCORE leaderboard:global "AceGamer"       → "98500"

# Count players in a score range (e.g., between 50K and 100K)
ZCOUNT leaderboard:global 50000 100000

# Get players around a specific rank (for "players near me")
ZREVRANGEBYRANK leaderboard:global
    (player_rank - 2) (player_rank + 2) WITHSCORES`} />
        </SubSection>

        <InfoBox type="key">
          Internally, Redis Sorted Sets use a <strong>skip list</strong> + <strong>hash table</strong>
          dual structure. Skip list maintains sorted order for range queries O(log N).
          Hash table maps member → score for O(1) score lookups. Both updated atomically on every write.
        </InfoBox>
      </Section>

      <Section title="Score Ingestion Pipeline" icon="🎮">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          At gaming scale, scores can arrive millions of times per second across all players
          in a match. The ingestion pipeline must be non-blocking to the game server.
        </p>

        <StepList steps={[
          { title: 'Game server publishes score event', body: 'Game server writes score update to Kafka: {player_id, delta_score, game_id, timestamp}. Non-blocking — game flow not interrupted by leaderboard update latency.' },
          { title: 'Score consumer batches ZINCRBY calls', body: 'A dedicated consumer reads from Kafka and batches score increments using Redis pipelines. Instead of 1000 individual ZINCRBY calls, sends a pipeline of 1000 commands in one round-trip. Reduces Redis round-trips by 99%.' },
          { title: 'Multiple leaderboard keys updated', body: 'A single score event may update multiple sorted sets: global leaderboard, regional leaderboard (by geo), weekly/monthly leaderboard, friend-group leaderboard. Use a Lua script for atomic multi-key updates.' },
          { title: 'Score validation before write', body: 'Anti-cheat: validate score delta is within physically possible range for the game mode and time elapsed. Scores exceeding N sigma above mean for that game type flagged for review before being applied.' },
        ]} />

        <CodeBlock lang="redis pipeline batch" code={`# Batch multiple ZINCRBY commands in one pipeline
pipe = redis.pipeline(transaction=False)  # no MULTI/EXEC overhead

for event in score_batch:
    pipe.zincrby('leaderboard:global', event.delta, event.player_id)
    pipe.zincrby(f'leaderboard:region:{event.region}', event.delta, event.player_id)
    pipe.zincrby(f'leaderboard:weekly:{current_week}', event.delta, event.player_id)

results = pipe.execute()  # single round-trip for all commands`} />
      </Section>

      <Section title="Top-K Query Optimization" icon="🔢">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Fetching the global top 10 is trivially O(log N + 10) with ZREVRANGE. But "top K"
          queries for millions of concurrent users need additional optimization to avoid
          hammering Redis on every page load.
        </p>

        <ConceptGrid>
          <ConceptCard title="Read-Through Cache" icon="💾" color={C.cyan}>
            Top-10 leaderboard cached in application memory for 1 second. 1M concurrent
            users requesting leaderboard → 1 Redis call/second instead of 1M. Acceptable
            staleness for most games (rankings don't change every millisecond).
          </ConceptCard>
          <ConceptCard title="Pub/Sub Push" icon="📡" color={C.green}>
            Redis Pub/Sub or WebSocket push: when top-10 changes, server pushes to all
            connected clients. No polling needed. Reduces read load to near-zero for
            static display cases.
          </ConceptCard>
          <ConceptCard title="Approximate Top-K" icon="≈" color={C.amber}>
            Redis CMS (Count-Min Sketch) or HyperLogLog for approximate counts.
            For "top trending" (not absolute rank), probabilistic structures use 99%
            less memory with ~1% error. Use Redis TOPK module.
          </ConceptCard>
          <ConceptCard title="Snapshot Denormalization" icon="📸" color={C.purple}>
            Write top-N as a Redis STRING (serialized JSON) on score change. Reads
            hit this single key. No ZREVRANGE computation on read path. Updated
            async after each score batch.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Leaderboard Sharding for Global Scale" icon="🌍">
        <InfoBox type="warn">
          A single Redis Sorted Set with 100M players approaches Redis memory limits
          (~1.5GB for 100M members). A single Redis instance also caps at ~100K
          write ops/sec. At Fortnite/PUBG scale, sharding is required.
        </InfoBox>

        <TradeoffTable rows={[
          {
            approach: 'Shard by score range',
            pros: 'Natural for top-K queries — only hit shard 0 for top 1000.',
            cons: 'Hot shard problem: all new writes go to the highest-score shard initially.',
            when: 'Stable score distributions where top players are a fixed small set.',
          },
          {
            approach: 'Shard by player_id hash',
            pros: 'Even write distribution. No hot shards.',
            cons: 'Global rank requires scatter-gather across all shards. More expensive.',
            when: 'Write-heavy workloads. Global rank approximated, not exact.',
          },
          {
            approach: 'Hierarchical sharding',
            pros: 'Regional shards feed into a global shard. Regional writes fast; global updated periodically.',
            cons: 'Temporary inconsistency between regional and global.',
            when: 'Global multiplayer games with regional servers. Most practical approach.',
          },
        ]} />

        <SubSection title="Scatter-Gather for Global Rank">
          <CodeBlock lang="global rank from sharded leaderboard" code={`def get_global_rank(player_id: str) -> int:
    player_score = redis.zscore('leaderboard:global', player_id)

    # Scatter: query all shards in parallel
    futures = [
        executor.submit(
            shard.zcount, 'leaderboard:shard', player_score, '+inf'
        )
        for shard in ALL_SHARDS
    ]

    # Gather: sum counts from all shards (players with higher score)
    higher_count = sum(f.result() for f in futures)
    return higher_count + 1  # 1-indexed rank

# Optimization: cache per-shard counts with 5s TTL
# Rank accuracy ±0.1% — acceptable for non-top-100 players`} />
        </SubSection>
      </Section>

      <Section title="Historical Snapshots" icon="📅">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Redis holds live data in memory (current season/week). Historical leaderboards
          (last month, last season) are snapshotted and moved to persistent storage.
        </p>

        <StepList steps={[
          { title: 'Periodic snapshot job', body: 'At end of each week/month/season, a cron job reads the full sorted set using ZREVRANGE with WITHSCORES and writes it to S3 as a compressed JSON/Parquet file. Atomic operation: snapshot before resetting scores.' },
          { title: 'Score reset for new period', body: 'After snapshot, reset leaderboard for new period. Options: RENAME old key to archive, create fresh key for new period. Players start each new week/season from 0 (or carry-over configurable %).' },
          { title: 'Historical rank queries', body: 'Historical rank queries hit S3/DynamoDB, not Redis. Load previous period\'s data on-demand (cached after first read). Historical data never changes — perfect for CDN caching with long TTLs.' },
        ]} />
      </Section>

      <Section title="Anti-Cheat Considerations" icon="🛡️">
        <ConceptGrid>
          <ConceptCard title="Score Validation" icon="✅" color={C.cyan}>
            Server-authoritative scoring — never trust client-reported scores. Game server
            computes score from game events. Max possible score per minute bounded by game
            mechanics. Reject scores exceeding physical limits.
          </ConceptCard>
          <ConceptCard title="Rate Limiting" icon="⚡" color={C.amber}>
            Limit score update frequency per player. A legitimate player can only submit
            one game result at a time. Concurrent score submissions from same account →
            flag for review.
          </ConceptCard>
          <ConceptCard title="Statistical Outlier Detection" icon="📊" color={C.purple}>
            Monitor score distribution per player over time. Sudden jump from percentile 50
            to top 0.1% in one session is statistically improbable. Flag accounts with
            anomalous progression for human review.
          </ConceptCard>
          <ConceptCard title="Soft Bans / Shadow Leaderboard" icon="👁️" color={C.red}>
            Suspected cheaters shown their own "shadow" leaderboard where they rank #1 —
            unaware they're sandboxed. Actual leaderboard unaffected. Gives time for
            investigation without alerting sophisticated cheaters.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Interview Checklist" icon="✅">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'Redis Sorted Set: ZADD/ZINCRBY for writes, ZREVRANK/ZREVRANGE for reads',
            'Kafka buffer between game servers and Redis — async score ingestion',
            'Batch ZINCRBY commands in Redis pipelines for 100x throughput',
            'Update multiple ZSETs per event: global, regional, weekly, friends',
            'Cache top-10 in app memory with 1s TTL — avoid 1M/sec Redis calls',
            'Shard by score range for read efficiency; by hash for write balance',
            'Global rank: scatter-gather across shards, sum counts with higher scores',
            'End-of-period: ZREVRANGE snapshot to S3, then reset for new season',
            'Anti-cheat: server-authoritative scores, outlier detection, shadow bans',
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
