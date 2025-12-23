import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import ServiceCard from '../components/ServiceCard';
import { SERVICES } from '../constants';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interest: 'General Inquiry',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/contact');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      // Attempt to send data to the backend
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          interest: 'General Inquiry',
          message: ''
        });
      } else {
        // Try to parse error message from backend
        try {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Failed to send email. Please try again.');
        } catch {
          setErrorMessage('Failed to send email. Please check your connection or try again later.');
        }
        setStatus('error');
      }
    } catch (error) {
      // Network error - backend might not be running
      console.error('Network error:', error);
      setErrorMessage('Cannot connect to server. Please make sure the backend server is running on port 5000.');
      setStatus('error');
    }
  };

  return (
    <>
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex items-center min-h-[80vh] bg-transparent">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-secondary/20 rounded-full blur-[100px] -z-10" />

        <div className="container mx-auto px-6 text-center z-10">
          <div className="launch-badge mb-8">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)' }}></span>
            The Future of Intelligence is Here
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight gradient-heading">
            Order from <br />
            Digital Chaos
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Entropy AI empowers enterprises to harness the power of artificial intelligence. From predictive analytics to custom neural networks, we build the systems that drive tomorrow's decisions.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-transparent relative">
        <div className="container mx-auto px-6">
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
              onClick={scrollToContact}
              className="cta-button text-white px-8 py-4 rounded-lg font-bold transition-all flex items-center gap-2"
            >
              For other services - Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-24 bg-transparent relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">

            {/* Contact Info */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Let's build the future together
              </h2>
              <p className="text-brand-muted mb-12 text-lg leading-relaxed">
                Ready to integrate AI into your ecosystem? Contact us for a consultation regarding our services or custom development needs.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="p-4 bg-brand-surface rounded-xl text-brand-primary border border-white/10 shadow-sm">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg mb-1">Email Us</h4>
                    <a href="mailto:services@entropy-ai.in" className="text-brand-muted hover:text-brand-primary transition-colors text-lg">
                      services@entropy-ai.in
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl bg-brand-surface/50 relative overflow-hidden backdrop-blur-xl">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>

              {status === 'success' ? (
                <div className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-center animate-fade-in z-20">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h4>
                  <p className="text-slate-600 mb-6">
                    Thank you for reaching out. Our team will review your query and get back to you shortly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="text-entropy-600 font-semibold hover:text-entropy-700 underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="input-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Jane"
                        required
                        disabled={status === 'sending'}
                      />
                    </div>
                    <div>
                      <label className="input-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Doe"
                        required
                        disabled={status === 'sending'}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="input-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="jane@company.com"
                      required
                      disabled={status === 'sending'}
                    />
                  </div>

                  <div>
                    <label className="input-label">Area of Interest</label>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="input-field"
                      disabled={status === 'sending'}
                    >
                      <option>General Inquiry</option>
                      <option>Custom Chatbots</option>
                      <option>Predictive Analytics</option>
                      <option>AI Consulting</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="input-label">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="input-field h-32"
                      placeholder="Tell us about your project..."
                      required
                      disabled={status === 'sending'}
                    />
                  </div>

                  {status === 'error' && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                      {errorMessage || 'Something went wrong. Please try again or email us directly at services@entropy-ai.in'}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="cta-button w-full text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Home;