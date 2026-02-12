import { Link } from 'react-router-dom';

export default function FixedHeader() {
  return (
    <header className="fixed-header">
      <Link to="/" className="header-home-btn">
        <img src="/assets/common/Home_button.png" alt="Home" />
      </Link>
      <button
        className="burger-menu"
        id="burgerMenu"
        onClick={() => document.getElementById('overlayMenu')?.classList.add('active')}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </header>
  );
}
