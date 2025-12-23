import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    interest: 'General Inquiry',
    message: ''
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

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
    <section className="pt-32 pb-24 min-h-screen" style={{ background: 'transparent' }}>
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">

          {/* Contact Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-heading relative z-10">
              Let's build the future together
            </h1>
            <p className="mb-12 text-lg leading-relaxed relative z-10" style={{ color: 'var(--text-secondary)' }}>
              Ready to integrate AI into your ecosystem? Contact us for a consultation regarding our services or custom development needs.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="p-4 rounded-xl border border-white/10 shadow-sm" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--accent-primary)' }}>
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-1" style={{ color: 'var(--text-primary)' }}>Email Us</h4>
                  <a href="mailto:services@entropy-ai.in" className="transition-colors text-lg hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                    services@entropy-ai.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card p-8 md:p-10 rounded-3xl shadow-xl relative z-10 overflow-hidden">
            <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Send us a message</h3>

            {status === 'success' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-fade-in z-20" style={{ background: 'var(--bg-secondary)', backdropFilter: 'blur(20px)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                  <CheckCircle2 className="w-8 h-8" style={{ color: '#10b981' }} />
                </div>
                <h4 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Message Sent!</h4>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Thank you for reaching out. Our team will review your query and get back to you shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="font-semibold underline transition-colors"
                  style={{ color: 'var(--accent-primary)' }}
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
                  <div className="p-3 rounded-lg text-sm border border-red-500/20" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
                    {errorMessage || 'Something went wrong. Please check your connection or try again.'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="cta-button w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <span>
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;