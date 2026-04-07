import { Section, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

export default function Ch07Hotel() {
  return (
    <div>
      <Section title="Hotel Reservation System" icon="🏨">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          A hotel reservation system (like Booking.com or Expedia) must solve one hard problem above all else:
          two users must never book the same room on the same night. At 1.5M room-nights per day, that
          requires precise concurrency control at the database level.
        </p>
        <InfoBox type="info">
          Booking.com processes over 1.5 million room-nights per day. During peak holiday seasons,
          popular hotels sell out within seconds of becoming available — making double-booking prevention
          the most critical correctness requirement in the entire system.
        </InfoBox>
      </Section>

      <Section title="Core Concepts" icon="⚙️">
        <ConceptGrid>
          <ConceptCard title="Optimistic Locking" icon="🔒" color={C.cyan}>
            Each row carries a version number. On update, assert the version hasn't changed.
            If it has, another writer won — abort and retry. Zero lock contention under low conflict.
          </ConceptCard>
          <ConceptCard title="Idempotency" icon="🔁" color={C.green}>
            A reservation_id UUID is generated client-side before the first attempt.
            Retrying with the same ID is safe — the server detects the duplicate and returns
            the existing result rather than creating a second booking.
          </ConceptCard>
          <ConceptCard title="Inventory Cache" icon="⚡" color={C.amber}>
            Redis caches available-room counts per hotel per date. Availability searches
            hit Redis — not the database. Cache is refreshed on reservation commit
            and on a short TTL to self-heal after failures.
          </ConceptCard>
          <ConceptCard title="ACID Transaction" icon="🛡️" color={C.purple}>
            Check availability and decrement reserved_rooms in a single database transaction.
            Either both happen or neither does. No gap between the check and the update
            where another thread can sneak in.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Inventory Data Model" icon="🗃️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          The availability model avoids per-room rows. Instead, a single counter row per
          (hotel, room_type, date) tuple tracks totals and reservations. This makes
          availability checks a single indexed read and decrement — not a scan.
        </p>
        <CodeBlock lang="sql" code={`-- Inventory table: one row per hotel+room_type+date
CREATE TABLE room_inventory (
  hotel_id       BIGINT       NOT NULL,
  room_type_id   BIGINT       NOT NULL,
  stay_date      DATE         NOT NULL,
  total_rooms    INT          NOT NULL,
  reserved_rooms INT          NOT NULL DEFAULT 0,
  version        INT          NOT NULL DEFAULT 0,   -- optimistic lock
  PRIMARY KEY (hotel_id, room_type_id, stay_date)
);

-- Check availability (read replica for search)
SELECT total_rooms - reserved_rooms AS available
FROM room_inventory
WHERE hotel_id = ? AND room_type_id = ? AND stay_date = ?;

-- Optimistic lock update (CAS on version)
UPDATE room_inventory
SET    reserved_rooms = reserved_rooms + 1,
       version        = version + 1
WHERE  hotel_id       = ?
  AND  room_type_id   = ?
  AND  stay_date      = ?
  AND  version        = ?           -- must match what we read
  AND  reserved_rooms < total_rooms;
-- Rows affected = 0 → conflict → retry

-- ACID transaction path (pessimistic)
BEGIN;
SELECT reserved_rooms, total_rooms
FROM   room_inventory
WHERE  hotel_id = ? AND room_type_id = ? AND stay_date = ?
FOR UPDATE;                         -- row-level lock until COMMIT
-- application checks availability
UPDATE room_inventory SET reserved_rooms = reserved_rooms + 1 ...;
INSERT INTO reservations (reservation_id, user_id, ...) VALUES (...);
COMMIT;`} />
      </Section>

      <Section title="Reservation Flow" icon="📋">
        <StepList steps={[
          {
            title: 'Search — hit Redis cache',
            body: 'User searches by city, dates, guests. Query hits Redis sorted sets for fast availability lookup. Cache key: hotel:{id}:inventory:{date}. Stale reads are acceptable here — confirmation step is authoritative.',
          },
          {
            title: 'Select room — view details',
            body: 'User selects a room type. Frontend shows total_rooms - reserved_rooms > 0. Price, photos, and amenities fetched from CDN-cached detail pages.',
          },
          {
            title: 'Reserve — atomic DB write',
            body: 'Client sends reservation_id (UUID v4 generated client-side). Server opens transaction: SELECT FOR UPDATE → check availability → increment reserved_rooms → insert reservation row → COMMIT. Idempotency key stored in reservations table.',
          },
          {
            title: 'Payment — async, with saga',
            body: 'Reservation moves to PENDING_PAYMENT status. Payment service charges card via PSP. On success, reservation status → CONFIRMED. On failure, compensating transaction releases reserved_rooms.',
          },
          {
            title: 'Confirm — notify + cache refresh',
            body: 'Confirmation email/push notification dispatched via message queue. Redis inventory cache decremented. Booking ID returned to user.',
          },
        ]} />
      </Section>

      <Section title="Overbooking Strategy" icon="✈️">
        <InfoBox type="warn">
          Airlines and hotels intentionally overbook 10–15% because historical cancellation
          rates justify it. The system supports this by allowing total_rooms to be set
          above physical capacity. When overbooking triggers, a compensation flow
          (upgrade, voucher, relocation) is initiated automatically.
        </InfoBox>
        <InfoBox type="tip">
          Redis distributed locks (SETNX with TTL) provide an alternative to database
          transactions for the hot path. Lock key: lock:room:{hotel_id}:{room_type}:{date}.
          Expire after 5s to auto-release on crash. Faster than row-level DB locks
          but requires careful TTL tuning to avoid premature release.
        </InfoBox>
      </Section>

      <Section title="Concurrency Strategy Trade-offs" icon="⚖️">
        <TradeoffTable rows={[
          {
            approach: 'Optimistic Locking (version CAS)',
            pros: 'No lock held between read and write. High throughput under low contention. No deadlock risk.',
            cons: 'Requires retry logic on conflict. High contention → many retries → worse than pessimistic.',
            when: 'Low-contention rooms (budget hotels, off-peak dates).',
          },
          {
            approach: 'Pessimistic Locking (SELECT FOR UPDATE)',
            pros: 'Guaranteed no conflict. Simple application logic — no retries needed.',
            cons: 'Row locked for full transaction duration. Timeout risk. Can bottleneck under high concurrency.',
            when: 'High-demand rooms (popular hotel, opening sale). Critical correctness required.',
          },
          {
            approach: 'Redis Distributed Lock (SETNX)',
            pros: 'Sub-millisecond lock acquisition. Decoupled from DB. Works across microservices.',
            cons: 'Must handle lock expiry edge cases. Redis failure = lock unavailable. Extra operational complexity.',
            when: 'Microservice architecture where reservation and payment are separate services.',
          },
        ]} />
      </Section>

      <Section title="Event Sourcing for Audit" icon="📜">
        <InfoBox type="key">
          All reservation state changes are stored as an append-only event log:
          ROOM_RESERVED, PAYMENT_CAPTURED, RESERVATION_CANCELLED, ROOM_RELEASED.
          Current state is derived by replaying events. This gives a perfect audit trail
          and enables reliable compensating transactions.
        </InfoBox>
      </Section>
    </div>
  )
}
