import { useEffect, useRef } from 'react';
import { api } from '../../services/api';

export default function FeedbackAquarium() {
  const containerRef = useRef(null);
  const circlesRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Physics loop
    const interval = setInterval(() => {
      circlesRef.current.forEach((cd) => {
        if (!cd.velocityX && !cd.velocityY) return;
        cd.velocityX *= 0.92;
        cd.velocityY *= 0.92;
        if (Math.abs(cd.velocityX) < 0.05) cd.velocityX = 0;
        if (Math.abs(cd.velocityY) < 0.05) cd.velocityY = 0;
      });
    }, 30);

    // Load feedback from API (falls back to Supabase direct if API unavailable)
    const loadFeedback = async () => {
      try {
        const data = await api.getFeedback();
        if (Array.isArray(data) && data.length > 0) {
          data.forEach((fb) => createCircle(fb, container));
        }
      } catch {
        // Fallback: try direct Supabase
        try {
          const { supabase } = await import('../../services/supabaseClient');
          const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
          if (data) data.forEach((fb) => createCircle(fb, container));
        } catch (e) {
          console.error('Failed to load feedback:', e);
        }
      }
    };
    loadFeedback();

    // Drag support
    let dragging = null;
    let dragOffset = { x: 0, y: 0 };

    const onDown = (e) => {
      const target = e.target.closest('.feedback-circle');
      if (!target) return;
      e.preventDefault();
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      const rect = target.getBoundingClientRect();
      dragOffset = { x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height / 2 };
      dragging = target;
      target.classList.add('dragging');
    };

    const onMove = (e) => {
      if (!dragging) return;
      e.preventDefault();
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      const cr = container.getBoundingClientRect();
      const dr = dragging.getBoundingClientRect();
      const radius = dr.width / 2;
      let newX = Math.max(radius, Math.min(cr.width - radius, clientX - cr.left - dragOffset.x));
      let newY = Math.max(radius, Math.min(cr.height - radius, clientY - cr.top - dragOffset.y));
      dragging.style.left = newX + 'px';
      dragging.style.top = newY + 'px';
      dragging.style.transform = 'none';
    };

    const onUp = () => {
      if (dragging) {
        dragging.classList.remove('dragging');
        dragging = null;
      }
    };

    container.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    container.addEventListener('touchstart', onDown, { passive: false });
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);

    return () => {
      clearInterval(interval);
      container.removeEventListener('mousedown', onDown);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      container.removeEventListener('touchstart', onDown);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
  }, []);

  function createCircle(fb, container) {
    const circle = document.createElement('div');
    circle.className = 'feedback-circle';
    const nameEl = document.createElement('div');
    nameEl.className = 'feedback-circle-name';
    nameEl.textContent = fb.name;
    const msgEl = document.createElement('div');
    msgEl.className = 'feedback-circle-message';
    msgEl.textContent = fb.message;
    circle.appendChild(nameEl);
    circle.appendChild(msgEl);
    circlesRef.current.push({ element: circle, velocityX: 0, velocityY: 0 });

    circle.addEventListener('click', () => {
      if (!circle.classList.contains('dragging')) {
        const modal = document.createElement('div');
        modal.className = 'feedback-modal';
        modal.innerHTML = `<div class="feedback-modal-content"><button class="feedback-modal-close">&times;</button><h3>${fb.name}</h3><p class="feedback-modal-email">${fb.email}</p><p class="feedback-modal-message">${fb.message}</p></div>`;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
          if (e.target === modal || e.target.classList.contains('feedback-modal-close')) modal.remove();
        });
      }
    });

    container.appendChild(circle);
    circle.style.opacity = '0';
    circle.style.transform = 'scale(0)';
    setTimeout(() => {
      circle.style.transition = 'all 0.5s ease';
      circle.style.opacity = '1';
      circle.style.transform = 'scale(1)';
    }, 100);
  }

  return (
    <div className="feedback-aquarium">
      <div className="glass-seam-left" />
      <div className="glass-seam-right" />
      <div className="glass-seam-bottom-left" />
      <div className="glass-seam-bottom-right" />
      <div className="glass-seam-bottom-center" />
      <div className="feedback-circles-container" ref={containerRef} />
    </div>
  );
}
