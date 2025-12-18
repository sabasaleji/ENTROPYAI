import React from 'react';
import { Bot, Search, PenTool } from 'lucide-react';

const Products: React.FC = () => {
  const products = [
    {
      name: 'BizzBot',
      icon: Bot,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: "Turn your pdf's into an AI powered chatbot"
    },
    {
      name: 'Researcher',
      icon: Search,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Optimize your research, from idea to insight'
    },
    {
      name: 'Paper and Pen',
      icon: PenTool,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Empowering the ones who once empowered us'
    }
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-20" style={{ background: 'transparent' }}>
      <div className="text-center px-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 gradient-heading">Our Products</h1>
        <p className="text-xl max-w-2xl mx-auto mb-12" style={{ color: 'var(--text-secondary)' }}>
          Discover our suite of AI-powered tools designed to enhance your productivity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <div key={index} className="flex flex-col items-center group">
                <div className={`w-32 h-32 ${product.bgColor} rounded-full flex items-center justify-center border-2 ${product.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden`}>
                  <Icon className={`w-16 h-16 ${product.color.replace('bg-', 'text-')} transition-opacity duration-300 group-hover:opacity-0`} />
                  <div className="absolute inset-0 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm text-slate-700 font-medium text-center leading-tight">
                      {product.description}
                    </p>
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;