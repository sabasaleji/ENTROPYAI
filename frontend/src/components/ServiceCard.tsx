import React from 'react';
import { Service } from '../types';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  return (
    <div className="glass-card service-card p-8 rounded-2xl h-full flex flex-col">
      <div className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
        <service.icon className="w-7 h-7" style={{ color: 'var(--bg-primary)' }} />
      </div>

      <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{service.title}</h3>
      <p className="mb-6 leading-relaxed flex-grow" style={{ color: 'var(--text-secondary)' }}>
        {service.description}
      </p>

      <div className="space-y-3 mt-auto">
        {service.details.map((detail, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{detail.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCard;