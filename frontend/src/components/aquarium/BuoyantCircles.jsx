/**
 * BuoyantCircles.jsx
 * ──────────────────────────────────────────────────────────
 * Task 1 — GSAP-driven "buoyant" physics for nav circles.
 *
 * Each circle gets:
 *   • Random vertical bobbing  (y-axis, infinite timeline)
 *   • Slight rotation wobble   (z-axis / rotate)
 *   • Magnetic pull on hover   (follows cursor, elastic snap-back)
 *
 * Usage:
 *   Import this hook from HomePage and call it after the
 *   circles have been rendered into the DOM.
 *
 *   useBuoyantCircles(containerRef);
 */
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/* ── helpers ───────────────────────────────────────────── */

/** Return a random float between min and max */
const rand = (min, max) => Math.random() * (max - min) + min;

/**
 * Build a looping GSAP timeline that bobs the element up/down
 * with a slight rotation, creating the "floating in water" feel.
 */
function createBobTimeline(el, index) {
  const tl = gsap.timeline({ repeat: -1, yoyo: true, delay: rand(0, 2) });

  // Phase 1 — drift up
  tl.to(el, {
    y: rand(-14, -8),
    rotation: rand(-3, -1),
    duration: rand(2.4, 4),
    ease: 'sine.inOut',
  });

  // Phase 2 — drift down past center
  tl.to(el, {
    y: rand(6, 14),
    rotation: rand(1, 3),
    duration: rand(2.4, 4),
    ease: 'sine.inOut',
  });

  // Phase 3 — return near center (slight variation keeps it organic)
  tl.to(el, {
    y: rand(-4, 4),
    rotation: rand(-1.5, 1.5),
    duration: rand(2, 3.5),
    ease: 'sine.inOut',
  });

  return tl;
}

/* ── Magnetic pull handler factory ─────────────────────── */

function createMagneticHandlers(el) {
  const strength = 0.35; // how far the circle follows (0-1)
  const radius = 180;    // activation radius in px

  const onMouseMove = (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const circleRadius = rect.width / 2;

    if (dist < radius + circleRadius) {
      const pull = 1 - Math.min(dist / (radius + circleRadius), 1);
      gsap.to(el, {
        x: dx * strength * pull,
        y: `+=${dy * strength * pull * 0.15}`, // additive to bob
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }
  };

  const onMouseLeave = () => {
    gsap.to(el, {
      x: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.35)',
      overwrite: 'auto',
    });
  };

  return { onMouseMove, onMouseLeave };
}

/* ── React hook ────────────────────────────────────────── */

/**
 * useBuoyantCircles
 * Attach to a container ref whose children `.btn-circle` elements
 * should float buoyantly and react magnetically to the cursor.
 *
 * @param {React.RefObject} containerRef
 */
export function useBuoyantCircles(containerRef) {
  const timelines = useRef([]);
  const handlers = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const circles = container.querySelectorAll('.btn-circle');
    if (!circles.length) return;

    // Performance: hint the browser
    circles.forEach((el) => {
      el.style.willChange = 'transform';
    });

    // Create bob timelines
    circles.forEach((el, i) => {
      const tl = createBobTimeline(el, i);
      timelines.current.push(tl);
    });

    // Create magnetic handlers (bind to window so cursor doesn't need to be *on* circle)
    circles.forEach((el) => {
      const { onMouseMove, onMouseLeave } = createMagneticHandlers(el);
      el.addEventListener('mouseenter', () => {
        window.addEventListener('mousemove', onMouseMove);
      });
      el.addEventListener('mouseleave', () => {
        window.removeEventListener('mousemove', onMouseMove);
        onMouseLeave();
      });
      handlers.current.push({ el, onMouseMove, onMouseLeave });
    });

    // Cleanup
    return () => {
      timelines.current.forEach((tl) => tl.kill());
      timelines.current = [];
      handlers.current.forEach(({ el, onMouseMove }) => {
        window.removeEventListener('mousemove', onMouseMove);
      });
      handlers.current = [];
      circles.forEach((el) => {
        el.style.willChange = '';
        gsap.set(el, { clearProps: 'x,y,rotation' });
      });
    };
  }, [containerRef]);
}

export default useBuoyantCircles;
