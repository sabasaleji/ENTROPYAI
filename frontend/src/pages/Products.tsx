import React from 'react';
import { Boxes } from 'lucide-react';

const Products: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-20 bg-slate-50">
      <div className="text-center px-6">
        <div className="w-20 h-20 bg-entropy-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-entropy-200 shadow-sm">
          <Boxes className="w-10 h-10 text-entropy-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Products</h1>
        <p className="text-xl text-slate-600 max-w-lg mx-auto mb-8">
          We are currently building something extraordinary. Our off-the-shelf AI products will be available soon.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-100 border border-accent-200 text-accent-700 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse"></span>
          In Development
        </div>
      </div>
    </div>
  );
};

export default Products;