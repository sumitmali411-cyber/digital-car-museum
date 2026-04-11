import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Section, SubSection, InfoBox, ConceptGrid, ConceptCard,
  StepList, TradeoffTable, CodeBlock,
} from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

// ─── Chunked Upload Visualizer ────────────────────────────────────────────────
function ChunkedUploadViz() {
  const CHUNK_COUNT = 8
  const [uploaded, setUploaded] = useState([])
  const [uploading, setUploading] = useState(false)
  const [assembled, setAssembled] = useState(false)

  const reset = () => { setUploaded([]); setAssembled(false) }

  const startUpload = async () => {
    if (uploading) return
    reset()
    setUploading(true)
    for (let i = 0; i < CHUNK_COUNT; i++) {
      await new Promise(r => setTimeout(r, 200 + Math.random() * 300))
      setUploaded(prev => [...prev, i])
    }
    await new Promise(r => setTimeout(r, 400))
    setAssembled(true)
    setUploading(false)
  }

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px' }}>
      <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted, letterSpacing: '0.12em', marginBottom: 16 }}>
        CHUNKED UPLOAD SIMULATOR — 100 MB file split into {CHUNK_COUNT} × 12.5 MB chunks
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {Array.from({ length: CHUNK_COUNT }).map((_, i) => {
          const done = uploaded.includes(i)
          return (
            <motion.div
              key={i}
              animate={{
                background: done ? `rgba(16,185,129,0.2)` : 'rgba(255,255,255,0.03)',
                borderColor: done ? C.green : C.border,
              }}
              style={{
                width: 64, height: 48,
                border: `1px solid`,
                borderRadius: 6,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 2,
              }}
            >
              <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: done ? C.green : C.textMuted }}>
                CHUNK
              </div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 13, fontWeight: 700, color: done ? C.green : C.textMuted }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              {done && <div style={{ fontSize: 8, color: C.green }}>✓</div>}
            </motion.div>
          )
        })}
      </div>

      {assembled && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(16,185,129,0.08)', border: `1px solid ${C.green}40`,
            borderRadius: 6, padding: '10px 14px', marginBottom: 12,
            fontFamily: FONTS.sans, fontSize: 13, color: C.green,
          }}
        >
          ✅ All chunks received. File assembled on storage service. Deduplication hash computed. Metadata record created.
        </motion.div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button
          onClick={startUpload}
          disabled={uploading}
          style={{
            padding: '9px 18px',
            background: uploading ? 'none' : 'rgba(6,182,212,0.1)',
            border: `1px solid ${uploading ? C.border : C.cyan}`,
            borderRadius: 6, color: uploading ? C.textMuted : C.cyan,
            fontFamily: FONTS.mono, fontSize: 11, cursor: uploading ? 'default' : 'pointer',
          }}
        >
          {uploading ? 'UPLOADING...' : '▶ START UPLOAD'}
        </button>
        <button
          onClick={reset}
          style={{
            padding: '9px 18px',
            background: 'none', border: `1px solid ${C.border}`,
            borderRadius: 6, color: C.textMuted,
            fontFamily: FONTS.mono, fontSize: 11, cursor: 'pointer',
          }}
        >
          RESET
        </button>
      </div>
    </div>
  )
}

// ─── Storage Layer Comparison ─────────────────────────────────────────────────
function StorageLayerViz() {
  const [active, setActive] = useState('block')

  const layers = {
    block: {
      label: 'Block Storage',
      color: C.cyan,
      icon: '💾',
      desc: 'Raw storage volumes (like hard drives). No built-in metadata. Used for DB servers, VMs. Low-level, high performance.',
      examples: 'AWS EBS, iSCSI, NFS',
      use: 'Database servers, VM images, OS volumes.',
      latency: '< 1ms',
    },
    object: {
      label: 'Object Storage',
      color: C.green,
      icon: '🪣',
      desc: 'Flat namespace of objects (key → bytes + metadata). Infinitely scalable. Optimized for large blobs. REST API access.',
      examples: 'AWS S3, GCS, Azure Blob',
      use: 'File storage, backups, media files, archives.',
      latency: '10–100ms',
    },
    file: {
      label: 'File Storage (NFS/HDFS)',
      color: C.amber,
      icon: '📁',
      desc: 'Hierarchical file system interface. Familiar directory structure. HDFS optimized for large sequential reads (MapReduce).',
      examples: 'HDFS, EFS, NFS',
      use: 'Shared file systems, analytics pipelines.',
      latency: '1–10ms',
    },
  }

  const current = layers[active]

  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
        {Object.entries(layers).map(([key, l]) => (
          <button key={key} onClick={() => setActive(key)} style={{
            flex: 1, padding: '10px 8px', background: 'none', border: 'none',
            borderBottom: active === key ? `2px solid ${l.color}` : '2px solid transparent',
            fontFamily: FONTS.mono, fontSize: 9,
            color: active === key ? l.color : C.textMuted,
            cursor: 'pointer', transition: 'color 0.15s',
          }}>
            {l.icon} {l.label.toUpperCase().split(' ')[0]}
          </button>
        ))}
      </div>
      <div style={{ padding: '20px 24px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
          <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 12px' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 8, color: C.textMuted, marginBottom: 3, letterSpacing: '0.1em' }}>LATENCY</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 12, fontWeight: 700, color: current.color }}>{current.latency}</div>
          </div>
          <div style={{ background: '#0d1117', border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 12px' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 8, color: C.textMuted, marginBottom: 3, letterSpacing: '0.1em' }}>EXAMPLES</div>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, color: C.purple }}>{current.examples}</div>
          </div>
        </div>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.65, margin: '0 0 8px' }}>{current.desc}</p>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, color: C.textMuted }}>
          BEST FOR: <span style={{ color: current.color }}>{current.use}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Main Chapter ─────────────────────────────────────────────────────────────
export default function Ch15GoogleDrive() {
  return (
    <div>
      <Section title="Storage Architecture Overview" icon="☁️">
        <InfoBox type="info">
          <strong>Scale targets:</strong> Google Drive has 1 billion users. Dropbox stores 500+ petabytes.
          The key insight: file content and file metadata are separate concerns requiring different storage systems.
        </InfoBox>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '12px 0' }}>
          Google Drive uses a three-layer storage approach: object storage (S3/GCS) for raw file bytes,
          a metadata service (MySQL/Spanner) for file hierarchy and sharing permissions, and a CDN layer
          for fast downloads near users.
        </p>
        <StorageLayerViz />
      </Section>

      <Section title="Chunked Upload" icon="📤">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Uploading large files as a single HTTP request is unreliable — any network interruption
          loses the entire transfer. Chunking solves this with resumable uploads.
        </p>
        <ChunkedUploadViz />

        <SubSection title="Chunking Benefits">
          <ConceptGrid>
            <ConceptCard title="Resumable Uploads" icon="▶️" color={C.cyan}>
              Track which chunks succeeded. On failure, only retry failed chunks. Client queries
              server: "which chunks do you have?" then resumes from there.
            </ConceptCard>
            <ConceptCard title="Parallel Upload" icon="⚡" color={C.green}>
              Upload multiple chunks simultaneously to different storage nodes. Saturates network
              bandwidth. 8 parallel streams × 12.5 MB = near line-speed.
            </ConceptCard>
            <ConceptCard title="Deduplication" icon="♻️" color={C.amber}>
              Each chunk hashed with SHA-256. If hash already exists in storage, skip upload —
              just store a reference. Dropbox saves ~50% storage this way.
            </ConceptCard>
            <ConceptCard title="Delta Sync" icon="🔄" color={C.purple}>
              On file edit, only changed chunks need uploading. For a 1 GB file with 1 KB change,
              only 4 MB chunk (containing the edit) is re-uploaded.
            </ConceptCard>
          </ConceptGrid>
        </SubSection>

        <SubSection title="Resumable Upload Protocol">
          <CodeBlock lang="http" code={`# Step 1: Initiate upload session
POST /upload/files?uploadType=resumable
Content-Type: application/json
{
  "filename": "report.pdf",
  "size": 104857600,    // 100 MB
  "mimeType": "application/pdf",
  "checksum": "sha256:abc123..."
}

# Response: upload session URL + chunk size recommendation
201 Created
Location: https://upload.example.com/upload/session/xyz789
X-Chunk-Size: 8388608   // 8 MB recommended

# Step 2: Upload chunk 1 of 13
PUT /upload/session/xyz789
Content-Range: bytes 0-8388607/104857600
[binary data]

# Step 3: Resume after network failure
GET /upload/session/xyz789       // query progress
308 Resume Incomplete
Range: bytes=0-16777215          // first 2 chunks received`} />
        </SubSection>
      </Section>

      <Section title="Content-Addressed Deduplication" icon="🔍">
        <StepList steps={[
          { title: 'Split file into chunks (4–8 MB each)', body: 'Deterministic chunking using content-defined chunking (CDC) — chunk boundaries determined by file content, not fixed offsets. Same content always produces same chunks even after edits.' },
          { title: 'Hash each chunk (SHA-256)', body: 'Compute cryptographic hash of chunk bytes. This is the chunk\'s address in the content-addressed store.' },
          { title: 'Check if chunk already exists', body: 'Query metadata DB: does this hash exist? If yes, skip upload — just store a reference to existing chunk. This is cross-user deduplication.' },
          { title: 'Upload only new chunks', body: 'Only chunks with new hashes need to be uploaded to object storage. Existing chunks are referenced.' },
          { title: 'Store block list in metadata', body: 'File record stores ordered list of chunk hashes. Reassembling the file = fetching chunks in order and concatenating.' },
        ]} />

        <InfoBox type="key">
          <strong>Storage savings:</strong> When 1000 users upload the same PDF, only one copy is stored.
          Dropbox reported saving ~50% storage via deduplication. Be careful: deduplication can leak
          info about file existence — must be combined with per-user encryption for E2E security.
        </InfoBox>
      </Section>

      <Section title="Metadata Service" icon="🗂️">
        <SubSection title="Schema Design">
          <CodeBlock lang="sql" code={`-- File metadata
CREATE TABLE files (
  file_id        BIGINT PRIMARY KEY,  -- Snowflake ID
  owner_id       BIGINT NOT NULL,
  parent_folder_id BIGINT,            -- NULL = root
  name           VARCHAR(255),
  mime_type      VARCHAR(100),
  size_bytes     BIGINT,
  block_list     JSON,                -- ["sha256:abc", "sha256:def", ...]
  created_at     TIMESTAMP,
  updated_at     TIMESTAMP,
  version        INT DEFAULT 1,
  is_deleted     BOOLEAN DEFAULT FALSE  -- soft delete for trash
);

-- File sharing permissions
CREATE TABLE file_permissions (
  file_id        BIGINT,
  user_id        BIGINT,
  permission     ENUM('read', 'write', 'owner'),
  shared_at      TIMESTAMP,
  PRIMARY KEY (file_id, user_id)
);

-- Version history
CREATE TABLE file_versions (
  file_id        BIGINT,
  version        INT,
  block_list     JSON,
  size_bytes     BIGINT,
  created_at     TIMESTAMP,
  PRIMARY KEY (file_id, version)
);`} />
        </SubSection>

        <InfoBox type="warn">
          <strong>File path resolution:</strong> Storing full path as a string is a mistake — rename
          operations require updating all descendants. Use parent_id (adjacency list) or a path
          enumeration model. For deep hierarchies, consider a Closure Table.
        </InfoBox>
      </Section>

      <Section title="Delta Sync Protocol" icon="🔄">
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 12px' }}>
          Delta sync ensures that editing a large file doesn't re-upload the entire file.
          It's the primary reason Dropbox sync feels fast.
        </p>

        <ConceptGrid>
          <ConceptCard title="File Watcher" icon="👁️" color={C.cyan}>
            Desktop client monitors filesystem for changes using OS APIs (inotify on Linux, FSEvents on Mac,
            ReadDirectoryChangesW on Windows). Detects which bytes changed.
          </ConceptCard>
          <ConceptCard title="Local Diff Computation" icon="🧮" color={C.green}>
            Client splits file into chunks, computes hashes. Compares with last-sync state. Identifies
            only changed/new chunks that need uploading.
          </ConceptCard>
          <ConceptCard title="Sync Service" icon="⚡" color={C.amber}>
            Coordinates sync across devices. Maintains per-device sync cursor (last known version).
            Broadcasts delta events to all connected devices of same user.
          </ConceptCard>
          <ConceptCard title="Notification Queue" icon="📨" color={C.purple}>
            Long-polling or WebSocket connection from each device to sync service. When server receives
            upload, notifies other devices to pull the delta.
          </ConceptCard>
        </ConceptGrid>

        <SubSection title="Sync Flow">
          <StepList steps={[
            { title: 'Device A modifies file', body: 'File watcher detects change. Client computes new chunk hashes. Identifies 1 changed chunk (out of 13).' },
            { title: 'Upload delta to server', body: 'POST /sync/delta with changed chunk + new block_list. Metadata service creates new version record.' },
            { title: 'Notify Device B', body: 'Sync service publishes change event to user\'s notification channel. Device B\'s long-poll connection receives event.' },
            { title: 'Device B fetches delta', body: 'GET /sync/delta?since=version_5. Receives new block_list. Downloads only the 1 changed chunk from CDN.' },
            { title: 'Conflict resolution', body: 'If both devices modified simultaneously: server detects version mismatch. Creates conflicted copy ("report (conflicted copy 2024-01-15).pdf"). User resolves.' },
          ]} />
        </SubSection>
      </Section>

      <Section title="CDN for Downloads" icon="🌐">
        <InfoBox type="tip">
          File downloads should never go through your application servers. Route them directly from
          CDN to client using pre-signed URLs — zero application server load for downloads.
        </InfoBox>

        <SubSection title="Pre-Signed URL Flow">
          <CodeBlock lang="sequence" code={`1. Client → API Server: GET /files/123/download
2. API Server:  verify auth + permissions (fast, metadata only)
3. API Server → Client: 302 Location: https://cdn.example.com/chunks/sha256:abc?signature=xyz&expires=1705320600
4. Client → CDN Edge (nearest POP): GET /chunks/sha256:abc?signature=xyz
5. CDN → Client: 200 OK [file bytes]

Benefits:
- API servers handle only auth (tiny payload)
- CDN serves bytes at edge (low latency, high throughput)
- Pre-signed URL expires in 5 minutes (security)
- No server needed in the hot path for file content`} />
        </SubSection>
      </Section>

      <Section title="Conflict Resolution" icon="⚔️">
        <TradeoffTable rows={[
          {
            approach: 'Last Write Wins (LWW)',
            pros: 'Simple. No user intervention. Deterministic.',
            cons: 'Data loss — one user\'s edits silently overwritten. Unacceptable for documents.',
            when: 'Acceptable for non-critical data (app preferences, settings sync).',
          },
          {
            approach: 'Conflicted Copy (Dropbox)',
            pros: 'No data loss. Both versions preserved. Users aware of conflict.',
            cons: 'User must manually merge. Can accumulate many conflicted copies.',
            when: 'Document files. Protects user data above all else.',
          },
          {
            approach: 'Operational Transform (Google Docs)',
            pros: 'Real-time collaborative editing. No conflicts — transforms applied atomically.',
            cons: 'Complex algorithm. Requires always-online for collaboration.',
            when: 'Live collaboration features. Significantly more complex implementation.',
          },
          {
            approach: 'CRDT (Conflict-free Replicated Data)',
            pros: 'Mathematically conflict-free. Works offline. Eventual consistency guaranteed.',
            cons: 'Only works for specific data structures (counters, sets, text). Not general.',
            when: 'Figma, Notion. Purpose-built collaborative data structures.',
          },
        ]} />
      </Section>

      <Section title="Interview Summary" icon="✅">
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 20px' }}>
          {[
            'Separate file content (object storage) from file metadata (relational DB)',
            'Chunk files into 4–8 MB pieces for resumable, parallel uploads',
            'SHA-256 hash each chunk for content-addressed storage and deduplication',
            'Delta sync: only upload/download changed chunks, not entire file',
            'Metadata DB: files table with block_list (ordered chunk hash list)',
            'Pre-signed URLs for direct CDN downloads — bypass application servers',
            'Versioning: store block_list per version, enable file history and restore',
            'Conflict resolution: create conflicted copy (Dropbox approach) vs OT (Google Docs)',
            'Sync service: long-polling or WebSocket for real-time sync notification across devices',
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0',
              borderBottom: i < 8 ? `1px solid ${C.border}` : 'none',
            }}>
              <span style={{ color: C.cyan, fontFamily: FONTS.mono, fontSize: 11, lineHeight: 1.5, flexShrink: 0 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
