import React from 'react';
import { BookOpen } from 'lucide-react';

const Blogs: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-20 bg-slate-50">
      <div className="text-center px-6">
        <div className="w-20 h-20 bg-entropy-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-entropy-200 shadow-sm">
          <BookOpen className="w-10 h-10 text-entropy-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Insights & Blogs</h1>
        <p className="text-xl text-slate-600 max-w-lg mx-auto mb-8">
          Our team is compiling the latest research and case studies on Artificial Intelligence. Check back soon.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200 border border-slate-300 text-slate-600 text-sm font-medium">
          Coming Soon
        </div>
      </div>
    </div>
  );
};

export default Blogs;