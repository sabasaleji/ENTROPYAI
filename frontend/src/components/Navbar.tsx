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
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('/')}>
          <img src="/entropy_logo.png" alt="Entropy AI" className="h-10 w-auto object-contain" />
          <span className="text-xl font-bold tracking-tight text-slate-900">ENTROPY <span className="text-entropy-600">AI</span></span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.path)}
              className={`text-sm font-medium transition-colors ${isLinkActive(link.path) ? 'text-entropy-600' : 'text-slate-600 hover:text-entropy-600'}`}
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
            className={`hidden md:flex items-center gap-2 transition-colors px-3 py-2 rounded-lg hover:bg-slate-100 ${location.pathname === '/account' ? 'text-entropy-600' : 'text-slate-600 hover:text-entropy-600'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${location.pathname === '/account' ? 'bg-entropy-100 border-entropy-300' : 'bg-slate-200 border-slate-300'}`}>
              <User className={`w-5 h-5 ${location.pathname === '/account' ? 'text-entropy-600' : 'text-slate-500'}`} />
            </div>
            <span className="text-sm font-medium">My Account</span>
          </button>

          {/* Mobile Toggle */}
          <button className="md:hidden text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 p-6 flex flex-col gap-4 md:hidden shadow-xl">
           {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.path)}
              className={`text-left text-lg font-medium py-2 ${isLinkActive(link.path) ? 'text-entropy-600' : 'text-slate-600 hover:text-entropy-600'}`}
            >
              {link.label}
            </button>
          ))}
          <div className="h-px bg-slate-100 my-2"></div>
          <button 
            onClick={() => handleNavClick('/account')}
            className={`flex items-center gap-3 text-left text-lg font-medium py-2 ${location.pathname === '/account' ? 'text-entropy-600' : 'text-slate-600 hover:text-entropy-600'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${location.pathname === '/account' ? 'bg-entropy-100 border-entropy-300' : 'bg-slate-200 border-slate-300'}`}>
              <User className={`w-5 h-5 ${location.pathname === '/account' ? 'text-entropy-600' : 'text-slate-500'}`} />
            </div>
            My Account
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;