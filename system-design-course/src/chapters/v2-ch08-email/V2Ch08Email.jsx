import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Section, SubSection, InfoBox, ConceptGrid, ConceptCard,
  StepList, TradeoffTable, CodeBlock,
} from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── MTA Send Pipeline Diagram ────────────────────────────────────────────────
function MTADiagram() {
  return (
    <svg viewBox="0 0 700 220" style={{ width: '100%', maxHeight: 220 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr-em" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={C.cyan} />
        </marker>
      </defs>

      {/* Sender */}
      <rect x="10" y="85" width="80" height="50" rx="5" fill="#1a2236" stroke={C.border} strokeWidth="1"/>
      <text x="50" y="107" textAnchor="middle" fill={C.textDim} fontSize="9" fontFamily="JetBrains Mono">SENDER</text>
      <text x="50" y="123" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">alice@gmail</text>
      <line x1="90" y1="110" x2="130" y2="110" stroke={C.cyan} strokeWidth="1" markerEnd="url(#arr-em)"/>
      <text x="110" y="103" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="JetBrains Mono">SMTP</text>

      {/* Sending MTA */}
      <rect x="130" y="70" width="110" height="80" rx="6" fill="rgba(6,182,212,0.08)" stroke={C.cyan} strokeWidth="1.5"/>
      <text x="185" y="96" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">SENDING MTA</text>
      <text x="185" y="110" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">DKIM sign</text>
      <text x="185" y="122" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">SPF check</text>
      <text x="185" y="134" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">queue + retry</text>
      <line x1="240" y1="110" x2="280" y2="110" stroke={C.cyan} strokeWidth="1" markerEnd="url(#arr-em)"/>
      <text x="260" y="103" textAnchor="middle" fill={C.textMuted} fontSize="7" fontFamily="JetBrains Mono">DNS MX</text>

      {/* DNS */}
      <rect x="280" y="85" width="80" height="50" rx="5" fill="rgba(245,158,11,0.08)" stroke={`${C.amber}60`} strokeWidth="1"/>
      <text x="320" y="107" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">DNS</text>
      <text x="320" y="121" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">MX lookup</text>
      <line x1="360" y1="110" x2="400" y2="110" stroke={C.amber} strokeWidth="1" markerEnd="url(#arr-em)"/>

      {/* Receiving MTA */}
      <rect x="400" y="70" width="120" height="80" rx="6" fill="rgba(16,185,129,0.08)" stroke={C.green} strokeWidth="1.5"/>
      <text x="460" y="96" textAnchor="middle" fill={C.green} fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">RECEIVING MTA</text>
      <text x="460" y="110" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">SPF/DKIM/DMARC</text>
      <text x="460" y="122" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">spam filter</text>
      <text x="460" y="134" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">deliver to mailbox</text>
      <line x1="520" y1="110" x2="560" y2="110" stroke={C.green} strokeWidth="1" markerEnd="url(#arr-em)"/>

      {/* Recipient mailbox */}
      <rect x="560" y="85" width="80" height="50" rx="5" fill="#1a2236" stroke={C.border} strokeWidth="1"/>
      <text x="600" y="107" textAnchor="middle" fill={C.textDim} fontSize="9" fontFamily="JetBrains Mono">RECIPIENT</text>
      <text x="600" y="121" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">bob@corp</text>

      {/* IMAP access */}
      <rect x="560" y="155" width="80" height="40" rx="5" fill="rgba(167,139,250,0.08)" stroke={`#a78bfa50`} strokeWidth="1"/>
      <text x="600" y="172" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono">IMAP</text>
      <text x="600" y="185" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">client reads</text>
      <line x1="600" y1="135" x2="600" y2="155" stroke="#a78bfa40" strokeWidth="1" markerEnd="url(#arr-em)"/>

      <text x="350" y="205" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="Space Grotesk">
        SMTP sending pipeline: sign → DNS MX → receive → authenticate → deliver
      </text>
    </svg>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function V2Ch08Email() {
  return (
    <div>
      <Section title="SMTP / IMAP Protocols" icon="📧">
        <InfoBox type="info">
          Email uses separate protocols for sending (SMTP) and reading (IMAP/POP3). Understanding
          the protocol stack is fundamental to designing a Gmail-scale system — each component
          maps to a distinct infrastructure concern.
        </InfoBox>

        <ConceptGrid>
          <ConceptCard title="SMTP (Sending)" icon="📤" color={C.cyan}>
            Simple Mail Transfer Protocol. Push-based. Used for sending mail between MTAs
            and from email clients to their outbound mail server. Port 25 (server-to-server),
            587 (client submission). Stores messages in transit queues.
          </ConceptCard>
          <ConceptCard title="IMAP (Reading)" icon="📥" color={C.green}>
            Internet Message Access Protocol. Pull-based. Clients sync with server — messages
            stored on server, accessible from multiple devices. Supports folders, flags, search.
            Gmail uses IMAP over HTTPS for web access.
          </ConceptCard>
          <ConceptCard title="POP3 (Legacy)" icon="📬" color={C.amber}>
            Post Office Protocol v3. Downloads and deletes messages from server. Single-device
            oriented. Largely obsolete in modern systems. Still used by some ISPs.
          </ConceptCard>
          <ConceptCard title="Message Format (RFC 5322)" icon="📋" color={C.purple}>
            Email message structure: headers (From, To, Subject, Date, Message-ID) + body.
            MIME extensions allow multipart messages: text/plain, text/html, attachments as
            base64-encoded binary parts.
          </ConceptCard>
        </ConceptGrid>

        <SubSection title="MTA Send Pipeline">
          <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px', marginBottom: 12 }}>
            <MTADiagram />
          </div>
        </SubSection>
      </Section>

      <Section title="Blob and Metadata Storage" icon="🗃️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Gmail at scale stores ~15PB of email data. Two distinct storage systems handle
          different parts of the email: a metadata service for fast lookups, and blob storage
          for the actual message content and attachments.
        </p>

        <TradeoffTable rows={[
          {
            approach: 'Metadata Store (Bigtable/Cassandra)',
            pros: 'Fast lookups by user + folder + date. Supports billions of rows. Low-latency reads for folder views.',
            cons: 'Not suitable for large binary blobs. Limited query flexibility.',
            when: 'Store: message headers, sender, subject, date, read/unread flags, labels, thread_id, blob_pointer.',
          },
          {
            approach: 'Blob Store (Colossus/S3)',
            pros: 'Designed for large objects. Content-addressable (hash-based dedup). Cheap cold storage.',
            cons: 'High latency for small frequent reads. Not queryable.',
            when: 'Store: full message body, attachments, HTML content. Referenced by pointer from metadata.',
          },
          {
            approach: 'Search Index (Elasticsearch)',
            pros: 'Full-text search across message bodies and headers. Faceted filtering.',
            cons: 'Expensive to maintain. Storage overhead for inverted index.',
            when: 'Power the search bar. Index: sender, subject, body text (not attachments initially).',
          },
        ]} />

        <CodeBlock lang="metadata schema (cassandra)" code={`-- Email metadata table
CREATE TABLE email_metadata (
    user_id     UUID,
    folder_id   UUID,
    message_id  UUID,
    thread_id   UUID,
    sender      TEXT,
    subject     TEXT,
    sent_at     TIMESTAMP,
    read        BOOLEAN,
    labels      SET<TEXT>,
    blob_key    TEXT,          -- pointer to blob store
    size_bytes  INT,
    has_attachment BOOLEAN,
    PRIMARY KEY ((user_id, folder_id), sent_at, message_id)
) WITH CLUSTERING ORDER BY (sent_at DESC, message_id ASC);

-- Enables: list inbox sorted by date, paginated, for user X`} />
      </Section>

      <Section title="MTA Sending Pipeline" icon="📮">
        <StepList steps={[
          { title: 'Client submits message (port 587)', body: 'Email client authenticates with SMTP AUTH, submits message to the outbound MTA. Server validates recipient count, attachment size limits, and rate limits per sender.' },
          { title: 'DKIM signing', body: 'MTA cryptographically signs the email header and body with the domain\'s private RSA/Ed25519 key. Signature stored in DKIM-Signature header. Receiving server verifies signature against public key published in DNS TXT record.' },
          { title: 'DNS MX lookup', body: 'MTA queries DNS for the MX (Mail eXchange) records of the recipient domain. MX records list the receiving mail servers with priority values. MTA tries highest-priority server first, falls back on failure.' },
          { title: 'Queue and retry on failure', body: 'If delivery fails (receiving server busy, network error), message enters the retry queue with exponential backoff. Standard retry schedule: 5min, 30min, 2h, 6h, 24h. Bounced after 5 days (RFC 5321).' },
          { title: 'Delivery status notification', body: 'On permanent failure (invalid recipient, domain doesn\'t exist), MTA generates a Delivery Status Notification (DSN bounce message) and returns it to the envelope sender address.' },
        ]} />

        <InfoBox type="warn">
          <strong>IP reputation is critical for deliverability.</strong> Send from IPs with clean
          history, warm up new IPs gradually (start at 1K/day, double weekly), monitor bounce rates
          and spam complaints (keep spam rate below 0.08% per Google Postmaster Tools).
        </InfoBox>
      </Section>

      <Section title="SPF / DKIM / DMARC" icon="🔐">
        <InfoBox type="key">
          Email authentication trio: SPF (who can send from your domain), DKIM (is message unmodified),
          DMARC (what to do when either fails). Together they prevent spoofing and phishing.
          Gmail rejects unauthenticated email from large senders since February 2024.
        </InfoBox>

        <SubSection title="DNS Records">
          <CodeBlock lang="dns txt records" code={`# SPF: authorize which IPs may send as your domain
example.com. TXT "v=spf1 ip4:203.0.113.0/24 include:sendgrid.net ~all"
#  ~all = softfail unknown sources (log but accept)
#  -all = hardfail (reject)

# DKIM: publish public key for signature verification
mail._domainkey.example.com. TXT "v=DKIM1; k=rsa; p=MIGfMA0GCS..."
#  Sending MTA signs with private key stored securely
#  Receiving MTA verifies against this public key in DNS

# DMARC: policy for auth failures + aggregate reporting
_dmarc.example.com. TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com; pct=100"
#  p=none (monitor only) → p=quarantine → p=reject
#  rua: where to send aggregate reports
#  pct: percent of messages subject to policy`} />
        </SubSection>
      </Section>

      <Section title="Elasticsearch Full-Text Search" icon="🔍">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Gmail's search bar must find emails across years of messages in milliseconds.
          This requires an inverted index maintained in parallel with the primary data store.
        </p>

        <StepList steps={[
          { title: 'Indexing pipeline', body: 'When a message arrives, a background worker tokenizes the subject, sender, and body text, removes stop words, applies stemming (run/running/ran → run), and indexes into Elasticsearch.' },
          { title: 'Per-user index sharding', body: 'Each user\'s emails are stored in a separate Elasticsearch shard or index. Prevents cross-user data leakage and allows per-user scaling. User with 10GB of email gets dedicated resources.' },
          { title: 'Query execution', body: 'Search query analyzed and parsed: "from:alice subject:invoice after:2024/01" → bool query with term filters + date range + full-text match. Elasticsearch returns document IDs, metadata service fetches details.' },
          { title: 'Indexing lag management', body: 'New messages appear in inbox immediately (metadata store) but may not be searchable for 1-5 seconds while indexing pipeline processes them. Show a "results may be incomplete" hint during lag window.' },
        ]} />
      </Section>

      <Section title="Spam Filtering" icon="🚫">
        <ConceptGrid>
          <ConceptCard title="Content Analysis" icon="📝" color={C.amber}>
            SpamAssassin-style rule scoring: suspicious keywords, all-caps subjects,
            excessive links, image-only content, known spam phrases. Each rule adds to
            a total score; threshold determines spam classification.
          </ConceptCard>
          <ConceptCard title="IP/Domain Reputation" icon="🌐" color={C.red}>
            Check sender IP against real-time blacklists (Spamhaus, SORBS). New IPs with no
            history are suspect. Domains registered under 30 days score higher suspicion.
          </ConceptCard>
          <ConceptCard title="Bayesian Filtering" icon="🧮" color={C.cyan}>
            Per-user probabilistic model trained on that user's spam/ham decisions. "Mark as
            spam" feedback loops back into the model. Highly personalized — what's spam for
            one user isn't for another.
          </ConceptCard>
          <ConceptCard title="Neural/ML Models" icon="🤖" color={C.purple}>
            Deep learning models analyze message holistically: sender patterns, recipient
            behavior, URL reputation, attachment analysis. Gmail uses these for 99.9%
            spam detection rate.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Thread Grouping Algorithm" icon="🧵">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Gmail groups related emails into conversation threads. The algorithm must work even
          when email clients don't properly set In-Reply-To headers.
        </p>
        <CodeBlock lang="thread grouping logic" code={`def assign_thread(message):
    # Strategy 1: Follow References / In-Reply-To headers (RFC 5322)
    if message.in_reply_to:
        parent = lookup_message(message.in_reply_to)
        if parent:
            return parent.thread_id

    # Strategy 2: Subject normalization matching
    normalized_subject = normalize(message.subject)
    # normalize: lowercase, strip Re:/Fwd:/AW:/RE:, trim whitespace

    # Strategy 3: Find recent thread with same normalized subject
    # between same set of participants (within 7-day window)
    candidates = find_threads(
        subject=normalized_subject,
        participants=message.participants,
        within_days=7
    )
    if candidates:
        return most_recent_thread(candidates).thread_id

    # No match → create new thread
    return generate_thread_id()

# Thread display: sort messages by sent_at ASC
# Show latest N messages, collapse middle ones`} />

        <InfoBox type="tip">
          Thread grouping is intentionally fuzzy. Some false merges (unrelated emails with
          same subject) are acceptable. The alternative — missed groupings — is more
          disruptive to the reading experience.
        </InfoBox>
      </Section>

      <Section title="Interview Checklist" icon="✅">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'Separate metadata store (Cassandra) from blob store (S3) — different access patterns',
            'SMTP for send/relay, IMAP for client read access — distinct protocol layers',
            'MTA queue with exponential backoff retry, 5-day bounce window',
            'DKIM sign all outbound; validate SPF/DKIM/DMARC on inbound',
            'Elasticsearch per-user index for full-text search; async indexing pipeline',
            'Spam: IP reputation + content scoring + Bayesian per-user model + ML',
            'Thread grouping: In-Reply-To → subject normalization → participant matching',
            'Content-address blobs (hash) for attachment deduplication',
            'Rate limit outbound sends per user to protect IP reputation',
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
