export default function BlueprintGrid() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0 }}
      >
        <defs>
          {/* Minor grid — small cells */}
          <pattern id="grid-minor" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(59,130,246,0.045)"
              strokeWidth="0.5"
            />
          </pattern>
          {/* Major grid — every 200px */}
          <pattern id="grid-major" width="200" height="200" patternUnits="userSpaceOnUse">
            <rect width="200" height="200" fill="url(#grid-minor)" />
            <path
              d="M 200 0 L 0 0 0 200"
              fill="none"
              stroke="rgba(59,130,246,0.08)"
              strokeWidth="1"
            />
          </pattern>
          {/* Dot at every minor intersection */}
          <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="0" cy="0" r="1" fill="rgba(59,130,246,0.12)" />
            <circle cx="40" cy="0" r="1" fill="rgba(59,130,246,0.12)" />
            <circle cx="0" cy="40" r="1" fill="rgba(59,130,246,0.12)" />
            <circle cx="40" cy="40" r="1" fill="rgba(59,130,246,0.12)" />
          </pattern>
        </defs>

        {/* Background */}
        <rect width="100%" height="100%" fill="#0a0e1a" />

        {/* Major grid */}
        <rect width="100%" height="100%" fill="url(#grid-major)" />

        {/* Intersection dots */}
        <rect width="100%" height="100%" fill="url(#dots)" />

        {/* Radial vignette: darker at edges, slightly lighter centre */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="rgba(10,14,26,0)" />
          <stop offset="100%" stopColor="rgba(10,14,26,0.6)" />
        </radialGradient>
        <rect width="100%" height="100%" fill="url(#vignette)" />
      </svg>
    </div>
  )
}
