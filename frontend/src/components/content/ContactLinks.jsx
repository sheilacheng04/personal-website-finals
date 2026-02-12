import { useState, useEffect } from 'react';

export default function ContactLinks() {
  const [hue, setHue] = useState(() => parseInt(localStorage.getItem('themeHue') || '200'));
  const DEFAULT_HUE = 200;

  const hslToRgb = (h, s, l) => {
    let r, g, b;
    if (s === 0) { r = g = b = l; } else {
      const hue2rgb = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3); g = hue2rgb(p, q, h); b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  const applyTheme = (h) => {
    const root = document.documentElement;
    if (h == DEFAULT_HUE) {
      root.style.setProperty('--theme-light', '100, 180, 220');
      root.style.setProperty('--theme-medium', '58, 138, 184');
      root.style.setProperty('--theme-dark', '0, 60, 120');
      root.style.setProperty('--theme-very-dark', '5, 18, 45');
      root.style.setProperty('--theme-very-light', '120, 200, 255');
    } else {
      const light = hslToRgb(h / 360, 0.6, 0.63);
      const medium = hslToRgb(h / 360, 0.52, 0.48);
      const dark = hslToRgb(h / 360, 1, 0.24);
      const veryDark = hslToRgb(h / 360, 0.8, 0.10);
      const veryLight = hslToRgb(h / 360, 1, 0.74);
      root.style.setProperty('--theme-light', `${light[0]}, ${light[1]}, ${light[2]}`);
      root.style.setProperty('--theme-medium', `${medium[0]}, ${medium[1]}, ${medium[2]}`);
      root.style.setProperty('--theme-dark', `${dark[0]}, ${dark[1]}, ${dark[2]}`);
      root.style.setProperty('--theme-very-dark', `${veryDark[0]}, ${veryDark[1]}, ${veryDark[2]}`);
      root.style.setProperty('--theme-very-light', `${veryLight[0]}, ${veryLight[1]}, ${veryLight[2]}`);
    }
    root.style.setProperty('--theme-hue', h);
  };

  useEffect(() => { applyTheme(hue); }, [hue]);

  const handleSlider = (e) => {
    const val = parseInt(e.target.value);
    setHue(val);
    localStorage.setItem('themeHue', val);
  };

  const resetTheme = () => {
    setHue(DEFAULT_HUE);
    localStorage.setItem('themeHue', DEFAULT_HUE);
  };

  return (
    <div className="projects-contact-links-container">
      <div className="contact-links-content">
        <h3 className="contact-links-title">Send a message, I don't bite.</h3>
        <div className="contact-links-grid">
          <a href="https://www.linkedin.com/in/sheila-nicole-cheng-35982b327/" target="_blank" rel="noopener noreferrer" className="contact-link-card" title="LinkedIn">
            <div className="contact-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
          </a>
          <a href="https://github.com/sheilacheng04" target="_blank" rel="noopener noreferrer" className="contact-link-card" title="GitHub">
            <div className="contact-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
          </a>
          <a href="mailto:sheilanicoledizon@gmail.com" className="contact-link-card" title="Email">
            <div className="contact-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
          </a>
        </div>

        {/* Theme Picker */}
        <div className="theme-picker-container">
          <label className="theme-picker-label">Customize Colors</label>
          <div className="theme-picker-wrapper">
            <input type="range" min="0" max="360" value={hue} className="theme-color-slider" onChange={handleSlider} />
            <div className="theme-preview-circle" style={{ background: `linear-gradient(135deg, hsl(${hue}, 60%, 63%), hsl(${hue}, 52%, 48%))` }} />
          </div>
          <span className="theme-picker-hint">Slide to change the aquatic hue</span>
          <button className="theme-reset-btn" type="button" onClick={resetTheme}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
