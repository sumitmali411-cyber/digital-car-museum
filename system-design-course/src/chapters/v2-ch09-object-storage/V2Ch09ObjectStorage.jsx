import { useState } from 'react'
import { motion } from 'motion/react'
import {
  Section, SubSection, InfoBox, ConceptGrid, ConceptCard,
  StepList, TradeoffTable, CodeBlock,
} from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── Data Placement Diagram ───────────────────────────────────────────────────
function DataPlacementDiagram() {
  const azColors = [C.cyan, C.green, C.amber]
  const azNames = ['AZ-1', 'AZ-2', 'AZ-3']

  return (
    <svg viewBox="0 0 700 240" style={{ width: '100%', maxHeight: 240 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr-os" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L7,3 z" fill={C.cyan} />
        </marker>
      </defs>

      {/* Client */}
      <rect x="10" y="95" width="80" height="50" rx="5" fill="#1a2236" stroke={C.border} strokeWidth="1"/>
      <text x="50" y="117" textAnchor="middle" fill={C.textDim} fontSize="9" fontFamily="JetBrains Mono">CLIENT</text>
      <text x="50" y="131" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">PUT object</text>
      <line x1="90" y1="120" x2="130" y2="120" stroke={C.cyan} strokeWidth="1.5" markerEnd="url(#arr-os)"/>

      {/* API server */}
      <rect x="130" y="85" width="100" height="70" rx="6" fill="rgba(6,182,212,0.08)" stroke={C.cyan} strokeWidth="1.5"/>
      <text x="180" y="111" textAnchor="middle" fill={C.cyan} fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">API SERVER</text>
      <text x="180" y="125" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">auth + routing</text>
      <text x="180" y="138" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">multipart coord</text>
      <line x1="230" y1="120" x2="270" y2="120" stroke={C.cyan} strokeWidth="1.5" markerEnd="url(#arr-os)"/>

      {/* Metadata service */}
      <rect x="270" y="85" width="100" height="70" rx="6" fill="rgba(245,158,11,0.08)" stroke={C.amber} strokeWidth="1.5"/>
      <text x="320" y="108" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">METADATA</text>
      <text x="320" y="122" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily="JetBrains Mono">SERVICE</text>
      <text x="320" y="136" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">bucket/key → node</text>
      <text x="320" y="148" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">PostgreSQL/etcd</text>

      {/* Data nodes in AZs */}
      {azColors.map((color, i) => (
        <g key={i}>
          <rect x={440 + i * 80} y="40" width="65" height="160" rx="6" fill={`${color}05`} stroke={`${color}30`} strokeWidth="1" strokeDasharray="4,3"/>
          <text x={472 + i * 80} y="60" textAnchor="middle" fill={color} fontSize="9" fontFamily="JetBrains Mono">{azNames[i]}</text>
          <rect x={450 + i * 80} y="70" width="45" height="30" rx="4" fill={`${color}12`} stroke={`${color}40`} strokeWidth="1"/>
          <text x={472 + i * 80} y="90" textAnchor="middle" fill={color} fontSize="8" fontFamily="JetBrains Mono">Chunk</text>
          <rect x={450 + i * 80} y="110" width="45" height="30" rx="4" fill={`${color}08`} stroke={`${color}30`} strokeWidth="1"/>
          <text x={472 + i * 80} y="130" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">Replica</text>
          <rect x={450 + i * 80} y="150" width="45" height="30" rx="4" fill={`${color}06`} stroke={`${color}20`} strokeWidth="1"/>
          <text x={472 + i * 80} y="170" textAnchor="middle" fill={C.textMuted} fontSize="8" fontFamily="JetBrains Mono">Data</text>
          <line x1="370" y1="120" x2={450 + i * 80} y2="120"
            stroke={`${color}50`} strokeWidth="1" markerEnd="url(#arr-os)"/>
        </g>
      ))}

      <text x="350" y="225" textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="Space Grotesk">
        3-replica placement across 3 Availability Zones — survives any single AZ failure
      </text>
    </svg>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function V2Ch09ObjectStorage() {
  return (
    <div>
      <Section title="3-Replica Data Placement Across AZs" icon="🪣">
        <InfoBox type="info">
          Amazon S3 guarantees 99.999999999% (11 nines) durability by distributing 3 copies
          of every object across 3 Availability Zones. Even an entire AZ going offline
          (fire, power outage) cannot cause data loss.
        </InfoBox>

        <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px', marginBottom: 16 }}>
          <DataPlacementDiagram />
        </div>

        <StepList steps={[
          { title: 'Client sends PUT request to API server', body: 'Object key, bucket name, and data sent to the regional API endpoint. Large objects are automatically split into chunks (default: 8MB) for parallel upload.' },
          { title: 'Metadata service assigns data node locations', body: 'For each new object, the metadata service determines which 3 data nodes (one per AZ) will store the object. Uses consistent hashing or placement group algorithms to balance load.' },
          { title: 'Parallel write to 3 AZ nodes', body: 'API server streams data to all 3 data nodes simultaneously. Write is acknowledged to client only after all 3 nodes confirm receipt — strong durability before returning 200 OK.' },
          { title: 'Metadata committed', body: 'After data nodes confirm, metadata service records the mapping: (bucket, key) → (node_az1, node_az2, node_az3, object_size, etag, version_id). This is the source of truth for object location.' },
        ]} />
      </Section>

      <Section title="Erasure Coding vs Replication" icon="⚖️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          3-replica replication requires 3× storage overhead. For cold/archive storage where
          retrieval is rare, erasure coding dramatically reduces storage cost at the expense
          of slightly higher reconstruction complexity.
        </p>

        <TradeoffTable rows={[
          {
            approach: '3-Way Replication',
            pros: 'Simple reads: fetch from any 1 replica. Zero reconstruction overhead. Fast random access.',
            cons: '200% storage overhead (3x). Expensive for long-term archive storage.',
            when: 'Hot objects (frequently accessed). S3 Standard storage class. Low-latency requirements.',
          },
          {
            approach: 'Erasure Coding (e.g., Reed-Solomon 6+3)',
            pros: '50% overhead (vs 200%). Same durability. 9 shards: tolerate any 3 failures.',
            cons: 'Read requires fetching k=6 shards and XOR reconstruction. Higher read latency.',
            when: 'Cold/archive storage. S3 Glacier, S3 Intelligent-Tiering. Write once, read rarely.',
          },
        ]} />

        <SubSection title="Reed-Solomon Erasure Coding">
          <CodeBlock lang="erasure coding concept" code={`# Reed-Solomon (6, 3): split object into 6 data shards + 3 parity shards
# Any 6 of 9 shards can reconstruct the original object

Object size: 600 MB
→ Split into 6 data shards: [D1=100MB, D2=100MB, D3=100MB, D4=100MB, D5=100MB, D6=100MB]
→ Compute 3 parity shards: [P1, P2, P3] via Galois Field math

Storage: 9 × 100MB = 900MB (vs 1800MB for 3-replica)
Overhead: 50% (vs 200%)

# Reconstruction on shard failure:
if missing_shards <= 3:
    fetch any 6 available shards
    apply inverse Reed-Solomon transform
    reconstruct missing shards

# Typical S3 Glacier: EC(14,10) — tolerates 4 failures, 40% overhead`} />
        </SubSection>
      </Section>

      <Section title="Metadata Service" icon="🗂️">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          The metadata service is the brain of the object store. It maps human-readable
          object keys to their physical locations on data nodes and handles all namespace operations.
        </p>

        <CodeBlock lang="metadata schema" code={`-- Object metadata (stored in strongly consistent DB: PostgreSQL or TiKV)
CREATE TABLE objects (
    bucket_id       UUID NOT NULL,
    object_key      TEXT NOT NULL,      -- "photos/vacation/sunset.jpg"
    version_id      UUID NOT NULL,      -- enables versioning
    size_bytes      BIGINT,
    content_type    TEXT,
    etag            TEXT,               -- MD5 of content
    storage_class   TEXT,               -- STANDARD, GLACIER, etc.
    data_node_ids   UUID[],             -- physical node locations
    shard_map       JSONB,              -- for erasure coded objects
    created_at      TIMESTAMPTZ,
    deleted_at      TIMESTAMPTZ,        -- soft delete for versioning
    metadata        JSONB,              -- user-defined key/value
    PRIMARY KEY (bucket_id, object_key, version_id)
);

-- Bucket metadata
CREATE TABLE buckets (
    bucket_id   UUID PRIMARY KEY,
    owner_id    UUID NOT NULL,
    region      TEXT NOT NULL,
    versioning  BOOLEAN DEFAULT false,
    lifecycle   JSONB,     -- transition/expiration rules
    acl         JSONB,     -- access control list
    created_at  TIMESTAMPTZ
);`} />

        <InfoBox type="warn">
          <strong>Metadata service is the single point of failure risk.</strong> Use a replicated
          strongly-consistent store (Raft-based: TiKV, etcd, or PostgreSQL with synchronous
          replication). Never use eventual consistency for metadata — split-brain causes data loss.
        </InfoBox>
      </Section>

      <Section title="Multipart Upload" icon="📤">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Objects larger than ~100MB benefit enormously from multipart upload: parallel
          chunk uploads, resumability on network failure, and ability to begin streaming
          a video before the full file is uploaded.
        </p>

        <StepList steps={[
          { title: 'Initiate upload (POST)', body: 'Client calls CreateMultipartUpload → server returns an upload_id. This ID tracks all parts of this logical upload. Upload session expires after 7 days if not completed.' },
          { title: 'Upload parts in parallel (PUT)', body: 'Client splits file into N parts (minimum 5MB each, max 10,000 parts). Each part uploaded independently with PUT /object?partNumber=N&uploadId=X. Parts can be uploaded in parallel across multiple connections or machines.' },
          { title: 'Server stores parts independently', body: 'Each part stored as a temporary object on a data node. Server returns ETag (MD5 of part). Part-level checksums detect corruption in transit.' },
          { title: 'Complete multipart upload (POST)', body: 'Client sends list of all parts and their ETags. Server validates all parts received, concatenates them into the final object, updates metadata, and atomically makes the object available. Cleans up temporary part objects.' },
        ]} />

        <CodeBlock lang="multipart upload (aws sdk concept)" code={`# Step 1: initiate
upload_id = s3.create_multipart_upload(Bucket='my-bucket', Key='large-video.mp4')

# Step 2: upload parts in parallel (e.g., with ThreadPoolExecutor)
parts = []
for i, chunk in enumerate(split_file('video.mp4', chunk_size=8*1024*1024)):
    response = s3.upload_part(
        Bucket='my-bucket', Key='large-video.mp4',
        UploadId=upload_id, PartNumber=i+1, Body=chunk
    )
    parts.append({'PartNumber': i+1, 'ETag': response['ETag']})

# Step 3: complete
s3.complete_multipart_upload(
    Bucket='my-bucket', Key='large-video.mp4',
    UploadId=upload_id,
    MultipartUpload={'Parts': parts}
)`} />
      </Section>

      <Section title="Versioning and Lifecycle Policies" icon="🔄">
        <ConceptGrid>
          <ConceptCard title="Object Versioning" icon="📜" color={C.cyan}>
            When enabled, every PUT creates a new version rather than overwriting. DELETEs
            insert a delete marker. Any version can be restored. Protects against accidental
            deletes. Version IDs are UUID-like strings. Extra storage cost for all versions.
          </ConceptCard>
          <ConceptCard title="Lifecycle Rules" icon="⚙️" color={C.amber}>
            Automate storage class transitions and deletions:
            Day 0 → STANDARD. Day 30 → STANDARD_IA (infrequent access). Day 90 → GLACIER.
            Day 365 → DEEP_ARCHIVE. Day 730 → expire (delete). Huge cost savings for archives.
          </ConceptCard>
          <ConceptCard title="Pre-signed URLs" icon="🔗" color={C.green}>
            Time-limited URLs that allow temporary access to private objects without exposing
            credentials. Server signs URL with HMAC using access key. Signature covers bucket,
            key, expiry, and allowed operations. Use for secure download links in apps.
          </ConceptCard>
          <ConceptCard title="Consistency Model" icon="🔮" color={C.purple}>
            S3 provides strong read-after-write consistency for new PUTs. Overwrite PUTs and
            DELETEs are also strongly consistent (since December 2020). List operations are
            eventually consistent — may not reflect very recent changes immediately.
          </ConceptCard>
        </ConceptGrid>

        <SubSection title="Pre-signed URL Generation">
          <CodeBlock lang="presigned url (pseudocode)" code={`def generate_presigned_url(bucket, key, expires_in_seconds):
    expiry = now() + expires_in_seconds
    string_to_sign = f"GET\n\n\n{expiry}\n/{bucket}/{key}"

    # HMAC-SHA256 with account secret access key
    signature = hmac_sha256(SECRET_ACCESS_KEY, string_to_sign)
    signature_b64 = base64.encode(signature)

    url = (f"https://{bucket}.s3.amazonaws.com/{key}"
           f"?AWSAccessKeyId={ACCESS_KEY_ID}"
           f"&Expires={expiry}"
           f"&Signature={url_encode(signature_b64)}")
    return url

# Server validates by recomputing and comparing signature
# Expired URL → 403 Forbidden
# Tampered key/bucket → signature mismatch → 403`} />
        </SubSection>
      </Section>

      <Section title="Interview Checklist" icon="✅">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'Two core components: metadata service (PostgreSQL/TiKV) + data nodes',
            '3-replica across 3 AZs for hot storage; erasure coding (RS 6+3) for cold',
            'Metadata service must be strongly consistent (Raft) — never eventually consistent',
            'Multipart upload: for objects > 100MB, parallel parts, resumable on failure',
            'Versioning: all writes create new version, deletes insert delete marker',
            'Lifecycle policies automate STANDARD → IA → GLACIER → DEEP_ARCHIVE → expire',
            'Pre-signed URLs for temporary access without exposing credentials',
            'Strong read-after-write consistency (S3 since Dec 2020)',
            'Content-addressable storage (ETag = MD5) enables deduplication',
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
