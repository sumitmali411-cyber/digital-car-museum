import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import chapters from '../data/chapters'
import { C, FONTS } from '../styles/colors'

const vol1 = chapters.filter(c => c.vol === 1)
const vol2 = chapters.filter(c => c.vol === 2)

const STATUS_META = {
  available: { label: 'READY', color: C.green, bg: 'rgba(16,185,129,0.1)', dot: C.green },
}

function ChapterCard({ chapter, index }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const status = STATUS_META[chapter.status] || STATUS_META.coming
  const isClickable = true

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: 'easeOut' }}
      onClick={() => isClickable && navigate(`/chapter/${chapter.slug}`)}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        position: 'relative',
        background: hovered ? C.bgCardHover : C.bgCard,
        border: `1px solid ${hovered && isClickable ? C.cyan : C.border}`,
        borderRadius: 8,
        padding: '20px',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'background 0.2s, border-color 0.2s',
        overflow: 'hidden',
      }}
    >
      {/* Corner accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 3, height: hovered && isClickable ? '100%' : '40%',
        background: isClickable ? `linear-gradient(180deg, ${C.cyan} 0%, transparent 100%)` : 'transparent',
        transition: 'height 0.3s ease',
      }} />

      {/* Chapter number */}
      <div style={{
        fontFamily: FONTS.mono,
        fontSize: 10,
        color: C.textMuted,
        letterSpacing: '0.15em',
        marginBottom: 10,
      }}>
        VOL {chapter.vol} · CH {String(chapter.num).padStart(2, '0')}
      </div>

      {/* Emoji + Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{chapter.emoji}</span>
        <h3 style={{
          fontFamily: FONTS.sans,
          fontSize: 15,
          fontWeight: 700,
          color: hovered && isClickable ? C.white : C.text,
          lineHeight: 1.3,
          margin: 0,
          transition: 'color 0.2s',
        }}>
          {chapter.title}
        </h3>
      </div>

      {/* Description */}
      <p style={{
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: C.textDim,
        lineHeight: 1.6,
        margin: '0 0 12px',
      }}>
        {chapter.description}
      </p>

      {/* Concepts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {chapter.concepts.slice(0, 4).map(c => (
          <span key={c} style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            color: C.textMuted,
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${C.border}`,
            borderRadius: 3,
            padding: '2px 6px',
            letterSpacing: '0.05em',
          }}>
            {c}
          </span>
        ))}
        {chapter.concepts.length > 4 && (
          <span style={{
            fontFamily: FONTS.mono,
            fontSize: 9,
            color: C.textMuted,
            padding: '2px 4px',
          }}>+{chapter.concepts.length - 4}</span>
        )}
      </div>

      {/* Status badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: status.bg,
        border: `1px solid ${status.color}33`,
        borderRadius: 20,
        padding: '3px 8px',
      }}>
        <div style={{
          width: 5, height: 5,
          borderRadius: '50%',
          background: status.color,
          boxShadow: `0 0 6px ${status.color}`,
          animation: chapter.status === 'available' ? 'pulse 2s infinite' : 'none',
        }} />
        <span style={{
          fontFamily: FONTS.mono,
          fontSize: 9,
          fontWeight: 600,
          color: status.color,
          letterSpacing: '0.12em',
        }}>
          {status.label}
        </span>
      </div>

      {/* Hover glow */}
      {hovered && isClickable && (
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at top left, ${C.cyanGlow} 0%, transparent 60%)`,
          pointerEvents: 'none',
        }} />
      )}
    </motion.div>
  )
}

function VolumeSection({ vol, chs, label, subtitle }) {
  return (
    <section style={{ marginBottom: 56 }}>
      {/* Volume header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          fontFamily: FONTS.mono,
          fontSize: 10,
          fontWeight: 700,
          color: C.cyan,
          letterSpacing: '0.2em',
          background: 'rgba(6,182,212,0.08)',
          border: `1px solid rgba(6,182,212,0.25)`,
          borderRadius: 4,
          padding: '4px 10px',
          whiteSpace: 'nowrap',
        }}>
          {label}
        </div>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.border} 0%, transparent 100%)` }} />
        <span style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textMuted }}>{subtitle}</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 12,
      }}>
        {chs.map((ch, i) => <ChapterCard key={ch.id} chapter={ch} index={i} />)}
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div style={{
      position: 'relative',
      zIndex: 1,
      minHeight: '100vh',
      maxWidth: 1280,
      margin: '0 auto',
      padding: '0 24px 80px',
    }}>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ paddingTop: 72, paddingBottom: 56, textAlign: 'center' }}
      >
        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontFamily: FONTS.mono,
          fontSize: 10,
          color: C.cyan,
          letterSpacing: '0.25em',
          marginBottom: 20,
          textTransform: 'uppercase',
        }}>
          <span style={{ width: 24, height: 1, background: C.cyan, display: 'inline-block' }} />
          Alex Xu · System Design Interview · Volumes 1 & 2
          <span style={{ width: 24, height: 1, background: C.cyan, display: 'inline-block' }} />
        </div>

        <h1 style={{
          fontFamily: FONTS.sans,
          fontSize: 'clamp(32px, 5vw, 56px)',
          fontWeight: 800,
          color: C.white,
          lineHeight: 1.1,
          margin: '0 0 16px',
          letterSpacing: '-0.02em',
        }}>
          System Design
          <br />
          <span style={{
            background: `linear-gradient(135deg, ${C.cyan} 0%, #7c3aed 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Encyclopedia
          </span>
        </h1>

        <p style={{
          fontFamily: FONTS.sans,
          fontSize: 16,
          color: C.textDim,
          maxWidth: 560,
          margin: '0 auto 32px',
          lineHeight: 1.7,
        }}>
          All 28 topics from Alex Xu's bestselling books — with interactive diagrams,
          deep-dive explanations, and interview-ready frameworks.
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[
            { n: '28', label: 'Topics' },
            { n: '2',  label: 'Volumes' },
            { n: '100+', label: 'Concepts' },
            { n: '∞',  label: 'Interviews Aced' },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: FONTS.mono,
                fontSize: 28,
                fontWeight: 700,
                color: C.cyan,
                lineHeight: 1,
              }}>{n}</div>
              <div style={{
                fontFamily: FONTS.sans,
                fontSize: 11,
                color: C.textMuted,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: 4,
              }}>{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Chapters */}
      <VolumeSection
        vol={1}
        chs={vol1}
        label="VOLUME 01"
        subtitle="Foundations · 15 chapters"
      />
      <VolumeSection
        vol={2}
        chs={vol2}
        label="VOLUME 02"
        subtitle="Advanced Systems · 13 chapters"
      />

      {/* Footer */}
      <div style={{
        borderTop: `1px solid ${C.border}`,
        paddingTop: 24,
        textAlign: 'center',
        fontFamily: FONTS.mono,
        fontSize: 11,
        color: C.textMuted,
      }}>
        Based on&nbsp;
        <span style={{ color: C.textDim }}>System Design Interview Vol. 1 & 2</span>
        &nbsp;by Alex Xu
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
