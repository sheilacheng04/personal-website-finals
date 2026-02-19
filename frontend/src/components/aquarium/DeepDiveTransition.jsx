/**
 * DeepDiveTransition.jsx
 * ──────────────────────────────────────────────────────────
 * Task 3 — "Deep Dive" page transition.
 *
 * When a nav circle is clicked the entire landing page:
 *   1. Scales UP   (camera diving forward)
 *   2. Blurs OUT   (depth-of-field)
 *   3. Fades to the aquarium-blue overlay
 *
 * After the animation completes, React Router navigates
 * to the target route.
 *
 * Usage:
 *   const triggerDive = useDeepDiveTransition();
 *   <Link onClick={(e) => triggerDive(e, '/content#profile')} …>
 */
import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';

/**
 * useDeepDiveTransition
 *
 * Returns a function `triggerDive(event, targetPath)` that
 * plays the zoom-blur-fade animation and then navigates.
 */
export function useDeepDiveTransition() {
  const navigate = useNavigate();
  const running = useRef(false);

  const triggerDive = useCallback(
    (e, targetPath) => {
      e.preventDefault();
      if (running.current) return;
      running.current = true;

      // ── find the clicked circle and the page wrapper ──
      const circle = e.currentTarget;
      const page = document.querySelector('.home-page');
      if (!page) {
        navigate(targetPath);
        running.current = false;
        return;
      }

      // ── get circle center for transform-origin ──
      const rect = circle.getBoundingClientRect();
      const originX = rect.left + rect.width / 2;
      const originY = rect.top + rect.height / 2;
      page.style.transformOrigin = `${originX}px ${originY}px`;

      // ── Create & append the dive overlay ──
      let overlay = document.querySelector('.deep-dive-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'deep-dive-overlay';
        document.body.appendChild(overlay);
      }

      // ── GSAP timeline ──
      const tl = gsap.timeline({
        onComplete: () => {
          navigate(targetPath);
          // Reset after navigation
          requestAnimationFrame(() => {
            gsap.set(page, { clearProps: 'all' });
            if (overlay) overlay.remove();
            running.current = false;
          });
        },
      });

      // Phase 1: scale up + blur + fade-in overlay
      tl.to(page, {
        scale: 2.8,
        filter: 'blur(24px)',
        opacity: 0.2,
        duration: 0.9,
        ease: 'power3.in',
      });

      tl.to(
        overlay,
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.in',
        },
        '-=0.45' // overlap with scale
      );
    },
    [navigate]
  );

  return triggerDive;
}

export default useDeepDiveTransition;
