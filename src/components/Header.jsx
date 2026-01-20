import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="nav">
          <Link to="/" className="logo">
            <span className="logo-icon">🏥</span>
            <span className="logo-text">Arovia</span>
          </Link>

          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <li><a onClick={() => scrollToSection('home')}>Home</a></li>
            <li><a onClick={() => scrollToSection('mission')}>Mission</a></li>
            <li><a onClick={() => scrollToSection('features')}>Features</a></li>
            <li><a onClick={() => scrollToSection('how-it-works')}>How It Works</a></li>
            <li><a onClick={() => scrollToSection('testimonials')}>Testimonials</a></li>
          </ul>

          <Link to="/login" className="btn btn-primary btn-auth">
            Login / Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
