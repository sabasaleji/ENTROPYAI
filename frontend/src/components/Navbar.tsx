import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-2xl' : 'py-6'}`} style={{ background: scrolled ? 'rgba(10,10,15,0.95)' : 'rgba(10,10,15,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--glass-dark)' }}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('/')}>
          <img src="/entropy_logo.png" alt="Entropy AI" className="h-10 w-auto object-contain" />
          <span className="text-xl font-bold tracking-tight gradient-heading">ENTROPY AI</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.path)}
              className={`nav-link text-sm font-medium ${isLinkActive(link.path) ? '' : ''}`}
              style={{ color: isLinkActive(link.path) ? 'var(--accent-primary)' : 'var(--text-secondary)' }}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Right Side: Account & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {/* My Account (Desktop) */}
          <button
            onClick={() => handleNavClick('/account')}
            className={`hidden md:flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-white/5 ${location.pathname === '/account' ? 'text-brand-primary' : 'text-brand-muted hover:text-white'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${location.pathname === '/account' ? 'bg-brand-primary/10 border-brand-primary' : 'bg-transparent border-white/20'}`}>
              <User className={`w-5 h-5 ${location.pathname === '/account' ? 'text-brand-primary' : 'text-brand-muted'}`} />
            </div>
            <span className="text-sm font-medium">My Account</span>
          </button>

          {/* Mobile Toggle */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-brand-surface border-b border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-xl">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.path)}
              className={`text-left text-lg font-medium py-2 ${isLinkActive(link.path) ? 'text-brand-primary' : 'text-brand-muted hover:text-white'}`}
            >
              {link.label}
            </button>
          ))}
          <div className="h-px bg-white/10 my-2"></div>
          <button
            onClick={() => handleNavClick('/account')}
            className={`flex items-center gap-3 text-left text-lg font-medium py-2 ${location.pathname === '/account' ? 'text-brand-primary' : 'text-brand-muted hover:text-white'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${location.pathname === '/account' ? 'bg-brand-primary/10 border-brand-primary' : 'bg-transparent border-white/20'}`}>
              <User className={`w-5 h-5 ${location.pathname === '/account' ? 'text-brand-primary' : 'text-brand-muted'}`} />
            </div>
            My Account
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;