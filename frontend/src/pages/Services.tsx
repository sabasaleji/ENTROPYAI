import React from 'react';
import SectionHeader from '../components/SectionHeader';
import ServiceCard from '../components/ServiceCard';
import { SERVICES } from '../constants';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-24 bg-slate-50">
      <section className="container mx-auto px-6">
        <SectionHeader 
          title="Our Services" 
          subtitle="Comprehensive AI solutions tailored to optimize, predict, and transform your business operations."
        />
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {SERVICES.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        <div className="flex justify-center">
            <button 
                onClick={() => navigate('/contact')}
                className="bg-gradient-to-r from-entropy-600 to-entropy-500 hover:from-entropy-700 hover:to-entropy-600 text-white px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-entropy-500/20"
            >
                For other services - Contact Us
            </button>
        </div>
      </section>
    </div>
  );
};

export default Services;