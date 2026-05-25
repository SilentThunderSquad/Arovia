import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@shared/hooks/useAuth';
import { getDashboardPath } from '@shared/utils/roleRoutes';
import '@features/landing/styles/landing.css';

/**
 * Header — Session-aware landing page navigation
 * 
 * ARCHITECTURE GUARANTEE:
 *   By the time this component renders, the AppBootstrapGate has ALREADY
 *   resolved auth state. Therefore `state` is always a terminal value.
 * 
 * Behavior:
 *   Authenticated → "Go to Dashboard" button (role-aware destination)
 *   Unauthenticated → "Login / Register" button
 * 
 * Updates instantly on login/logout without page refresh.
 */
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state, role } = useAuth();

  // Auth is guaranteed resolved by bootstrap gate
  const isLoggedIn = state === 'authenticated';
  const dashboardPath = getDashboardPath(role);

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
            <li className="mobile-only">
              {isLoggedIn ? (
                <Link to={dashboardPath} className="btn btn-primary btn-auth">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/login" className="btn btn-primary btn-auth">
                  Login / Register
                </Link>
              )}
            </li>
          </ul>

          {isLoggedIn ? (
            <Link to={dashboardPath} className="btn btn-primary btn-auth desktop-only">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary btn-auth desktop-only">
              Login / Register
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
