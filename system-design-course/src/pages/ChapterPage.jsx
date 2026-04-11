import { useParams, useNavigate } from 'react-router-dom'
import chapters from '../data/chapters'
import ChapterLayout from '../components/Shared/ChapterLayout'
import { C, FONTS } from '../styles/colors'

// Chapter content components
import Ch01Scaling from '../chapters/ch01-scaling/Ch01Scaling'
import Ch02Estimation from '../chapters/ch02-estimation/Ch02Estimation'
import Ch03Framework from '../chapters/ch03-framework/Ch03Framework'
import Ch04RateLimiter from '../chapters/ch04-rate-limiter/Ch04RateLimiter'
import Ch05ConsistentHashing from '../chapters/ch05-consistent-hashing/Ch05ConsistentHashing'
import Ch06KeyValueStore from '../chapters/ch06-key-value-store/Ch06KeyValueStore'
import Ch07UniqueId from '../chapters/ch07-unique-id/Ch07UniqueId'
import Ch08UrlShortener from '../chapters/ch08-url-shortener/Ch08UrlShortener'
import Ch12Chat from '../chapters/ch12-chat/Ch12Chat'
import Ch15GoogleDrive from '../chapters/ch15-google-drive/Ch15GoogleDrive'
import V2Ch03Maps from '../chapters/v2-ch03-maps/V2Ch03Maps'
import V2Ch04MessageQueue from '../chapters/v2-ch04-message-queue/V2Ch04MessageQueue'
import V2Ch05Metrics from '../chapters/v2-ch05-metrics/V2Ch05Metrics'
import V2Ch06AdClick from '../chapters/v2-ch06-ad-click/V2Ch06AdClick'
import V2Ch08Email from '../chapters/v2-ch08-email/V2Ch08Email'
import V2Ch09ObjectStorage from '../chapters/v2-ch09-object-storage/V2Ch09ObjectStorage'
import V2Ch10Leaderboard from '../chapters/v2-ch10-leaderboard/V2Ch10Leaderboard'
import V2Ch11Payment from '../chapters/v2-ch11-payment/V2Ch11Payment'
import V2Ch13StockExchange from '../chapters/v2-ch13-stock-exchange/V2Ch13StockExchange'
import ChapterPlaceholder from '../chapters/ChapterPlaceholder'

const CHAPTER_COMPONENTS = {
  'ch01-scaling':            Ch01Scaling,
  'ch02-estimation':         Ch02Estimation,
  'ch03-framework':          Ch03Framework,
  'ch04-rate-limiter':       Ch04RateLimiter,
  'ch05-consistent-hashing': Ch05ConsistentHashing,
  'ch06-key-value-store':    Ch06KeyValueStore,
  'ch07-unique-id':          Ch07UniqueId,
  'ch08-url-shortener':      Ch08UrlShortener,
  'ch12-chat':               Ch12Chat,
  'ch15-google-drive':       Ch15GoogleDrive,
  'v2-ch03-maps':            V2Ch03Maps,
  'v2-ch04-message-queue':   V2Ch04MessageQueue,
  'v2-ch05-metrics':         V2Ch05Metrics,
  'v2-ch06-ad-click':        V2Ch06AdClick,
  'v2-ch08-email':           V2Ch08Email,
  'v2-ch09-object-storage':  V2Ch09ObjectStorage,
  'v2-ch10-leaderboard':     V2Ch10Leaderboard,
  'v2-ch11-payment':         V2Ch11Payment,
  'v2-ch13-stock-exchange':  V2Ch13StockExchange,
}

export default function ChapterPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const chapter = chapters.find(c => c.slug === slug)

  if (!chapter) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', flexDirection: 'column', gap: 16,
        fontFamily: FONTS.sans, color: C.textDim, zIndex: 1, position: 'relative',
      }}>
        <div style={{ fontSize: 40 }}>404</div>
        <div>Chapter not found</div>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: `1px solid ${C.border}`,
          color: C.cyan, fontFamily: FONTS.mono, fontSize: 12,
          padding: '8px 16px', borderRadius: 6, cursor: 'pointer',
        }}>
          ← Back to Home
        </button>
      </div>
    )
  }

  const Content = CHAPTER_COMPONENTS[slug] || ChapterPlaceholder

  return (
    <ChapterLayout chapter={chapter}>
      <Content chapter={chapter} />
    </ChapterLayout>
  )
}
