import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from '../../services/api';

export default function FeedbackAquarium({ refreshKey }) {
  const containerRef = useRef(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [poppedIds, setPoppedIds] = useState(new Set());
  const [modalFeedback, setModalFeedback] = useState(null);

  // Load feedback from API on mount and when refreshKey changes
  useEffect(() => {
    const loadFeedback = async () => {
      try {
        const data = await api.getFeedback();
        if (Array.isArray(data)) {
          setFeedbacks(data);
        }
      } catch {
        try {
          const { supabase } = await import('../../services/supabaseClient');
          const { data } = await supabase
            .from('feedback')
            .select('*')
            .order('created_at', { ascending: false });
          if (data) setFeedbacks(data);
        } catch (e) {
          console.error('Failed to load feedback:', e);
        }
      }
    };
    loadFeedback();
  }, [refreshKey]);

  // Generate a stable random position for each bubble within bounds
  const getPosition = useCallback((index, total) => {
    const cols = Math.ceil(Math.sqrt(total));
    const row = Math.floor(index / cols);
    const col = index % cols;
    const cellW = 100 / cols;
    const cellH = 100 / Math.ceil(total / cols);
    // Place within cell with some padding (15%-85% within each cell)
    const x = cellW * col + cellW * 0.15 + (cellW * 0.7 * ((index * 7 + 3) % 10)) / 10;
    const y = cellH * row + cellH * 0.15 + (cellH * 0.7 * ((index * 13 + 5) % 10)) / 10;
    return { left: `${Math.min(85, Math.max(5, x))}%`, top: `${Math.min(80, Math.max(5, y))}%` };
  }, []);

  // Pop a bubble: hide it and respawn after 3 seconds
  const handlePop = useCallback((id) => {
    setPoppedIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setPoppedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 3000);
  }, []);

  // Click bubble to pop
  const handleSingleClick = useCallback((id, e) => {
    e.stopPropagation();
    handlePop(id);
  }, [handlePop]);

  // Double-click bubble to show modal
  const handleDoubleClick = useCallback((fb) => {
    setModalFeedback(fb);
  }, []);

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div className="feedback-aquarium">
      <div className="glass-seam-left" />
      <div className="glass-seam-right" />
      <div className="glass-seam-bottom-left" />
      <div className="glass-seam-bottom-right" />
      <div className="glass-seam-bottom-center" />
      <div className="feedback-circles-container" ref={containerRef}>
        {feedbacks.map((fb, index) => {
          const id = fb.id || index;
          const isPopped = poppedIds.has(id);
          const pos = getPosition(index, feedbacks.length);
          const animDuration = 8 + (index % 3) * 2;
          const animDelay = (index % 5) * 0.5;

          return (
            <div
              key={id}
              className="feedback-bubble-wrapper"
              style={{
                position: 'absolute',
                left: pos.left,
                top: pos.top,
                opacity: isPopped ? 0 : 1,
                transform: isPopped ? 'scale(0)' : 'scale(1)',
                transition: 'all 0.3s ease',
                pointerEvents: isPopped ? 'none' : 'all',
                animation: isPopped ? 'none' : `float ${animDuration}s ease-in-out ${animDelay}s infinite`,
              }}
            >
              {/* The circle itself - single click to pop, double click to show details */}
              <div
                className={`feedback-circle ${isMobile ? 'mobile' : ''}`}
                onClick={(e) => handleSingleClick(id, e)}
                onDoubleClick={() => handleDoubleClick(fb)}
              >
                <div className="feedback-circle-name">{fb.name}</div>
                <div className="feedback-circle-message">{fb.message}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feedback Modal */}
      {modalFeedback && (
        <div className="feedback-modal" onClick={() => setModalFeedback(null)}>
          <div className="feedback-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="feedback-modal-close" onClick={() => setModalFeedback(null)}>
              &times;
            </button>
            <h3>{modalFeedback.name}</h3>
            <p className="feedback-modal-email">{modalFeedback.email}</p>
            <p className="feedback-modal-message">{modalFeedback.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
