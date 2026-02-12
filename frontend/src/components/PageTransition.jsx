import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageTransition() {
  const overlayRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const overlay = overlayRef.current;
    if (overlay) {
      overlay.classList.add('active');
      const timer = setTimeout(() => overlay.classList.remove('active'), 100);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return <div ref={overlayRef} className="page-transition-overlay" />;
}
