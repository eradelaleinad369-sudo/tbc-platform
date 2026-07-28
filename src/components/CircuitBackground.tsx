// Decorative animated circuit-trace + gear background for hero sections.
// Pure SVG/CSS — no dependencies.
export default function CircuitBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 blueprint-grid opacity-40" />

      {/* Slow-turning gear, top right */}
      <svg
        className="absolute -top-10 -right-10 w-56 h-56 text-brand-orange/10 animate-spin-slow"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 15 L54 5 L46 5 Z M50 85 L54 95 L46 95 Z M15 50 L5 54 L5 46 Z M85 50 L95 54 L95 46 Z
             M27 27 L20 20 M73 27 L80 20 M27 73 L20 80 M73 73 L80 80"
          stroke="currentColor"
          strokeWidth="3"
        />
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="3" />
        <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="3" />
      </svg>

      {/* Floating secondary gear, bottom left */}
      <svg
        className="absolute -bottom-6 -left-6 w-32 h-32 text-brand-green/10 animate-float"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="3" />
        <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="3" />
      </svg>

      {/* Circuit trace lines, draw themselves in */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400" fill="none" preserveAspectRatio="none">
        <path
          className="circuit-path"
          d="M0 80 H200 L230 110 H400 L420 90 H620 L650 120 H800"
          stroke="#63A15A"
          strokeWidth="1.5"
          strokeOpacity="0.25"
        />
        <path
          className="circuit-path"
          style={{ animationDelay: '0.4s' }}
          d="M0 320 H150 L180 290 H380 L410 320 H600 L630 280 H800"
          stroke="#FC700E"
          strokeWidth="1.5"
          strokeOpacity="0.2"
        />
        {[200, 400, 620].map((x) => (
          <circle key={x} cx={x} cy="80" r="4" fill="#63A15A" fillOpacity="0.3" />
        ))}
      </svg>
    </div>
  )
}
