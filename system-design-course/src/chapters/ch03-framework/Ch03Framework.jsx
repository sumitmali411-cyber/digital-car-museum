import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Section, InfoBox, ConceptGrid, ConceptCard, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

const STEPS = [
  {
    num: '01',
    title: 'Understand the Problem & Scope',
    time: '3–10 min',
    color: C.cyan,
    icon: '🔍',
    goal: 'Clarify requirements before designing. Never assume.',
    questions: [
      'What specific features are we building?',
      'How many users? What is the expected scale?',
      'Read-heavy or write-heavy?',
      'Mobile app, web app, or both?',
      'Does the company use any existing cloud services?',
      'What is the expected latency / consistency requirement?',
      'Do we need international support? Multiple data centers?',
    ],
    avoid: 'Jumping to solutions before understanding the problem. This is the most common mistake.',
    tip: 'Write down every assumption explicitly. Say it out loud: "I\'ll assume 10M DAU..."',
  },
  {
    num: '02',
    title: 'Propose High-Level Design',
    time: '10–15 min',
    color: C.green,
    icon: '🗺️',
    goal: 'Come up with a blueprint and get buy-in. Don\'t go deep yet.',
    questions: [
      'Sketch a box-and-arrow diagram showing major components',
      'Walk through the happy path (basic read + write flows)',
      'Identify the core APIs: what do clients call?',
      'What data do we store? Rough schema.',
      'Back-of-envelope: does this design handle the scale?',
    ],
    avoid: 'Over-engineering too early. Keep it simple. You\'ll deep dive in step 3.',
    tip: 'Think out loud. Say "Does this make sense before I go deeper?" — interviewers want to guide you.',
  },
  {
    num: '03',
    title: 'Design Deep Dive',
    time: '15–20 min',
    color: C.amber,
    icon: '🔬',
    goal: 'Dig into 2-3 components the interviewer cares most about.',
    questions: [
      'What are the bottlenecks? Where will this system break?',
      'How do we handle failure? What are the SLAs?',
      'Database choice: SQL vs NoSQL? Why?',
      'Sharding strategy? Consistent hashing?',
      'Caching: where? What strategy (write-through, cache-aside)?',
      'How do we scale the hot paths (highest QPS)?',
    ],
    avoid: 'Diving into irrelevant details. Ask "What should I focus on?" if unsure.',
    tip: 'Focus on the 2 most interesting/challenging parts. Don\'t try to cover everything equally.',
  },
  {
    num: '04',
    title: 'Wrap Up',
    time: '3–5 min',
    color: C.purple,
    icon: '✅',
    goal: 'Summarize, discuss trade-offs, and show you can think forward.',
    questions: [
      'What are the system bottlenecks and limitations?',
      'What would you improve with more time?',
      'Recap the key design decisions and their trade-offs',
      'How would you handle 10× more scale?',
      'What monitoring / alerting would you add?',
      'Are there any failure modes we haven\'t discussed?',
    ],
    avoid: 'Saying "That\'s it!" without showing you can think critically about your own design.',
    tip: 'Showing you know the weaknesses of your design demonstrates seniority.',
  },
]

function StepCard({ step, active, onClick }) {
  return (
    <div>
      <div
        onClick={onClick}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px',
          background: active ? `${step.color}10` : C.bgCard,
          border: `1px solid ${active ? step.color : C.border}`,
          borderRadius: 8,
          cursor: 'pointer',
          transition: 'all 0.15s',
          marginBottom: active ? 0 : 8,
          borderBottomLeftRadius: active ? 0 : 8,
          borderBottomRightRadius: active ? 0 : 8,
        }}
      >
        <span style={{ fontSize: 20 }}>{step.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 10, color: step.color,
            letterSpacing: '0.15em', marginBottom: 2,
          }}>
            STEP {step.num} · {step.time}
          </div>
          <div style={{ fontFamily: FONTS.sans, fontSize: 14, fontWeight: 700, color: C.white }}>
            {step.title}
          </div>
        </div>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 14, color: step.color,
          transform: active ? 'rotate(90deg)' : 'none',
          transition: 'transform 0.2s',
        }}>›</div>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', marginBottom: 8 }}
          >
            <div style={{
              background: `${step.color}06`,
              border: `1px solid ${step.color}30`,
              borderTop: 'none',
              borderRadius: '0 0 8px 8px',
              padding: '16px',
            }}>
              <div style={{
                fontFamily: FONTS.sans, fontSize: 13, color: C.textDim,
                marginBottom: 12, lineHeight: 1.65,
              }}>
                <strong style={{ color: C.textDim }}>Goal: </strong>{step.goal}
              </div>

              <div style={{ marginBottom: 12 }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: step.color, letterSpacing: '0.15em', marginBottom: 6 }}>
                  KEY QUESTIONS / ACTIONS
                </div>
                {step.questions.map((q, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 8, marginBottom: 4,
                  }}>
                    <span style={{ color: step.color, flexShrink: 0 }}>→</span>
                    <span style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textDim, lineHeight: 1.5 }}>{q}</span>
                  </div>
                ))}
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
              }}>
                <div style={{
                  background: 'rgba(239,68,68,0.06)', border: `1px solid rgba(239,68,68,0.2)`,
                  borderRadius: 6, padding: '10px 12px',
                }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: C.red, marginBottom: 4 }}>❌ AVOID</div>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>{step.avoid}</div>
                </div>
                <div style={{
                  background: 'rgba(16,185,129,0.06)', border: `1px solid rgba(16,185,129,0.2)`,
                  borderRadius: 6, padding: '10px 12px',
                }}>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: C.green, marginBottom: 4 }}>💡 PRO TIP</div>
                  <div style={{ fontFamily: FONTS.sans, fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>{step.tip}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Ch03Framework() {
  const [active, setActive] = useState(0)

  return (
    <div>
      <Section title="The 4-Step Framework" icon="🗺️">
        <InfoBox type="tip">
          System design interviews are time-boxed (usually 45-60 min). Without a framework,
          you'll either over-design one area or skip critical topics. This 4-step process
          is used by successful candidates at FAANG.
        </InfoBox>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
          {[
            { label: 'Understand', time: '3-10m', color: C.cyan },
            { label: 'High-Level', time: '10-15m', color: C.green },
            { label: 'Deep Dive', time: '15-20m', color: C.amber },
            { label: 'Wrap Up', time: '3-5m', color: C.purple },
          ].map(({ label, time, color }, i) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: C.bgCard, border: `1px solid ${C.border}`,
              borderRadius: 6, padding: '6px 12px',
              cursor: 'pointer',
            }} onClick={() => setActive(i)}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.text }}>{label}</span>
              <span style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted }}>{time}</span>
            </div>
          ))}
        </div>

        {STEPS.map((step, i) => (
          <StepCard
            key={step.num}
            step={step}
            active={active === i}
            onClick={() => setActive(active === i ? -1 : i)}
          />
        ))}
      </Section>

      <Section title="Dos and Don'ts" icon="⚖️">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: C.bgCard, border: `1px solid rgba(16,185,129,0.3)`, borderRadius: 8, padding: '16px' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.green, letterSpacing: '0.1em', marginBottom: 12 }}>✅ DO</div>
            {[
              'Ask clarifying questions before designing',
              'Think out loud — show your reasoning',
              'Propose multiple solutions, then pick one',
              'State assumptions explicitly',
              'Check in: "Does this make sense to you?"',
              'Acknowledge trade-offs in your design',
              'Suggest monitoring and error handling',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <span style={{ color: C.green }}>+</span>
                <span style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textDim }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ background: C.bgCard, border: `1px solid rgba(239,68,68,0.3)`, borderRadius: 8, padding: '16px' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.red, letterSpacing: '0.1em', marginBottom: 12 }}>❌ DON'T</div>
            {[
              'Jump into details without high-level design',
              'Use buzzwords without explaining them',
              'Ignore non-functional requirements',
              'Design in silence without explaining',
              'Over-engineer when simple works',
              'Be defensive when interviewer challenges you',
              'Skip the wrap-up summary',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                <span style={{ color: C.red }}>−</span>
                <span style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textDim }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Sample Interview Walkthrough" icon="💬">
        <InfoBox type="info">
          <strong>Question:</strong> "Design a URL shortener like bit.ly"
        </InfoBox>
        <CodeBlock lang="interview transcript" code={`STEP 1 — Understand (5 min)
Candidate: "Before I start, I have a few questions:
  - Is this for internal use or public? → Public, like bit.ly
  - How many URLs shortened per day? → 100M/day
  - How long should shortened URLs last? → 10 years
  - Custom aliases? → Yes, optional
  - Analytics? → Yes, click counts"

STEP 2 — High-Level Design (12 min)
Candidate: "Here's my initial design:
  Client → API Gateway → Shortener Service → DB (Cassandra)
  Redirect: client → CDN → redirect → original URL

  Core APIs:
  POST /shorten  { url: "..." } → { short: "bit.ly/abc123" }
  GET  /:code    → 301 redirect to original"

STEP 3 — Deep Dive (15 min)
Candidate: "Let me dig into ID generation and the redirect path.
  For the short code: use base62 (a-z, A-Z, 0-9) = 62^7 = 3.5T codes

  Hot path: GET /:code needs <10ms
  → Cache popular URLs in Redis with LRU eviction
  → Use 301 (permanent) vs 302 (temporary) redirect strategy

  At 100M/day = ~1160 writes/sec, ~10x reads = 11,600 reads/sec
  Cassandra handles this with ease horizontally..."

STEP 4 — Wrap Up (3 min)
Candidate: "Key trade-offs:
  - 301 caches in browser (less load) but no analytics
  - 302 hits our servers every time (analytics but more load)
  - Cassandra: highly available but eventual consistency

  Improvements: rate limiting, custom domain support, click analytics pipeline"`} />
      </Section>
    </div>
  )
}
