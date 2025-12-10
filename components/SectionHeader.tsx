import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  align?: 'left' | 'center';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, align = 'center' }) => {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-entropy-600 to-accent-600 mb-4">
        {title}
      </h2>
      <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};

export default SectionHeader;