import React from 'react';

export const EntropyLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="shardGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" /> {/* Sky Blue */}
        <stop offset="100%" stopColor="#0ea5e9" /> {/* Blue */}
      </linearGradient>
      <linearGradient id="shardGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" /> {/* Indigo */}
        <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet */}
      </linearGradient>
      <linearGradient id="shardGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a855f7" /> {/* Purple */}
        <stop offset="100%" stopColor="#d946ef" /> {/* Fuchsia */}
      </linearGradient>
    </defs>
    
    <g transform="translate(50, 50) scale(0.9)">
       {/* Top Shard */}
       <path d="M0 -50 L25 -25 L0 -10 L-25 -25 Z" fill="url(#shardGradient1)" opacity="0.95" />
       
       {/* Top Right Shard */}
       <path d="M30 -20 L50 10 L25 25 L10 5 Z" fill="#0ea5e9" opacity="0.9" />
       
       {/* Bottom Right Shard */}
       <path d="M50 20 L30 50 L5 30 L20 10 Z" fill="url(#shardGradient2)" opacity="0.95" />
       
       {/* Bottom Shard */}
       <path d="M0 50 L-25 25 L0 10 L25 25 Z" fill="#8b5cf6" opacity="0.9" />
       
       {/* Bottom Left Shard */}
       <path d="M-30 20 L-50 -10 L-25 -25 L-10 -5 Z" fill="url(#shardGradient3)" opacity="0.95" />
       
       {/* Top Left Shard */}
       <path d="M-50 -20 L-30 -50 L-5 -30 L-20 -10 Z" fill="#38bdf8" opacity="0.9" />
       
       {/* Center Accents for depth */}
       <path d="M0 -10 L10 5 L-10 5 Z" fill="#1e293b" opacity="0.1" />
    </g>
  </svg>
);