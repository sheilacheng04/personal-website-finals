import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function OverlayMenu() {
  useEffect(() => {
    const close = (e) => {
      if (e.key === 'Escape') {
        document.getElementById('overlayMenu')?.classList.remove('active');
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);

  const closeMenu = () => {
    document.getElementById('overlayMenu')?.classList.remove('active');
  };

  const scrollTo = (hash) => {
    closeMenu();
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="overlay-menu" id="overlayMenu">
      <button className="close-overlay" onClick={closeMenu}>&times;</button>
      <nav className="overlay-nav">
        <a href="#profile" className="overlay-link" onClick={() => scrollTo('#profile')}>Profile</a>
        <a href="#projects" className="overlay-link" onClick={() => scrollTo('#projects')}>Projects</a>
        <a href="#posters" className="overlay-link" onClick={() => scrollTo('#posters')}>Posters</a>
        <a href="#contacts" className="overlay-link" onClick={() => scrollTo('#contacts')}>Contacts</a>
        <Link to="/resources" className="overlay-link" onClick={closeMenu}>Resources</Link>
      </nav>
    </div>
  );
}
