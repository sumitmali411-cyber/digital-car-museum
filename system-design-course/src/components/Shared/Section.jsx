import { motion } from 'motion/react'
import { C, FONTS } from '../../styles/colors'

export function Section({ title, icon, children, accent = C.cyan }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4 }}
      style={{ marginBottom: 48 }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        marginBottom: 20,
      }}>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
        <h2 style={{
          fontFamily: FONTS.sans,
          fontSize: 18,
          fontWeight: 700,
          color: C.white,
          margin: 0,
          letterSpacing: '-0.01em',
        }}>
          {title}
        </h2>
        <div style={{
          flex: 1, height: 1,
          background: `linear-gradient(90deg, ${accent}40 0%, transparent 100%)`,
          marginLeft: 8,
        }} />
      </div>
      {children}
    </motion.section>
  )
}

export function SubSection({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{
        fontFamily: FONTS.mono,
        fontSize: 11,
        fontWeight: 600,
        color: C.cyan,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        margin: '0 0 12px',
      }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

export function InfoBox({ type = 'info', children }) {
  const typeMap = {
    info:    { color: C.cyan,   bg: 'rgba(6,182,212,0.08)',   icon: 'ℹ️' },
    warn:    { color: C.amber,  bg: 'rgba(245,158,11,0.08)',  icon: '⚠️' },
    tip:     { color: C.green,  bg: 'rgba(16,185,129,0.08)',  icon: '💡' },
    danger:  { color: C.red,    bg: 'rgba(239,68,68,0.08)',   icon: '🚫' },
    key:     { color: C.purple, bg: 'rgba(167,139,250,0.08)', icon: '🔑' },
  }
  const t = typeMap[type] || typeMap.info
  return (
    <div style={{
      display: 'flex', gap: 10,
      background: t.bg,
      border: `1px solid ${t.color}30`,
      borderLeft: `3px solid ${t.color}`,
      borderRadius: 6,
      padding: '12px 14px',
      margin: '12px 0',
    }}>
      <span style={{ fontSize: 14, flexShrink: 0, lineHeight: 1.6 }}>{t.icon}</span>
      <div style={{
        fontFamily: FONTS.sans,
        fontSize: 13,
        color: C.textDim,
        lineHeight: 1.65,
      }}>
        {children}
      </div>
    </div>
  )
}

export function ConceptGrid({ children }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: 12,
      marginTop: 8,
    }}>
      {children}
    </div>
  )
}

export function ConceptCard({ title, icon, color = C.cyan, children }) {
  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderTop: `2px solid ${color}`,
      borderRadius: 8,
      padding: '14px 16px',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        marginBottom: 8,
      }}>
        {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
        <span style={{
          fontFamily: FONTS.sans,
          fontSize: 13,
          fontWeight: 700,
          color: C.white,
        }}>
          {title}
        </span>
      </div>
      <div style={{
        fontFamily: FONTS.sans,
        fontSize: 12,
        color: C.textDim,
        lineHeight: 1.65,
      }}>
        {children}
      </div>
    </div>
  )
}

export function StepList({ steps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {steps.map((step, i) => (
        <div key={i} style={{
          display: 'flex', gap: 0,
          position: 'relative',
        }}>
          {/* Line */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            marginRight: 16, flexShrink: 0,
          }}>
            <div style={{
              width: 28, height: 28,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${C.cyan}20, ${C.cyanDim}30)`,
              border: `1px solid ${C.cyan}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONTS.mono, fontSize: 11, fontWeight: 700,
              color: C.cyan, flexShrink: 0, zIndex: 1,
            }}>
              {String(i + 1).padStart(2, '0')}
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 1, flex: 1, minHeight: 20,
                background: `linear-gradient(180deg, ${C.cyan}30 0%, ${C.border} 100%)`,
                margin: '2px 0',
              }} />
            )}
          </div>
          <div style={{ paddingBottom: i < steps.length - 1 ? 20 : 0 }}>
            {step.title && (
              <div style={{
                fontFamily: FONTS.sans,
                fontSize: 13,
                fontWeight: 700,
                color: C.white,
                marginBottom: 4,
                paddingTop: 5,
              }}>
                {step.title}
              </div>
            )}
            <div style={{
              fontFamily: FONTS.sans,
              fontSize: 13,
              color: C.textDim,
              lineHeight: 1.65,
            }}>
              {step.body || step}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function TradeoffTable({ rows }) {
  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
            {['Approach', 'Pros', 'Cons', 'Use When'].map(h => (
              <th key={h} style={{
                fontFamily: FONTS.mono,
                fontSize: 10,
                fontWeight: 600,
                color: C.textMuted,
                letterSpacing: '0.12em',
                textAlign: 'left',
                padding: '10px 14px',
                borderBottom: `1px solid ${C.border}`,
                textTransform: 'uppercase',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{
              borderBottom: i < rows.length - 1 ? `1px solid ${C.border}` : 'none',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
            }}>
              {[row.approach, row.pros, row.cons, row.when].map((cell, j) => (
                <td key={j} style={{
                  fontFamily: FONTS.sans,
                  fontSize: 12,
                  color: j === 0 ? C.white : C.textDim,
                  fontWeight: j === 0 ? 600 : 400,
                  padding: '10px 14px',
                  verticalAlign: 'top',
                  lineHeight: 1.5,
                }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function NumberStat({ value, unit, label, color = C.cyan }) {
  return (
    <div style={{
      background: C.bgCard,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: '16px 20px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: FONTS.mono,
        fontSize: 28,
        fontWeight: 700,
        color,
        lineHeight: 1,
        marginBottom: 2,
      }}>
        {value}
        {unit && <span style={{ fontSize: 14, color: `${color}80` }}>{unit}</span>}
      </div>
      <div style={{
        fontFamily: FONTS.sans,
        fontSize: 11,
        color: C.textMuted,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginTop: 6,
      }}>
        {label}
      </div>
    </div>
  )
}

export function CodeBlock({ code, lang = 'text' }) {
  return (
    <div style={{
      background: '#0d1117',
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      overflow: 'hidden',
      margin: '12px 0',
    }}>
      {lang && (
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderBottom: `1px solid ${C.border}`,
          padding: '6px 14px',
          fontFamily: FONTS.mono,
          fontSize: 10,
          color: C.textMuted,
          letterSpacing: '0.1em',
        }}>
          {lang.toUpperCase()}
        </div>
      )}
      <pre style={{
        fontFamily: FONTS.mono,
        fontSize: 12,
        color: C.textDim,
        lineHeight: 1.65,
        padding: '14px 16px',
        margin: 0,
        overflowX: 'auto',
        whiteSpace: 'pre',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}
