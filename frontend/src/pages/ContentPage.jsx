import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/content.css';
import FixedHeader from '../components/content/FixedHeader';
import OverlayMenu from '../components/content/OverlayMenu';
import ContentParticles from '../components/content/ContentParticles';
import ProfileSection from '../components/content/ProfileSection';
import ProjectsSection from '../components/content/ProjectsSection';
import BackToTop from '../components/content/BackToTop';
import CreditsFooter from '../components/content/CreditsFooter';

export default function ContentPage() {
  const location = useLocation();
  const pageRef = useRef(null);

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location]);

  // Initialize FinisherHeader particles
  useEffect(() => {
    const loadFinisher = async () => {
      if (!window.FinisherHeader) {
        await new Promise((resolve) => {
          const s = document.createElement('script');
          s.src = 'https://unpkg.com/finisher-header/dist/finisher-header.es5.min.js';
          s.onload = resolve;
          document.head.appendChild(s);
        });
      }
      try {
        new window.FinisherHeader({
          count: 30,
          size: { min: 2, max: 8, pulse: 0.5 },
          speed: { x: { min: 0.1, max: 0.4 }, y: { min: 0.1, max: 0.4 } },
          colors: {
            background: 'transparent',
            particles: ['#64b4dc', '#3a8ab8', '#4e96c8', '#5aa4d0', '#ffffff'],
          },
          blending: 'overlay',
          opacity: { center: 0.6, edge: 0.3 },
          skew: -2,
          shapes: ['c'],
        });
      } catch (e) {
        console.error('FinisherHeader init error:', e);
      }
    };
    loadFinisher();
  }, []);

  // Scroll-driven animations (IntersectionObserver)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const animConfigs = {
      'profile-box': { animation: 'fadeInScale', duration: 800, stagger: 150, threshold: 0.2 },
      carousel: { animation: 'slideInFromRight', duration: 1000, threshold: 0.15 },
      'contact-links': { animation: 'fadeInUp', duration: 900, threshold: 0.2 },
      'feedback-aquarium': { animation: 'fadeInScaleRotate', duration: 1200, threshold: 0.1 },
      contacts: { animation: 'slideInFromLeft', duration: 900, threshold: 0.2 },
      'poster-gallery': { animation: 'fadeInUp', duration: 1000, threshold: 0.1 },
    };

    const animate = (el, config) => {
      const dur = config.duration || 800;
      const idx = parseInt(el.dataset.staggerIndex) || 0;
      const delay = idx * (config.stagger || 0);
      setTimeout(() => {
        el.style.transition = `all ${dur}ms cubic-bezier(0.16, 1, 0.3, 1)`;
        el.style.opacity = '1';
        el.style.transform = 'none';
      }, delay);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const t = entry.target;
          const cfg = animConfigs[t.dataset.animationType] || {};
          if (entry.isIntersecting && entry.intersectionRatio >= (cfg.threshold || 0.2)) {
            if (!t.classList.contains('animated')) {
              animate(t, cfg);
              t.classList.add('animated');
            }
          }
        });
      },
      {
        rootMargin: isMobile ? '-10% 0px -10% 0px' : '-15% 0px -15% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.5],
      }
    );

    // Observe profile boxes
    document.querySelectorAll('.profile-box').forEach((box, i) => {
      box.dataset.animationType = 'profile-box';
      box.dataset.staggerIndex = i;
      box.style.opacity = '0';
      box.style.transform = 'scale(0.8) translateY(40px)';
      observer.observe(box);
    });

    // Observe other containers
    const selectors = [
      ['.projects-carousel-container', 'carousel', 'translateX(100px)'],
      ['.projects-contact-links-container', 'contact-links', 'translateY(50px)'],
      ['.feedback-aquarium', 'feedback-aquarium', 'scale(0.85) rotateX(10deg)'],
      ['.projects-contacts-container', 'contacts', 'translateX(-80px)'],
      ['.poster-gallery', 'poster-gallery', 'translateY(60px)'],
    ];
    selectors.forEach(([sel, type, xform]) => {
      const el = document.querySelector(sel);
      if (el) {
        el.dataset.animationType = type;
        el.style.opacity = '0';
        el.style.transform = xform;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="finisher-header" />
      <FixedHeader />
      <OverlayMenu />

      {/* Floating Ocean Particles */}
      <ContentParticles />

      <main className="content-page" ref={pageRef}>
        <ProfileSection />
        <ProjectsSection />
        <BackToTop />
        <CreditsFooter />
      </main>
    </>
  );
}
