import React from 'react';
import SectionHeader from '../components/SectionHeader';
import ServiceCard from '../components/ServiceCard';
import { SERVICES } from '../constants';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 pb-24" style={{ background: 'transparent' }}>
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
            className="cta-button"
          >
            <span>For other services - Contact Us</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default Services;