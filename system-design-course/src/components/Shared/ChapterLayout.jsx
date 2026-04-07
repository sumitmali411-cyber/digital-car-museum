import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { C, FONTS } from '../../styles/colors'
import { ArrowLeft, BookOpen } from 'lucide-react'

export default function ChapterLayout({ chapter, children }) {
  const navigate = useNavigate()

  return (
    <div style={{
      position: 'relative',
      zIndex: 1,
      minHeight: '100vh',
      maxWidth: 1100,
      margin: '0 auto',
      padding: '0 24px 100px',
    }}>
      {/* Top nav */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 0',
        borderBottom: `1px solid ${C.border}`,
        marginBottom: 40,
        position: 'sticky',
        top: 0,
        background: 'rgba(10,14,26,0.92)',
        backdropFilter: 'blur(12px)',
        zIndex: 50,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'none', border: 'none',
            fontFamily: FONTS.mono, fontSize: 12,
            color: C.textDim, cursor: 'pointer',
            padding: '6px 0',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = C.cyan}
          onMouseLeave={e => e.currentTarget.style.color = C.textDim}
        >
          <ArrowLeft size={14} />
          All Chapters
        </button>

        <div style={{
          fontFamily: FONTS.mono,
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: '0.15em',
        }}>
          VOL {chapter.vol} · CH {String(chapter.num).padStart(2, '0')}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <BookOpen size={12} color={C.cyan} />
          <span style={{
            fontFamily: FONTS.mono,
            fontSize: 10,
            color: C.cyan,
            letterSpacing: '0.1em',
          }}>
            SYSTEM DESIGN
          </span>
        </div>
      </div>

      {/* Chapter hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ marginBottom: 48 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <span style={{ fontSize: 40 }}>{chapter.emoji}</span>
          <div>
            <div style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              color: C.cyan,
              letterSpacing: '0.2em',
              marginBottom: 4,
            }}>
              CHAPTER {String(chapter.num).padStart(2, '0')} — VOLUME {chapter.vol}
            </div>
            <h1 style={{
              fontFamily: FONTS.sans,
              fontSize: 'clamp(22px, 4vw, 36px)',
              fontWeight: 800,
              color: C.white,
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}>
              {chapter.title}
            </h1>
          </div>
        </div>

        <p style={{
          fontFamily: FONTS.sans,
          fontSize: 15,
          color: C.textDim,
          lineHeight: 1.7,
          maxWidth: 680,
          margin: '0 0 20px',
        }}>
          {chapter.description}
        </p>

        {/* Concept tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {chapter.concepts.map(c => (
            <span key={c} style={{
              fontFamily: FONTS.mono,
              fontSize: 10,
              color: C.cyan,
              background: 'rgba(6,182,212,0.08)',
              border: `1px solid rgba(6,182,212,0.2)`,
              borderRadius: 4,
              padding: '3px 8px',
              letterSpacing: '0.05em',
            }}>
              {c}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
