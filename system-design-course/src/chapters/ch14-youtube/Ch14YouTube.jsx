import { Section, InfoBox, ConceptGrid, ConceptCard, StepList, TradeoffTable, CodeBlock } from '../../components/Shared/Section'
import { C, FONTS } from '../../styles/colors'

export default function Ch14YouTube() {
  return (
    <div>
      <Section title="Requirements & Scale" icon="📋">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
          {[
            { v: '5M',      l: 'videos uploaded/day',          c: C.cyan   },
            { v: '5B',      l: 'video views/day',               c: C.green  },
            { v: '500 hrs', l: 'video uploaded/minute',         c: C.amber  },
            { v: '50+',     l: 'encoding variants per video',   c: C.purple },
            { v: '~58K',    l: 'views/sec peak',                c: C.cyan   },
            { v: 'CDN',     l: 'regional delivery nodes',       c: C.green  },
          ].map(s => (
            <div key={s.l} style={{
              background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: '10px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: FONTS.mono, fontSize: 18, fontWeight: 700, color: s.c }}>{s.v}</div>
              <div style={{ fontFamily: FONTS.sans, fontSize: 10, color: C.textMuted, marginTop: 4, lineHeight: 1.3 }}>{s.l}</div>
            </div>
          ))}
        </div>
        <InfoBox type="info">
          <strong>Scale context:</strong> 500 hours of video uploaded every minute means the raw ingestion
          pipeline must handle hundreds of gigabytes per second globally. The real bottleneck is not
          storage — it is the transcoding compute needed to produce every quality variant in parallel
          before the video becomes publicly visible.
        </InfoBox>
      </Section>

      <Section title="Video Upload & Transcoding Pipeline" icon="🎬" accent={C.amber}>
        <p style={{ fontFamily: FONTS.sans, fontSize: 13, color: C.textDim, lineHeight: 1.7, margin: '0 0 16px' }}>
          Raw video is never served directly to viewers. Every upload triggers an asynchronous
          <strong style={{ color: C.white }}> transcoding pipeline</strong> that produces multiple
          formats and resolutions. A DAG scheduler parallelizes independent tasks so a 1-hour video
          does not block on sequential processing.
        </p>
        <StepList steps={[
          {
            title: 'Client requests presigned upload URL',
            body: 'Client calls the API server → API server generates a presigned S3 URL valid for 15 minutes → returns it to the client. Client uploads raw video directly to object storage — never through the API server (avoids bottleneck).',
          },
          {
            title: 'Raw video lands in object storage',
            body: 'S3-compatible store (e.g., Amazon S3, GCS) receives the raw upload. A storage event triggers a message onto the transcoding queue (SQS/Kafka). Raw file is immutable — never modified after upload.',
          },
          {
            title: 'DAG scheduler fans out transcoding tasks',
            body: 'The DAG defines dependencies: audio extraction and video splitting can run in parallel; watermarking requires the original video; each resolution encode is independent. Worker nodes pick tasks from the queue. Failed tasks retry automatically.',
          },
          {
            title: 'Encode to multiple formats and resolutions',
            body: 'FFmpeg workers produce: 360p/720p/1080p/4K in H.264 and VP9; WebM for Chrome; HLS segments (.m3u8 + .ts files) and DASH segments (.mpd + .mp4 fragments). ~50 variants per video is typical for a major platform.',
          },
          {
            title: 'Processed segments pushed to CDN origin',
            body: 'Finished segments are written to the CDN origin store. CDN edge nodes pull on first request and cache for subsequent viewers. Geographic routing ensures viewers hit the nearest CDN PoP.',
          },
          {
            title: 'Metadata committed, video published',
            body: 'Transcoding completion event updates the metadata service (MySQL): sets status = PUBLISHED, stores segment manifest URLs, thumbnail URLs, duration. Video is now searchable and streamable.',
          },
        ]} />
      </Section>

      <Section title="Core Components" icon="🏗️">
        <ConceptGrid>
          <ConceptCard title="Video Transcoding" icon="🎞️" color={C.amber}>
            FFmpeg-based workers in an auto-scaling group. Each worker handles one encode task.
            GPU instances used for 4K. Spot/preemptible instances reduce cost by ~70%. Output
            segments stored in object storage keyed by videoId + variant.
          </ConceptCard>
          <ConceptCard title="CDN Delivery" icon="🌐" color={C.cyan}>
            Video segments served from CDN edge nodes (CloudFront, Akamai, Fastly). Different
            PoPs for different regions. Cold content served from origin on first request then
            cached at edge. Cache-Control: max-age=31536000 (segments are immutable).
          </ConceptCard>
          <ConceptCard title="ABR Streaming" icon="📶" color={C.green}>
            Adaptive Bitrate via HLS or DASH. Client player monitors download speed and buffer
            level every ~2 seconds. Switches segment quality up or down on the next chunk
            fetch. No rebuffering on good connections; graceful degradation on slow ones.
          </ConceptCard>
          <ConceptCard title="DAG Pipeline" icon="🔀" color={C.purple}>
            Directed Acyclic Graph ensures parallel independent tasks (audio strip, thumbnail
            extraction, resolution encodes) run concurrently. Dependency edges prevent a task
            from starting before its prerequisites finish. Orchestrated by Temporal or Airflow.
          </ConceptCard>
        </ConceptGrid>
      </Section>

      <Section title="Adaptive Bitrate Streaming (ABR)" icon="📶" accent={C.green}>
        <InfoBox type="tip">
          <strong>HLS (HTTP Live Streaming):</strong> Video split into 2–6 second .ts segments.
          A .m3u8 manifest lists all segment URLs and their quality variants. The player picks the
          right variant based on measured bandwidth. Supported natively by iOS/Safari; requires
          hls.js on desktop Chrome.
        </InfoBox>
        <InfoBox type="info">
          <strong>DASH (Dynamic Adaptive Streaming over HTTP):</strong> MPEG standard. Uses .mpd
          manifest + fragmented .mp4 files. More flexible than HLS (arbitrary segment lengths,
          multiple audio tracks, DRM). Preferred on Android and modern web players.
        </InfoBox>
        <CodeBlock lang="hls manifest (m3u8)" code={`#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=400000,RESOLUTION=640x360
/videos/abc123/360p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION=1280x720
/videos/abc123/720p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=4000000,RESOLUTION=1920x1080
/videos/abc123/1080p/index.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=15000000,RESOLUTION=3840x2160
/videos/abc123/4k/index.m3u8`} />
      </Section>

      <Section title="DAG Task Definition" icon="🔀" accent={C.purple}>
        <CodeBlock lang="dag config (yaml)" code={`# Video processing DAG — tasks run in parallel where possible
dag:
  id: transcode-video-abc123
  tasks:
    extract_audio:
      cmd: ffmpeg -i raw.mp4 -vn -acodec aac audio.aac
      deps: []                         # no dependencies — starts immediately

    extract_thumbnail:
      cmd: ffmpeg -i raw.mp4 -ss 00:00:05 -frames:v 1 thumb.jpg
      deps: []                         # parallel with audio

    encode_360p:
      cmd: ffmpeg -i raw.mp4 -vf scale=640:360 -b:v 400k 360p.m3u8
      deps: []                         # independent

    encode_720p:
      cmd: ffmpeg -i raw.mp4 -vf scale=1280:720 -b:v 1500k 720p.m3u8
      deps: []                         # independent

    encode_1080p:
      cmd: ffmpeg -i raw.mp4 -vf scale=1920:1080 -b:v 4000k 1080p.m3u8
      deps: []                         # independent

    package_manifest:
      cmd: generate-hls-master-manifest --variants 360p,720p,1080p
      deps: [encode_360p, encode_720p, encode_1080p, extract_audio]

    push_to_cdn:
      cmd: aws s3 sync ./output/ s3://cdn-origin/videos/abc123/
      deps: [package_manifest, extract_thumbnail]

    update_metadata:
      cmd: curl -X POST /api/videos/abc123/publish --data manifest_url
      deps: [push_to_cdn]`} />
      </Section>

      <Section title="Supporting Services" icon="🗄️" accent={C.cyan}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {[
            {
              title: 'Metadata Service',
              color: C.cyan,
              items: [
                'MySQL for structured data: title, description, tags, channel, duration, view count',
                'Elasticsearch for full-text search and tag-based recommendations',
                'View counts updated via Redis counter → periodic DB flush (avoid hot-row contention)',
              ],
            },
            {
              title: 'Recommendation System',
              color: C.green,
              items: [
                'Collaborative filtering: users with similar watch history see similar recommendations',
                'Watch history stored in Cassandra (high write volume, time-series friendly)',
                'ML model re-trains daily; recommendation cache invalidated per user on new watch event',
              ],
            },
            {
              title: 'Comments Service',
              color: C.amber,
              items: [
                'Separate microservice — lazy loaded after video starts playing',
                'Sharded by videoId in MySQL. Pagination with cursor-based approach',
                'Likes and replies are eventually consistent — counter stored in Redis',
              ],
            },
          ].map(s => (
            <div key={s.title} style={{
              background: C.bgCard, border: `1px solid ${C.border}`,
              borderTop: `2px solid ${s.color}`, borderRadius: 8, padding: '14px 16px',
            }}>
              <div style={{ fontFamily: FONTS.sans, fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 10 }}>{s.title}</div>
              <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
                {s.items.map((item, i) => (
                  <li key={i} style={{ fontFamily: FONTS.sans, fontSize: 12, color: C.textDim, lineHeight: 1.65, marginBottom: 6 }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Streaming Protocol Trade-offs" icon="⚖️" accent={C.red}>
        <TradeoffTable rows={[
          {
            approach: 'HLS (HTTP Live Streaming)',
            pros: 'Native iOS/Safari support. Wide CDN compatibility. Well-established DRM (FairPlay). Segment cacheability.',
            cons: 'Higher latency (6–30 sec default segment). Apple-proprietary origin. Requires hls.js on Chrome.',
            when: 'iOS apps, Apple TV, when Safari support is critical.',
          },
          {
            approach: 'DASH (MPEG-DASH)',
            pros: 'Open standard. Flexible segment length (2–4 sec possible). Multi-audio tracks. Widevine DRM support.',
            cons: 'No native Safari/iOS support. Requires dash.js or Shaka Player. Slightly more complex manifests.',
            when: 'Android, Chromecast, Smart TVs, web apps targeting Chrome/Firefox.',
          },
          {
            approach: 'MP4 Progressive Download',
            pros: 'Trivially simple. Works in any browser with a <video> tag. No manifest complexity.',
            cons: 'No adaptive bitrate. Must download from byte offset. Poor experience on slow connections. Not scalable for long videos.',
            when: 'Short clips, offline downloads, simple video hosting without streaming infrastructure.',
          },
        ]} />
      </Section>

      <InfoBox type="key">
        <strong>Netflix and YouTube encode 50+ variants:</strong> A single 1080p upload on YouTube
        gets re-encoded into VP9 and H.264 at 144p, 240p, 360p, 480p, 720p, 1080p, 1440p, and 4K —
        plus multiple audio bitrates and language tracks. Netflix goes further with per-title encoding,
        analyzing the content complexity to assign optimal bitrates rather than using fixed ladders.
        This is why Netflix uses less bandwidth than YouTube for the same perceived quality.
      </InfoBox>
    </div>
  )
}
