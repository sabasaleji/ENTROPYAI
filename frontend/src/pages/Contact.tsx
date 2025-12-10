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
      const response = await fetch('http://localhost:5000/api/send-email', {
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
    <section className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Contact Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
              Let's build the future together
            </h1>
            <p className="text-slate-600 mb-12 text-lg leading-relaxed">
              Ready to integrate AI into your ecosystem? Contact us for a consultation regarding our services or custom development needs.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-5">
                <div className="p-4 bg-white rounded-xl text-entropy-600 border border-slate-200 shadow-sm">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-lg mb-1">Email Us</h4>
                  <a href="mailto:services@entropy-ai.in" className="text-slate-600 hover:text-entropy-600 transition-colors text-lg">
                    services@entropy-ai.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="glass-card p-8 md:p-10 rounded-3xl border border-slate-200 shadow-xl bg-white relative overflow-hidden">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h3>
            
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
                    <label className="block text-sm font-medium text-slate-600 mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:border-entropy-500 focus:outline-none focus:ring-1 focus:ring-entropy-500 transition-colors text-slate-900 placeholder:text-slate-400" 
                      placeholder="Jane"
                      required 
                      disabled={status === 'sending'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:border-entropy-500 focus:outline-none focus:ring-1 focus:ring-entropy-500 transition-colors text-slate-900 placeholder:text-slate-400" 
                      placeholder="Doe" 
                      required
                      disabled={status === 'sending'}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:border-entropy-500 focus:outline-none focus:ring-1 focus:ring-entropy-500 transition-colors text-slate-900 placeholder:text-slate-400" 
                    placeholder="jane@company.com" 
                    required
                    disabled={status === 'sending'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Area of Interest</label>
                  <select 
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:border-entropy-500 focus:outline-none focus:ring-1 focus:ring-entropy-500 transition-colors text-slate-900"
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
                   <label className="block text-sm font-medium text-slate-600 mb-2">Message</label>
                   <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 focus:border-entropy-500 focus:outline-none focus:ring-1 focus:ring-entropy-500 transition-colors h-32 text-slate-900 placeholder:text-slate-400" 
                      placeholder="Tell us about your project..." 
                      required
                      disabled={status === 'sending'}
                   />
                </div>

                {status === 'error' && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                      {errorMessage || 'Something went wrong. Please check your connection or try again.'}
                    </div>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'sending'}
                  className="w-full bg-gradient-to-r from-entropy-600 to-entropy-500 text-white font-bold py-4 rounded-lg hover:from-entropy-700 hover:to-entropy-600 transition-all shadow-lg shadow-entropy-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
  );
};

export default Contact;