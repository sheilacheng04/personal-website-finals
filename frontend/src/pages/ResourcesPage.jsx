import { Link } from 'react-router-dom';
import '../styles/resources.css';

const resources = [
  {
    category: 'Development',
    items: [
      { name: 'Vue.js 3', desc: 'Progressive JavaScript Framework', icon: '🖥️', href: 'https://vuejs.org/' },
      { name: 'unpkg', desc: 'Fast, global CDN for npm packages', icon: '📦', href: 'https://unpkg.com/' },
      { name: 'W3Schools', desc: 'Web development tutorials and reference', icon: '📚', href: 'https://www.w3schools.com/' },
    ],
  },
  {
    category: 'Design',
    items: [
      { name: 'Canva', desc: 'Graphic design and visual content', icon: '🎨', href: 'https://www.canva.com/' },
      { name: 'Figma', desc: 'UI/UX design and prototyping', icon: '🎯', href: 'https://www.figma.com/' },
    ],
  },
  {
    category: 'AI Assistance',
    items: [
      { name: 'GitHub Copilot', desc: 'AI-powered code completion', icon: '🤖', href: 'https://github.com/features/copilot' },
      { name: 'ChatGPT', desc: 'AI assistant for problem solving', icon: '💬', href: 'https://chatgpt.com/' },
    ],
  },
  {
    category: 'Media & Assets',
    items: [
      { name: 'Images & Decorative Elements', desc: 'Visual assets and graphics', icon: '🖼️', href: 'https://ph.pinterest.com/' },
      { name: 'Video', desc: 'Video content and animations', icon: '🎬', href: 'https://www.youtube.com/' },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="resources-page">
      <div className="resources-container">
        <h1 className="resources-title">Resources</h1>
        <p className="resources-subtitle">Tools and technologies used to create this portfolio</p>

        <div className="resources-grid">
          {resources.map((cat) => (
            <div className="resource-category" key={cat.category}>
              <h2 className="category-title">{cat.category}</h2>
              <div className="resource-list">
                {cat.items.map((item) => (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="resource-item" key={item.name}>
                    <div className="resource-icon">{item.icon}</div>
                    <div className="resource-info">
                      <h3>{item.name}</h3>
                      <p>{item.desc}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Link to="/" className="back-home-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
