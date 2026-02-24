import { useState } from 'react';
import { Link } from 'react-router-dom';

const skills = [
  { name: 'Web Dev', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { name: 'UI/UX', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg> },
  { name: 'Data Analysis', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
  { name: 'System Design', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg> },
  { name: 'Visual Design', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { name: 'Problem Solving', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> },
];

const accordions = [
  { title: 'Web Development', text: 'I build responsive websites using HTML, CSS, and JavaScript, from scratch and with intention.' },
  { title: 'UI / UX Design', text: 'I design interfaces that feel smooth, intuitive, and not stressful to look at.' },
  { title: 'Python Applications', text: 'I create functional Python systems, from desktop apps to logic-based tools.' },
  { title: 'Illustrations', text: 'Very selective. Aquatic approval required.' },
];

export default function ProfileSection() {
  const [activeAccordion, setActiveAccordion] = useState(null);

  const toggleAccordion = (i) => {
    setActiveAccordion(activeAccordion === i ? null : i);
  };

  return (
    <section id="profile" className="section profile-section">
      <div className="profile-container">
        <div className="profile-header">
          <h2 className="profile-greeting">Hi! I'm</h2>
          <h1 className="profile-name">Sheila Nicole Cheng</h1>
        </div>

        <div className="profile-grid">
          {/* Box 1: Description */}
          <div className="profile-box box-1">
            <div className="box-content">
              <p className="description-text">
                I work across coding, design, and project coordination creating solutions that are both functional and visually refined. Comfortable below the surface, effective above it
              </p>
              <p className="quote-text">"Debugging ideas before they become problems."</p>
            </div>
          </div>

          {/* Box 2: Skills */}
          <div className="profile-box box-2">
            <div className="skills-grid">
              {skills.map((s) => (
                <div className="skill-item" key={s.name}>
                  <span className="skill-icon">{s.icon}</span>
                  <span className="skill-name">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Box 3: Resources */}
          <div className="profile-box box-3">
            <div className="box-content-small">
              <Link to="/resources" className="box-link resources-link">
                <span className="resource-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </span>
                <h3 className="box-title">Resources</h3>
              </Link>
            </div>
          </div>

          {/* Box 4: CV */}
          <div className="profile-box box-4">
            <div className="box-content-small cv-box">
              <a href="/assets/profile/Cheng_CV (1).pdf" target="_blank" rel="noopener noreferrer" className="cv-link">
                <span className="cv-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </span>
                <span className="cv-text">Explore my CV</span>
              </a>
            </div>
          </div>

          {/* Box Photobooth */}
          <div className="profile-box box-photobooth">
            <div className="box-content-small photobooth-box">
              <a href="https://photobooth-eight-olive.vercel.app/" target="_blank" rel="noopener noreferrer" className="photobooth-link">
                <span className="photobooth-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </span>
                <span className="photobooth-text">Photobooth</span>
              </a>
            </div>
          </div>

          {/* Accordions */}
          {accordions.map((acc, i) => (
            <div className={`profile-box accordion-box box-${i + 5}${activeAccordion === i ? ' active' : ''}`} key={acc.title}>
              <button className="accordion-header" onClick={() => toggleAccordion(i)}>
                <span className="accordion-title">{acc.title}</span>
                <span className="accordion-icon">{activeAccordion === i ? '−' : '+'}</span>
              </button>
              <div className="accordion-content">
                <p>{acc.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
