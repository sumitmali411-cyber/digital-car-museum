import { C, FONTS } from '../styles/colors'

export default function ChapterPlaceholder({ chapter }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '80px 0', gap: 16,
    }}>
      <div style={{ fontSize: 48 }}>🔧</div>
      <h2 style={{
        fontFamily: FONTS.sans, fontSize: 20, fontWeight: 700,
        color: C.textDim, margin: 0,
      }}>
        Content Coming Soon
      </h2>
      <p style={{
        fontFamily: FONTS.sans, fontSize: 13, color: C.textMuted,
        textAlign: 'center', maxWidth: 400, lineHeight: 1.6,
      }}>
        This chapter is being prepared. All 28 topics will be available soon
        with interactive diagrams and deep-dive explanations.
      </p>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center',
        marginTop: 8,
      }}>
        {chapter.concepts.map(c => (
          <span key={c} style={{
            fontFamily: FONTS.mono, fontSize: 10,
            color: C.textMuted,
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${C.border}`,
            borderRadius: 4, padding: '4px 10px',
          }}>{c}</span>
        ))}
      </div>
    </div>
  )
}
