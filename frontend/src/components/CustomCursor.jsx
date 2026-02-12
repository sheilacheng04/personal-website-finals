import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.display = 'block';
    document.body.appendChild(cursor);

    const onMove = (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    };

    const addInteractiveListeners = () => {
      const elements = document.querySelectorAll(
        'a, button, .btn-circle, .poster-card, .project-item, .fish, .zoom-btn, .contact-link-card, .resource-item, input, textarea'
      );
      elements.forEach((el) => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });
    };

    addInteractiveListeners();
    const observer = new MutationObserver(addInteractiveListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', () => cursor.classList.add('grab'));
    document.addEventListener('mouseup', () => cursor.classList.remove('grab'));
    document.addEventListener('mouseleave', () => (cursor.style.opacity = '0'));
    document.addEventListener('mouseenter', () => (cursor.style.opacity = '1'));

    return () => {
      document.removeEventListener('mousemove', onMove);
      observer.disconnect();
      cursor.remove();
    };
  }, []);

  return null;
}
