import { useEffect, useRef, useState } from 'react';
import PosterGallery from './PosterGallery';
import ContactLinks from './ContactLinks';
import FeedbackAquarium from './FeedbackAquarium';
import FeedbackForm from './FeedbackForm';

const projectData = [
  {
    icon: '/assets/logo/VisiTrack_logo.png',
    title: 'VisiTrack',
    description: 'A visitor tracking system designed to organize entries, exits, and records efficiently.',
    fullDescription: 'VisiTrack helps manage visitor data by recording entries in a structured and reliable way. It focuses on accuracy, accountability, and ease of use, making manual tracking less chaotic.',
    tech: ['Outsystems'],
    features: ['Visitor logging system', 'Organized record management', 'Simple and clean interface', 'Error-reducing input flow'],
  },
  {
    icon: '/assets/logo/Contextufile_logo.png',
    title: 'ContextuFile',
    description: 'An intelligent file organization system that understands what your files are about.',
    fullDescription: "ContextuFile uses contextual meaning from file titles to automatically organize files into folders. Instead of manual sorting, the system analyzes keywords and intent to reduce clutter.",
    tech: ['Python', 'spaCy', 'HTML', 'JavaScript', 'CSS'],
    features: ['Context-based file classification', 'Automated folder organization', 'NLP-powered logic', 'Scalable system design'],
  },
  {
    icon: '/assets/logo/ArisePH_logo.png',
    title: 'ARISE PH Database',
    description: 'A centralized database system designed for structured data management.',
    fullDescription: 'ARISE PH Database focuses on data integrity, organization, and efficient retrieval. It was designed to support real-world use cases that require reliable records and reporting.',
    tech: ['Workbook', 'Frappe'],
    features: ['Centralized data storage', 'Structured relationships', 'Secure and consistent records', 'Query-based reporting'],
  },
  {
    icon: '/assets/logo/Portfolio_logo.png',
    title: 'Web Portfolio (Yes, This One)',
    description: 'A fully personalized portfolio built from scratch—no templates, just vibes.',
    fullDescription: 'This website was designed and coded to reflect my personality, interests, and skills. Inspired by underwater glass aesthetics, it focuses on smooth motion, playful interactions, and clarity.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    features: ['Custom design from scratch', 'Interactive animations', 'Responsive layout', 'Themed UI experience'],
  },
];

export default function ProjectsSection() {
  const sliderRef = useRef(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // 3D Carousel animation
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let currentRotation = 0;
    let isManual = false;
    let isPaused = false;
    let resumeTimer = null;
    let animId = null;
    let lastTs = performance.now();
    const speed = 360 / 25000;
    const step = 360 / 4;

    function animate() {
      if (isManual || isPaused) return;
      const now = performance.now();
      currentRotation += (now - lastTs) * speed;
      lastTs = now;
      slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`;
      animId = requestAnimationFrame(animate);
    }

    function pause() {
      slider.style.animation = 'none';
      isManual = true;
      if (animId) cancelAnimationFrame(animId);
    }

    function resume() {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        isManual = false;
        lastTs = performance.now();
        animate();
      }, 2000);
    }

    animate();

    // Drag
    let isDrag = false, startX = 0, startRot = 0;
    const onDown = (e) => { isDrag = true; startX = e.clientX; startRot = currentRotation; pause(); slider.style.cursor = 'grabbing'; };
    const onMove = (e) => { if (!isDrag) return; currentRotation = startRot + (e.clientX - startX) * 0.1; slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`; };
    const onUp = () => { if (isDrag) { isDrag = false; slider.style.cursor = 'grab'; resume(); } };

    slider.addEventListener('mousedown', onDown);
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);

    // Touch
    let touchStartX = 0, touchStartRot = 0;
    const onTouchStart = (e) => { touchStartX = e.touches[0].clientX; touchStartRot = currentRotation; pause(); };
    const onTouchMove = (e) => { currentRotation = touchStartRot + (e.touches[0].clientX - touchStartX) * 0.1; slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`; };
    const onTouchEnd = () => resume();

    slider.addEventListener('touchstart', onTouchStart);
    slider.addEventListener('touchmove', onTouchMove);
    slider.addEventListener('touchend', onTouchEnd);

    // Keys
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') { pause(); currentRotation -= step; slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`; resume(); }
      if (e.key === 'ArrowRight') { pause(); currentRotation += step; slider.style.transform = `perspective(1200px) rotateX(-16deg) rotateY(${currentRotation}deg)`; resume(); }
    };
    document.addEventListener('keydown', onKey);

    slider.style.cursor = 'grab';

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resumeTimer);
      slider.removeEventListener('mousedown', onDown);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      slider.removeEventListener('touchstart', onTouchStart);
      slider.removeEventListener('touchmove', onTouchMove);
      slider.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <section id="projects" className="section projects-section">
      <div className="projects-banner">
        <div className="projects-containers-wrapper">
          {/* 3D Carousel */}
          <div className="projects-carousel-container">
            <h2 className="projects-section-title">Projects</h2>
            <div className="projects-slider" style={{ '--quantity': 4 }} ref={sliderRef}>
              {projectData.map((p, i) => (
                <div className="project-item" style={{ '--position': i + 1 }} key={p.title}>
                  <div className="project-box" onClick={() => setSelectedProject(i)} style={{ cursor: 'pointer' }}>
                    <div className="project-icon"><img src={p.icon} alt={p.title} /></div>
                    <h3 className="project-title">{p.title}</h3>
                    <p className="project-description">{p.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Poster Gallery */}
          <div className="projects-fourth-container" id="posters">
            <PosterGallery />
          </div>

          {/* Project Detail View */}
          <div className="projects-second-container">
            <div className="project-detail-view" id="projectDetailView">
              {selectedProject !== null ? (
                <div className="project-detail-content">
                  <div className="detail-icon">
                    <img src={projectData[selectedProject].icon} alt={projectData[selectedProject].title} />
                  </div>
                  <h2 className="detail-title">{projectData[selectedProject].title}</h2>
                  <p className="detail-description">{projectData[selectedProject].fullDescription}</p>
                  <div className="detail-tech">
                    {projectData[selectedProject].tech.map((t) => <span className="tech-badge" key={t}>{t}</span>)}
                  </div>
                  <div className="detail-features">
                    <h3>Key Features:</h3>
                    <ul className="detail-features-list">
                      {projectData[selectedProject].features.map((f) => <li key={f}>{f}</li>)}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="project-detail-placeholder">
                  <p>Click a project to view details</p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Links */}
          <ContactLinks />

          {/* Third container: Aquarium + Form */}
          <div className="projects-third-container">
            <FeedbackAquarium />
            <div className="projects-contacts-container" id="contacts">
              <FeedbackForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
