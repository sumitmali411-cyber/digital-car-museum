import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Section, SubSection, InfoBox, ConceptGrid, ConceptCard,
  StepList, TradeoffTable, CodeBlock,
} from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── PSP Flow Diagram ─────────────────────────────────────────────────────────
function PSPDiagram() {
  return (
    <svg viewBox="0 0 700 260" style={{ width: '100%', maxHeight: 260 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr-pay" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={C.cyan} />
        </marker>
        <marker id="arr-pay-grn" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={C.green} />
        </marker>
      </defs>

      {/* Customer */}
      <rect x="10" y="105" width="80" height="50" rx="5" fill="#1a2236" stroke={C.border} strokeWidth="1"/>
      <text x="50" y="127" textAnchor="middle" fill={C.textDim} fontSize="9" fontFamily="JetBrains Mono">CUSTOMER</text>
      <text x="50" y="141" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">checkout</text>
      <line x1="90" y1="130" x2="130" y2="130" stroke={C.cyan} strokeWidth="1.5" markerEnd="url(#arr-pay)"/>

      {/* Payment service */}
      <rect x="130" y="90" width="110" height="80" rx="6" fill="rgba(6,182,212,0.08)" stroke={C.cyan} strokeWidth="1.5"/>
      <text x="185" y="116" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">PAYMENT</text>
      <text x="185" y="130" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">SERVICE</text>
      <text x="185" y="146" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">idempotency key</text>
      <text x="185" y="158" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">ledger write</text>
      <line x1="240" y1="130" x2="280" y2="130" stroke={C.cyan} strokeWidth="1.5" markerEnd="url(#arr-pay)"/>

      {/* PSP */}
      <rect x="280" y="90" width="100" height="80" rx="6" fill="rgba(245,158,11,0.08)" stroke={C.amber} strokeWidth="1.5"/>
      <text x="330" y="116" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">PSP</text>
      <text x="330" y="130" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">Stripe / Braintree</text>
      <text x="330" y="144" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">tokenization</text>
      <text x="330" y="158" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">auth request</text>
      <line x1="380" y1="130" x2="420" y2="130" stroke={C.amber} strokeWidth="1.5" markerEnd="url(#arr-pay)"/>

      {/* Acquiring bank */}
      <rect x="420" y="90" width="100" height="80" rx="6" fill="rgba(16,185,129,0.08)" stroke={C.green} strokeWidth="1.5"/>
      <text x="470" y="116" textAnchor="middle" fill={C.green} fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">ACQUIRING</text>
      <text x="470" y="130" textAnchor="middle" fill={C.green} fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">BANK</text>
      <text x="470" y="146" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">merchant's bank</text>
      <line x1="520" y1="130" x2="560" y2="130" stroke={C.green} strokeWidth="1.5" markerEnd="url(#arr-pay)"/>

      {/* Card network */}
      <rect x="560" y="90" width="120" height="80" rx="6" fill="rgba(167,139,250,0.08)" stroke="#a78bfa" strokeWidth="1.5"/>
      <text x="620" y="113" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">CARD NETWORK</text>
      <text x="620" y="127" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono">Visa / Mastercard</text>
      <text x="620" y="141" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">routes to issuer</text>
      <text x="620" y="155" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">auth + settlement</text>

      {/* Webhook back */}
      <path d="M330,170 L330,205 L185,205 L185,170" stroke={C.green} strokeWidth="1" strokeDasharray="4,2" fill="none" markerEnd="url(#arr-pay-grn)"/>
      <text x="258" y="220" textAnchor="middle" fill={C.green} fontSize="8" fontFamily="JetBrains Mono">webhook: payment_succeeded</text>

      <text x="350" y="248" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="Space Grotesk">
        PSP integration: payment service → PSP → acquirer → card network → issuer → webhook callback
      </text>
    </svg>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function V2Ch11Payment() {
  return (
    <div>
      <Section title="PSP Integration Flow" icon="💳">
        <InfoBox type="info">
          Payment Service Providers (Stripe, Braintree, Adyen) abstract the complex card
          network integration. Your payment service talks to the PSP via API; the PSP
          handles card tokenization, acquirer routing, fraud scoring, and compliance.
        </InfoBox>

        <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px', marginBottom: 16 }}>
          <PSPDiagram />
        </div>

        <StepList steps={[
          { title: 'Customer submits payment (client-side tokenization)', body: 'PSP\'s JavaScript SDK (Stripe.js) collects card data directly in the browser and exchanges it for a payment_method token. Raw card numbers NEVER touch your servers — critical for PCI DSS scope reduction.' },
          { title: 'Payment service creates payment intent', body: 'Your server calls PSP API: CreatePaymentIntent(amount, currency, payment_method, idempotency_key). PSP returns a client_secret for 3DS authentication if needed.' },
          { title: 'PSP authorizes with card network', body: 'PSP → Acquiring bank → Visa/Mastercard → Issuing bank. Authorization checks: sufficient funds, fraud score, 3DS if needed. Response: authorized (funds reserved) or declined.' },
          { title: 'Capture and settlement', body: 'Authorization holds funds. Capture (immediate or delayed) moves money. Settlement: actual bank transfer typically T+2 days. PSP notifies your system via webhook on each status change.' },
        ]} />
      </Section>

      <Section title="Idempotency Keys" icon="🔑">
        <InfoBox type="key">
          <strong>Idempotency is the #1 requirement in payment systems.</strong> Network retries,
          client timeouts, and distributed failures mean any payment API call may be executed
          more than once. Without idempotency, customers get charged twice — a catastrophic failure.
        </InfoBox>

        <SubSection title="Implementation Pattern">
          <CodeBlock lang="payment idempotency (pseudocode)" code={`# Client generates idempotency key per payment attempt
idempotency_key = uuid4()  # e.g., "550e8400-e29b-41d4-a716-446655440000"

# Server-side idempotency handling
def create_payment(request, idempotency_key):
    # Check if we've seen this key before
    existing = db.payments.find_one({
        'idempotency_key': idempotency_key,
        'user_id': request.user_id
    })

    if existing:
        # Return cached response — do NOT charge again
        return existing.response

    # Acquire distributed lock on idempotency_key
    with redis.lock(f'payment:{idempotency_key}', timeout=30):
        # Double-check after acquiring lock (race condition protection)
        existing = db.payments.find_one({'idempotency_key': idempotency_key})
        if existing:
            return existing.response

        # Execute payment
        result = psp.charge(request.amount, request.payment_method)

        # Persist with idempotency key
        payment = db.payments.insert({
            'idempotency_key': idempotency_key,
            'amount': request.amount,
            'status': result.status,
            'psp_transaction_id': result.id,
            'response': result.to_dict(),
            'created_at': now()
        })
        return result`} />
        </SubSection>

        <InfoBox type="tip">
          Store idempotency keys with a TTL (24 hours is standard). After expiry, the same
          key can be reused for a fresh payment — this prevents unbounded key storage.
          Include the user_id in key lookup to prevent cross-user key collisions.
        </InfoBox>
      </Section>

      <Section title="Double-Entry Ledger" icon="📒">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          All financial systems use double-entry bookkeeping: every transaction has equal
          debits and credits. If the sum of all ledger entries doesn't equal zero, there
          is a bug — this invariant makes inconsistencies self-detecting.
        </p>

        <CodeBlock lang="double-entry ledger schema" code={`-- Every money movement creates TWO ledger entries
CREATE TABLE ledger_entries (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id  UUID NOT NULL,     -- groups the debit+credit pair
    account_id      UUID NOT NULL,     -- which account
    amount          BIGINT NOT NULL,   -- in cents, positive or negative
    currency        CHAR(3) NOT NULL,
    entry_type      TEXT CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- Payment of $100 from customer to merchant:
INSERT INTO ledger_entries VALUES
    ('txn-001', 'customer_account_123', -10000, 'USD', 'DEBIT',  'Payment for order #456'),
    ('txn-001', 'merchant_account_789',  10000, 'USD', 'CREDIT', 'Payment for order #456');

-- Invariant: SUM of all amounts = 0
SELECT SUM(amount) FROM ledger_entries;  -- MUST always return 0

-- Account balance (always computed from ledger, never stored)
SELECT SUM(amount) FROM ledger_entries
WHERE account_id = 'merchant_account_789';`} />

        <InfoBox type="warn">
          <strong>Never store a balance field.</strong> Always compute balance as SUM of ledger entries.
          A separate balance column can drift from ledger truth via bugs. The ledger is immutable —
          correct errors with compensating entries, never by updating existing rows.
        </InfoBox>
      </Section>

      <Section title="Exactly-Once Guarantees" icon="🎯">
        <StepList steps={[
          { title: 'Distributed transaction challenge', body: 'Payment involves updating your database AND calling the PSP API. If DB write succeeds but PSP call fails (or vice versa), the system is inconsistent. Can\'t use ACID transactions across service boundaries.' },
          { title: 'Outbox Pattern (Saga)', body: 'Write payment record + outbox event to DB in a single local transaction. A separate publisher reads the outbox table and calls PSP. On PSP success, mark outbox processed. On failure, retry. DB and PSP eventually consistent.' },
          { title: 'PSP idempotency + polling', body: 'If PSP webhook fails to arrive (network issue), poll PSP for payment status using the idempotency key. PSP guarantees idempotent responses for the same key — safe to retry GET payment status.' },
          { title: 'Status state machine', body: 'Payment status: INITIATED → PENDING → AUTHORIZED → CAPTURED → SETTLED. Each transition persisted atomically. Reconciliation job daily checks for payments stuck in intermediate states > 24h.' },
        ]} />

        <CodeBlock lang="outbox pattern" code={`# In a single database transaction:
BEGIN;

INSERT INTO payments (id, amount, status, idempotency_key)
VALUES ('pay-001', 10000, 'PENDING', 'idem-key-xyz');

INSERT INTO outbox (id, event_type, payload, status)
VALUES (
    'evt-001',
    'payment.process',
    '{"payment_id": "pay-001", "amount": 10000}',
    'PENDING'
);

COMMIT;

# Outbox publisher (separate process, polls outbox table):
for event in outbox.find(status='PENDING'):
    result = psp.charge(event.payload)
    if result.success:
        with db.transaction():
            payments.update(event.payment_id, status='AUTHORIZED')
            outbox.update(event.id, status='PROCESSED')
    else:
        outbox.update(event.id, retry_count=+1, next_retry=exponential_backoff())`} />
      </Section>

      <Section title="Retry and Exponential Backoff" icon="🔄">
        <ConceptGrid>
          <ConceptCard title="Exponential Backoff" icon="⏱️" color={C.cyan}>
            Retry delays: 1s, 2s, 4s, 8s, 16s, ... up to max (30min). Prevents thundering
            herd when PSP recovers from outage. All retriers back off simultaneously if
            purely deterministic — add jitter.
          </ConceptCard>
          <ConceptCard title="Jitter" icon="🎲" color={C.green}>
            Add random delay to each retry: actual_delay = base_delay × random(0.5, 1.5).
            Prevents synchronized retry storms. AWS and Stripe both recommend jitter in
            their SDKs for this reason.
          </ConceptCard>
          <ConceptCard title="Retry Budget" icon="💰" color={C.amber}>
            Maximum retry attempts (e.g., 5). After budget exhausted, payment moves to
            FAILED state and dead letter queue for manual investigation. Never retry
            indefinitely — it masks bugs.
          </ConceptCard>
          <ConceptCard title="Non-Retryable Errors" icon="🚫" color={C.red}>
            HTTP 4xx (invalid card, insufficient funds) — never retry, these are permanent
            failures. HTTP 5xx and timeouts — retry with backoff. Distinguish transient
            vs permanent errors in retry logic.
          </ConceptCard>
        </ConceptGrid>

        <CodeBlock lang="retry with exponential backoff + jitter" code={`def retry_with_backoff(fn, max_retries=5, base_delay=1.0):
    for attempt in range(max_retries + 1):
        try:
            return fn()
        except TransientError as e:
            if attempt == max_retries:
                raise MaxRetriesExceeded(f"Failed after {max_retries} retries") from e
            # Exponential backoff with full jitter
            delay = base_delay * (2 ** attempt)
            jitter = random.uniform(0, delay)  # full jitter
            time.sleep(jitter)
        except PermanentError:
            raise  # Do NOT retry: invalid card, card declined, etc.`} />
      </Section>

      <Section title="Webhook Delivery Reliability" icon="🔔">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          PSP notifies your system of payment status changes via webhooks. Your webhook
          endpoint must be idempotent and reliably process events even if the PSP retries.
        </p>

        <StepList steps={[
          { title: 'Webhook arrives at endpoint', body: 'PSP sends POST with event payload and HMAC signature. Verify signature immediately (prevents replay attacks and spoofing). Return 200 OK within 5 seconds — or PSP marks delivery failed.' },
          { title: 'Async processing via queue', body: 'Webhook handler writes event to internal queue (Redis/SQS) and returns 200 OK immediately. Async worker processes event. Decouples webhook receipt from business logic — if processing fails, webhook already acknowledged.' },
          { title: 'Idempotent event handling', body: 'Use webhook event_id as idempotency key. Check if event_id already processed before applying state change. PSP retries webhooks for hours/days — your handler will see duplicates.' },
          { title: 'Reconciliation fallback', body: 'If webhook delivery fails for >1 hour (PSP outage, your endpoint down), fall back to polling: GET /payments/{id} every 5 minutes. Reconcile expected vs actual state; alert on mismatches.' },
        ]} />
      </Section>

      <Section title="PCI DSS Overview" icon="🔐">
        <InfoBox type="danger">
          Payment Card Industry Data Security Standard (PCI DSS) compliance is legally required
          if you store, process, or transmit cardholder data. Violations can result in
          $5K–$100K/month fines and loss of ability to process card payments.
        </InfoBox>

        <ConceptGrid>
          <ConceptCard title="Reduce Scope First" icon="🎯" color={C.cyan}>
            Never let raw card numbers touch your servers. Use PSP client-side SDK (Stripe.js)
            to tokenize cards in-browser. Your servers only see payment_method tokens. This
            limits PCI scope to SAQ-A level — minimal requirements.
          </ConceptCard>
          <ConceptCard title="Tokenization" icon="🔄" color={C.green}>
            PSP stores real card and returns a token (e.g., pm_xxxxx). Token usable only
            for charges through that PSP. Card stored in PSP's PCI-certified vault.
            Your DB stores the token — not the card number.
          </ConceptCard>
          <ConceptCard title="Encryption in Transit" icon="🔒" color={C.amber}>
            TLS 1.2+ for all cardholder data transmission. Certificate pinning for mobile.
            No card data in logs, URLs, or query parameters. Strict transport security headers.
          </ConceptCard>
          <ConceptCard title="Audit Logging" icon="📋" color={C.purple}>
            Log all payment-related actions with user ID, timestamp, IP, and action.
            Retain logs for minimum 12 months (PCI requirement). Access logs for
            anyone who touches payment data. Regular penetration testing.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Interview Checklist" icon="✅">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'PSP integration: client-side tokenization → server-side payment intent → capture',
            'Idempotency key on every payment API call — check before charging, cache response',
            'Double-entry ledger: every debit has matching credit, SUM always = 0',
            'Outbox pattern for exactly-once: write DB + outbox in one transaction',
            'Saga for distributed transactions: no 2PC across service boundaries',
            'Retry with exponential backoff + jitter; never retry 4xx permanent failures',
            'Webhook: verify HMAC, return 200 fast, process async, handle duplicates',
            'Reconciliation job: daily check for payments stuck in intermediate states',
            'PCI DSS: use PSP tokenization to minimize scope to SAQ-A',
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
