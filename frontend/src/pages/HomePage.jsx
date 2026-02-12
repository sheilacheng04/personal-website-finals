import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

function WaterParticlesEffect({ containerRef }) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    container.insertBefore(particlesContainer, container.firstChild);

    const particles = [];
    const particleCount = 50;
    let mouseX = 0;
    let mouseY = 0;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'water-particle';
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 6 + 2;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 10;
      const blur = Math.random() * 3 + 2;
      const opacity = Math.random() * 0.44 + 0.28;

      particle.style.left = `${x}%`;
      particle.style.top = `${y}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      particle.style.filter = `blur(${blur}px)`;
      particle.style.opacity = opacity;
      particle.style.transition = 'transform 0.2s ease-out';
      particle.dataset.baseX = x;
      particle.dataset.baseY = y;

      particlesContainer.appendChild(particle);
      particles.push(particle);
    }

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      mouseY = ((e.clientY - rect.top) / rect.height) * 100;
      particles.forEach((p) => {
        const bx = parseFloat(p.dataset.baseX);
        const by = parseFloat(p.dataset.baseY);
        const dx = mouseX - bx;
        const dy = mouseY - by;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 50) {
          const force = (50 - dist) / 50;
          p.style.transform = `translate(${dx * force * 0.4}%, ${dy * force * 0.4}%)`;
        } else {
          p.style.transform = 'translate(0,0)';
        }
      });
    };

    container.addEventListener('mousemove', onMouseMove);
    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      particlesContainer.remove();
    };
  }, [containerRef]);

  return null;
}

export default function HomePage() {
  const homeRef = useRef(null);

  // jQuery ripple effect
  useEffect(() => {
    const loadRipple = async () => {
      if (!window.jQuery) {
        await new Promise((resolve) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js';
          s.onload = resolve;
          document.head.appendChild(s);
        });
      }
      if (!window.jQuery.fn.ripples) {
        await new Promise((resolve) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/jquery.ripples@0.6.3/dist/jquery.ripples.min.js';
          s.onload = resolve;
          document.head.appendChild(s);
        });
      }
      try {
        const $ = window.jQuery;
        const homePage = $('.home-page');
        if (homePage.length) {
          const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
          homePage.ripples({
            resolution: isMobile ? 128 : 256,
            dropRadius: isMobile ? 15 : 18,
            perturbance: 0.025,
            interactive: true,
          });
        }
      } catch (e) {
        console.error('Ripple init error:', e);
      }
    };
    loadRipple();

    return () => {
      try {
        const $ = window.jQuery;
        if ($ && $('.home-page').data('plugin_ripples')) {
          $('.home-page').ripples('destroy');
        }
      } catch (e) { /* ignore */ }
    };
  }, []);

  // Page transition for links
  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    const overlay = document.querySelector('.page-transition-overlay');
    if (overlay) overlay.classList.add('active');
    setTimeout(() => {
      window.location.href = href;
    }, 600);
  }, []);

  return (
    <div className="home-page" ref={homeRef}>
      <WaterParticlesEffect containerRef={homeRef} />

      <div className="ellipse-design">
        {[1,2,3,4,5,6,7,8,9].map((n) => (
          <div key={n} className={`circle circle-${n}`} />
        ))}
      </div>

      {/* Header */}
      <div className="home-button">
        <img src="/assets/common/Home_button.png" alt="Home" />
      </div>
      <a href="https://www.linkedin.com/in/sheila-nicole-cheng-35982b327/" target="_blank" rel="noopener noreferrer" className="linkedin-icon">
        <img src="/assets/common/Linkedln.png" alt="LinkedIn" />
      </a>
      <a href="mailto:sheilanicoledizon@gmail.com" className="email-icon">
        <img src="/assets/common/Email.png" alt="Email" />
      </a>

      {/* Title */}
      <div className="title-container">
        <div className="title-short">
          <h1 className="title-text">S.CHENG</h1>
        </div>
        <div className="title-full">
          <img src="/assets/home/SheilaNicoleCheng.png" alt="Sheila Nicole Cheng" />
        </div>
      </div>

      {/* Navigation Bubbles */}
      <Link to="/content#posters" className="btn-circle posters-btn">
        <span className="btn-title">Posters</span>
        <span className="btn-description">Vibrant graphics &amp; eye-catching designs</span>
      </Link>
      <Link to="/content#contacts" className="btn-circle contacts-btn">
        <span className="btn-title">Contacts</span>
        <span className="btn-description">Reach out &amp; let's create something amazing</span>
      </Link>
      <Link to="/content#projects" className="btn-circle projects-btn">
        <span className="btn-title">Projects</span>
        <span className="btn-description">Explore my creative journey &amp; portfolio</span>
      </Link>
      <Link to="/content#profile" className="btn-circle profile-btn">
        <span className="btn-title">Profile</span>
        <span className="btn-description">Get to know me &amp; what I'm all about</span>
      </Link>
    </div>
  );
}
