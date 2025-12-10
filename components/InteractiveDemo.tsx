import React, { useState } from 'react';
import { generateBusinessInsight } from '../services/geminiService';
import { Sparkles, ArrowRight, Loader2, BrainCircuit } from 'lucide-react';

const InteractiveDemo: React.FC = () => {
  const [industry, setIndustry] = useState('');
  const [challenge, setChallenge] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!industry || !challenge) return;

    setLoading(true);
    setResult(null);

    const response = await generateBusinessInsight(industry, challenge);
    
    setResult(response.text);
    setLoading(false);
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-accent-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="glass-card rounded-3xl p-8 md:p-12 max-w-5xl mx-auto border-t border-entropy-500/20 shadow-2xl shadow-entropy-900/20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left Column: Input */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-accent-500/10 rounded-lg">
                  <BrainCircuit className="w-6 h-6 text-accent-500" />
                </div>
                <h3 className="text-2xl font-bold text-white">Live Intelligence Demo</h3>
              </div>
              <p className="text-slate-400 mb-8">
                See how our AI models think. Enter your industry and a current challenge to receive an instant strategic micro-consultation.
              </p>

              <form onSubmit={handleAnalyze} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Retail, Healthcare, Logistics"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-entropy-500 focus:ring-1 focus:ring-entropy-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Current Challenge
                  </label>
                  <input
                    type="text"
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    placeholder="e.g. High customer churn, inventory management"
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-entropy-500 focus:ring-1 focus:ring-entropy-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !industry || !challenge}
                  className="w-full mt-4 bg-gradient-to-r from-entropy-600 to-accent-600 hover:from-entropy-500 hover:to-accent-500 text-white font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-entropy-900/50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Insight
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Right Column: Output */}
            <div className="relative min-h-[300px] flex flex-col">
               {result ? (
                 <div className="bg-slate-900/80 rounded-xl p-6 border border-entropy-500/30 animate-fade-in flex-grow flex flex-col">
                    <h4 className="text-entropy-400 text-sm font-semibold uppercase tracking-wide mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      AI Analysis Result
                    </h4>
                    <p className="text-lg text-slate-200 leading-relaxed">
                      {result}
                    </p>
                    <div className="mt-auto pt-6">
                      <p className="text-xs text-slate-500">
                        *Generated by Entropy AI Preview Model (Gemini 2.5 Flash).
                      </p>
                    </div>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-center border-2 border-dashed border-slate-800 rounded-xl p-8">
                    <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-slate-700" />
                    </div>
                    <p className="text-slate-600 max-w-xs">
                      Awaiting input parameters to initialize predictive matrix...
                    </p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;