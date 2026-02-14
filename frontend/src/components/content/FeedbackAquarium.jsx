import { useEffect, useRef, useState } from 'react';
import { api } from '../../services/api';

export default function FeedbackAquarium() {
  const containerRef = useRef(null);
  const circlesRef = useRef([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear existing circles when refreshing
    circlesRef.current = [];
    container.innerHTML = '';

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
          data.forEach((fb, index) => createCircle(fb, container, index));
        }
      } catch {
        // Fallback: try direct Supabase
        try {
          const { supabase } = await import('../../services/supabaseClient');
          const { data } = await supabase.from('feedback').select('*').order('created_at', { ascending: false });
          if (data) data.forEach((fb, index) => createCircle(fb, container, index));
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
  }, [refreshTrigger]);

  function createCircle(fb, container, index = 0) {
    const circle = document.createElement('div');
    circle.className = 'feedback-circle';
    
    // Add floating animation with staggered delay
    const animationDelay = (index % 5) * 0.5;
    circle.style.animation = `float ${8 + (index % 3) * 2}s ease-in-out ${animationDelay}s infinite`;
    
    const nameEl = document.createElement('div');
    nameEl.className = 'feedback-circle-name';
    nameEl.textContent = fb.name;
    const msgEl = document.createElement('div');
    msgEl.className = 'feedback-circle-message';
    msgEl.textContent = fb.message;
    circle.appendChild(nameEl);
    circle.appendChild(msgEl);
    
    // Create a "pop" button (X) for each circle
    const popBtn = document.createElement('button');
    popBtn.className = 'feedback-circle-pop';
    popBtn.innerHTML = '×';
    popBtn.title = 'Pop this bubble';
    circle.appendChild(popBtn);
    
    circlesRef.current.push({ element: circle, velocityX: 0, velocityY: 0, feedback: fb });

    // Handle pop (remove circle temporarily and respawn)
    popBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Add pop animation
      circle.style.transition = 'all 0.3s ease';
      circle.style.transform = 'scale(0)';
      circle.style.opacity = '0';
      
      setTimeout(() => {
        circle.remove();
        // Remove from circlesRef
        const idx = circlesRef.current.findIndex(cd => cd.element === circle);
        if (idx > -1) circlesRef.current.splice(idx, 1);
      }, 300);
      
      // Respawn after 3 seconds
      setTimeout(() => {
        if (containerRef.current) {
          createCircle(fb, containerRef.current, index);
        }
      }, 3000);
    });

    // Click to open modal (but not when dragging or popping)
    let clickStartTime = 0;
    circle.addEventListener('mousedown', () => {
      clickStartTime = Date.now();
    });
    
    circle.addEventListener('click', (e) => {
      const clickDuration = Date.now() - clickStartTime;
      if (!circle.classList.contains('dragging') && clickDuration < 200 && e.target !== popBtn) {
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
