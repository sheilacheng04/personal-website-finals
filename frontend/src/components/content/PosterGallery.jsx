import { useEffect, useRef, useState, useCallback } from 'react';

const posters = [
  { id: 1, src: '/assets/posters/blue_ink_poster.png', title: 'Blue Ink', caption: 'An abstract exploration of fluid ink patterns in deep blue hues.' },
  { id: 2, src: '/assets/posters/cross_the_bridge.png', title: 'Cross the Bridge', caption: 'A symbolic journey across boundaries and transitions.' },
  { id: 3, src: '/assets/posters/nature collage.png', title: 'Nature Collage', caption: 'A harmonious blend of natural elements and textures.' },
  { id: 4, src: '/assets/posters/Observe.png', title: 'Observe', caption: 'A contemplative piece encouraging mindful observation.' },
  { id: 5, src: '/assets/posters/Past_life.png', title: 'Past Life', caption: 'Reflections on memories and experiences from another time.' },
  { id: 6, src: '/assets/posters/Universe.png', title: 'Universe', caption: 'A cosmic representation of infinite possibilities.' },
  { id: 7, src: '/assets/posters/Wings of Vigil.png', title: 'Wings of Vigil', caption: 'Guardian spirits watching over with protective grace.' },
];

export default function PosterGallery() {
  const gridRef = useRef(null);
  const containerRef = useRef(null);
  const [lightbox, setLightbox] = useState(null);
  const indexRef = useRef(7); // start at cloned beginning offset
  const intervalRef = useRef(null);
  const transitioning = useRef(false);

  // Clone posters for infinite scroll
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    // Already has children from render, add clones
    const originals = Array.from(grid.children);
    // Clone at end
    originals.forEach((el) => {
      const clone = el.cloneNode(true);
      grid.appendChild(clone);
    });
    // Clone at beginning (reversed)
    [...originals].reverse().forEach((el) => {
      const clone = el.cloneNode(true);
      grid.insertBefore(clone, grid.firstChild);
    });

    // Initial offset
    const cardW = 155;
    indexRef.current = originals.length;
    grid.style.transform = `translateX(-${indexRef.current * cardW}px)`;

    // Click handlers on clones
    grid.querySelectorAll('.poster-card').forEach((card) => {
      card.addEventListener('click', () => {
        const posterId = parseInt(card.dataset.poster);
        const poster = posters.find((p) => p.id === posterId);
        if (poster) setLightbox(poster);
      });
    });
  }, []);

  const moveNext = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    const grid = gridRef.current;
    indexRef.current++;
    const cardW = 155;
    grid.style.transition = 'transform 0.4s ease';
    grid.style.transform = `translateX(-${indexRef.current * cardW}px)`;

    setTimeout(() => {
      if (indexRef.current >= posters.length * 2) {
        grid.style.transition = 'none';
        indexRef.current = posters.length;
        grid.style.transform = `translateX(-${indexRef.current * cardW}px)`;
        setTimeout(() => { grid.style.transition = 'transform 0.4s ease'; }, 50);
      }
      transitioning.current = false;
    }, 400);
  }, []);

  const movePrev = useCallback(() => {
    if (transitioning.current) return;
    transitioning.current = true;
    const grid = gridRef.current;
    indexRef.current--;
    const cardW = 155;
    grid.style.transition = 'transform 0.4s ease';
    grid.style.transform = `translateX(-${indexRef.current * cardW}px)`;

    setTimeout(() => {
      if (indexRef.current < posters.length) {
        grid.style.transition = 'none';
        indexRef.current = posters.length * 2 - 1;
        grid.style.transform = `translateX(-${indexRef.current * cardW}px)`;
        setTimeout(() => { grid.style.transition = 'transform 0.4s ease'; }, 50);
      }
      transitioning.current = false;
    }, 400);
  }, []);

  // Auto-scroll
  useEffect(() => {
    intervalRef.current = setInterval(moveNext, 2000);
    return () => clearInterval(intervalRef.current);
  }, [moveNext]);

  const pause = () => clearInterval(intervalRef.current);
  const resume = () => { intervalRef.current = setInterval(moveNext, 2000); };

  return (
    <div className="poster-gallery">
      <h2 className="poster-gallery-title">Posters</h2>
      <div className="poster-gallery-wrapper">
        <button className="poster-nav-btn poster-nav-prev" aria-label="Previous posters" onClick={movePrev}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>

        <div className="poster-grid-container" ref={containerRef} onMouseEnter={pause} onMouseLeave={resume}>
          <div className="poster-grid" ref={gridRef}>
            {posters.map((p) => (
              <div className="poster-card" data-poster={p.id} key={p.id} onClick={() => setLightbox(p)}>
                <div className="poster-thumbnail">
                  <img src={p.src} alt={p.title} className="poster-image" />
                </div>
                <p className="poster-title">{p.title}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="poster-nav-btn poster-nav-next" aria-label="Next posters" onClick={moveNext}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="poster-lightbox" onClick={(e) => { if (e.target.classList.contains('poster-lightbox')) setLightbox(null); }}>
          <div className="poster-lightbox-content">
            <button className="poster-lightbox-close" onClick={() => setLightbox(null)}>&times;</button>
            <div className="poster-lightbox-image-container">
              <img src={lightbox.src} alt={lightbox.title} className="poster-lightbox-image" />
            </div>
            <div className="poster-lightbox-info">
              <h3 className="poster-lightbox-title">{lightbox.title}</h3>
              <p className="poster-lightbox-description">{lightbox.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
