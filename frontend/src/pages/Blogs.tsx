import React, { useEffect } from 'react';

const Blogs: React.FC = () => {
  useEffect(() => {
    window.location.href = 'https://share.google/A1gHX5fiA2rgblMgp';
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center pt-20 pb-20" style={{ background: 'transparent' }}>
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 gradient-heading">Redirecting to Blogs...</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Please wait while we take you to our external blog page.</p>
      </div>
    </div>
  );
};

export default Blogs;