import React from 'react';
import { Service } from '../types';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="glass-card p-8 rounded-2xl hover:border-entropy-300 transition-all duration-300 group h-full flex flex-col bg-white shadow-sm hover:shadow-md">
      <div className="w-14 h-14 rounded-lg bg-entropy-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-entropy-200">
        <service.icon className="w-7 h-7 text-entropy-600" />
      </div>
      
      <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
      <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
        {service.description}
      </p>

      <div className="space-y-3 mt-auto">
        {service.details.map((detail, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-entropy-500 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-slate-600">{detail.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCard;