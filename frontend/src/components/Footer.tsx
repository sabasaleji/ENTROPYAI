import React from 'react';
import { Instagram, Facebook, Linkedin, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="py-12" style={{ background: 'var(--bg-primary)', borderTop: '1px solid var(--glass-dark)' }}>
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">

          {/* Logo & Links */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex items-center gap-3">
              <img src="/entropy_logo.png" alt="Entropy AI" className="h-8 w-auto object-contain" />
              <span className="font-bold gradient-heading">Entropy AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              <button onClick={() => navigate('/our-story')} className="nav-link">Our Story</button>
              {/* <button onClick={() => navigate('/newsletter')} className="nav-link">Newsletter</button> */}
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm text-center md:text-right" style={{ color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} Entropy AI. All rights reserved.
          </div>

          {/* Socials */}
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-entropy-600 transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-entropy-600 transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-entropy-600 transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-slate-400 hover:text-entropy-600 transition-colors"><Youtube className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;