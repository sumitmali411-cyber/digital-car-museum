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
import ChapterPlaceholder from '../chapters/ChapterPlaceholder'

const CHAPTER_COMPONENTS = {
  'ch01-scaling':          Ch01Scaling,
  'ch02-estimation':       Ch02Estimation,
  'ch03-framework':        Ch03Framework,
  'ch04-rate-limiter':     Ch04RateLimiter,
  'ch05-consistent-hashing': Ch05ConsistentHashing,
  'ch06-key-value-store':  Ch06KeyValueStore,
  'ch07-unique-id':        Ch07UniqueId,
  'ch08-url-shortener':    Ch08UrlShortener,
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
