import React from 'react';
import { History } from 'lucide-react';

const OurStory: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-20" style={{ background: 'transparent' }}>
      <div className="text-center px-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
          <History className="w-10 h-10" style={{ color: 'var(--bg-primary)' }} />
        </div>
        <h1 className="text-4xl font-bold mb-4 gradient-heading">Our Story</h1>
        <p className="text-xl max-w-lg mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
          The journey of Entropy AI from chaos to intelligence.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 border border-slate-300 text-slate-600 text-sm font-medium">
          Coming Soon
        </div>
      </div>
    </div>
  );
};

export default OurStory;