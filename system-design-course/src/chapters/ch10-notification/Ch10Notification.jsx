import { Section, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

export default function Ch10Notification() {
  return (
    <div>
      <Section title="Notification Channel Overview" icon="📣">
        <ConceptGrid>
          <ConceptCard title="iOS Push (APNs)" icon="🍎" color={C.cyan}>
            Apple Push Notification service. Requires a device token registered per app install.
            Max payload <strong style={{ color: C.cyan }}>4 KB</strong>. Uses HTTP/2 + TLS to APNs gateway.
            Tokens expire when app is uninstalled.
          </ConceptCard>
          <ConceptCard title="Android Push (FCM)" icon="🤖" color={C.green}>
            Firebase Cloud Messaging. Registration token per device+app.
            Max payload <strong style={{ color: C.green }}>4 KB</strong> (data) or 4KB (notification).
            Supports topic subscriptions for broadcast.
          </ConceptCard>
          <ConceptCard title="SMS" icon="💬" color={C.amber}>
            Via gateway providers (Twilio, Nexmo). One SMS segment =
            <strong style={{ color: C.amber }}> 160 chars</strong> (GSM-7) or 70 chars (Unicode).
            High delivery rate but highest cost per message. Requires E.164 phone numbers.
          </ConceptCard>
          <ConceptCard title="Email" icon="📧" color={C.purple}>
            Via SendGrid, Mailgun, SES. Rich HTML templates. High latency (seconds to minutes).
            Must handle bounces, unsubscribes, and DMARC/SPF compliance.
            Best for marketing and transactional receipts.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="High-Level Architecture" icon="🏗️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Different services trigger notifications through a single <span style={{ color: C.cyan }}>Notification Service</span>.
          It validates, deduplicates, rate-limits, checks user preferences, then fans out to per-channel message queues.
          Independent workers drain each queue and call the external provider.
        </p>
        <CodeBlock lang="architecture" code={`Services (billing, social, alerts, marketing)
         │
         ▼
┌─────────────────────────────────┐
│      Notification Service       │
│  • validate & enrich payload    │
│  • check user opt-out prefs     │
│  • dedup by notification_id     │
│  • rate-limit per user          │
└──────┬──────┬──────┬────────────┘
       │      │      │      │
       ▼      ▼      ▼      ▼
    iOS Q  Android  SMS Q  Email Q   (Kafka / SQS topics)
       │      │      │      │
    APNs   FCM    Twilio  SendGrid   (external providers)
    Worker Worker Worker  Worker
       │      │      │      │
       └──────┴──────┴──────┘
              │
          Notification
          Log DB (for
          retry & audit)`} />
      </Section>

      <Section title="Notification Flow" icon="🔄">
        <StepList steps={[
          {
            title: 'Service triggers notification',
            body: 'A backend service (e.g. payment service) calls POST /notifications with a notification_id, user_id, channel hints, template_id, and template variables.',
          },
          {
            title: 'Notification Service validates & enriches',
            body: 'Looks up user device tokens, email address, and phone number from the User Info Store. Renders the message template with the provided variables.',
          },
          {
            title: 'Preference & opt-out check',
            body: 'Queries User Preference DB. If the user has opted out of this notification category or channel, the message is silently dropped and logged.',
          },
          {
            title: 'Deduplication check',
            body: 'Looks up notification_id in the Dedup Store (Redis with 24h TTL). If already seen, discard. This handles at-least-once producer retries.',
          },
          {
            title: 'Rate limiting',
            body: 'Checks per-user token bucket (e.g. max 10 push notifications/hour). If limit exceeded, message is either queued for later or dropped depending on priority.',
          },
          {
            title: 'Enqueue to channel-specific queue',
            body: 'Serialised notification payload is published to the correct Kafka topic (ios-push, android-push, sms, email). The Notification Service returns 202 Accepted immediately.',
          },
          {
            title: 'Channel workers deliver with retry',
            body: 'Workers call the external provider (APNs/FCM/Twilio/SendGrid). On failure, apply exponential backoff: retry after 1s, 2s, 4s, 8s … up to 5 attempts. Log final outcome.',
          },
        ]} />
      </Section>

      <Section title="Device Token Management" icon="📱">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Push notifications require a valid device token per app install. Tokens must be refreshed and cleaned up proactively.
        </p>
        <CodeBlock lang="pseudocode" code={`# On app launch / token refresh (mobile client → API)
POST /devices/register
  { user_id, device_token, platform: "ios"|"android", app_version }

# Stored in device_tokens table:
# device_id | user_id | token            | platform | updated_at | valid
# After APNs returns error 410 (BadDeviceToken):
UPDATE device_tokens SET valid = false WHERE token = :token

# Notification worker — skip invalid tokens
SELECT token FROM device_tokens
  WHERE user_id = :uid AND platform = 'ios' AND valid = true
  ORDER BY updated_at DESC LIMIT 5  -- support multiple devices`} />
        <InfoBox type="warn">
          APNs returns error code <strong>410 (Unregistered)</strong> when a token is no longer valid (app uninstalled).
          Workers must immediately mark that token as invalid to avoid wasting quota and raising spam signals.
        </InfoBox>
      </Section>

      <Section title="Reliability: Retry & At-Least-Once" icon="🔁">
        <CodeBlock lang="python pseudocode" code={`def deliver_with_retry(notification, provider, max_attempts=5):
    delay = 1  # seconds
    for attempt in range(1, max_attempts + 1):
        try:
            response = provider.send(notification)
            if response.status == "SUCCESS":
                log(notification.id, "delivered", attempt)
                return
            if response.status == "PERMANENT_FAILURE":
                # e.g. invalid token, unsubscribed — don't retry
                log(notification.id, "permanent_fail", reason=response.error)
                return
        except TransientError:
            pass  # fall through to retry

        if attempt < max_attempts:
            time.sleep(delay + jitter())
            delay = min(delay * 2, 60)   # cap at 60s

    log(notification.id, "exhausted_retries")
    dead_letter_queue.publish(notification)   # for manual review`} />
        <InfoBox type="info">
          Always add <strong>random jitter</strong> (e.g. ±20% of delay) to prevent retry storms when many
          notifications fail simultaneously (e.g. provider outage recovery).
        </InfoBox>
      </Section>

      <Section title="Notification Payload Examples" icon="📄">
        <CodeBlock lang="json" code={`// iOS APNs payload (max 4KB)
{
  "aps": {
    "alert": { "title": "New message", "body": "Alice: Hey, are you free?" },
    "badge": 3,
    "sound": "default",
    "content-available": 1,
    "mutable-content": 1
  },
  "notification_id": "ntf_01J9X4...",
  "deep_link": "myapp://chat/thread/42"
}

// FCM Android payload (max 4KB)
{
  "token": "dKL0...",
  "notification": { "title": "New message", "body": "Alice: Hey, are you free?" },
  "data": {
    "notification_id": "ntf_01J9X4...",
    "thread_id": "42",
    "click_action": "OPEN_THREAD"
  },
  "android": { "priority": "high", "ttl": "86400s" }
}

// SMS (Twilio) — keep under 160 chars
"You have a new message from Alice. Open the app to reply: https://app.ex/t/42"`} />
      </Section>

      <Section title="Fan-out Trade-offs" icon="⚖️">
        <TradeoffTable rows={[
          {
            approach: 'Fan-out at creation',
            pros: 'Notification is ready instantly. Low read latency for workers.',
            cons: 'Expensive for viral events — one action triggers millions of pushes. Queue backlog spikes.',
            when: 'Most notifications. User-to-user events with small follower counts.',
          },
          {
            approach: 'Fan-out at read (pull)',
            pros: 'No spike on write. Works well for celebrity accounts (millions of followers).',
            cons: 'Notification may arrive late. Complex pull aggregation logic.',
            when: 'High-fan-out scenarios: broadcast announcements, celebrity social posts.',
          },
          {
            approach: 'Hybrid',
            pros: 'Best of both: push for regular users, pull for mega-influencers. Balances load.',
            cons: 'Most complex to implement and maintain. Need to classify users.',
            when: 'Large-scale social platforms (Instagram, Twitter/X).',
          },
        ]} />
      </Section>

      <Section title="Compliance & Best Practices" icon="🛡️">
        <InfoBox type="warn">
          <strong>Notification fatigue</strong> — users who receive too many notifications will revoke permission entirely.
          Implement frequency caps (e.g. max 3 push/day per user), quiet hours, and notification grouping (summary notifications).
        </InfoBox>
        <InfoBox type="key">
          <strong>GDPR compliance</strong> — explicit opt-in required in the EU. Store consent with timestamp and version.
          Provide a one-click global unsubscribe. Purge device tokens within 30 days of account deletion.
        </InfoBox>
        <InfoBox type="tip">
          <strong>A/B test notification copy</strong> — small changes in push title wording can change open rates by 20–40%.
          Measure delivery rate, open rate, and opt-out rate per campaign.
        </InfoBox>
      </Section>
    </div>
  )
}
