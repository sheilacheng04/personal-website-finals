/**
 * GlassRefractionFilter.jsx
 * ──────────────────────────────────────────────────────────
 * Task 2 (Refraction) — Hidden SVG filter that creates a
 * subtle barrel-distortion / magnifying glass warp.
 *
 * Render this component ONCE in the page. The CSS references
 * it via `filter: url(#glass-refraction)`.
 *
 * The feTurbulence → feDisplacementMap pipeline creates
 * organic, water-like distortion of whatever is behind
 * the element (particles, caustics, etc.).
 */
export default function GlassRefractionFilter() {
  return (
    <svg
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden="true"
    >
      <defs>
        {/* Subtle refraction / magnifying effect */}
        <filter id="glass-refraction" x="-10%" y="-10%" width="120%" height="120%">
          {/* Low-frequency turbulence for organic warp */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.012"
            numOctaves="2"
            seed="42"
            result="noise"
          />
          {/* Displace the source graphic using the noise */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="6"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
