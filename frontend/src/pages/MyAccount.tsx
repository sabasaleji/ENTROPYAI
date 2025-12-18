import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Settings, LogOut, CreditCard, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { saveUser } from '../services/supabaseService';
import { useAuth } from '../contexts/AuthContext';

// Declare Google types for TypeScript
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}

const MyAccount: React.FC = () => {
  // Use Auth Context
  const { user, isLoggedIn, login, register, googleSignIn, logout } = useAuth();

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

  // Load user data from context when logged in
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Handle Google Login using Token Client (Implicit Flow for Custom Button)
  const handleGoogleLogin = useCallback(() => {
    // Check if Client ID is configured
    if (!GOOGLE_CLIENT_ID) {
      if (process.env.NODE_ENV === 'development') {
        const useDemo = window.confirm('Google Client ID not found. Use Demo Login?');
        if (useDemo) handleDemoLogin();
      } else {
        alert('Google Sign-In is not configured.');
      }
      return;
    }

    // Check if Google script is loaded
    if (!window.google || !window.google.accounts || !window.google.accounts.oauth2) {
      alert('Google Sign-In service is loading. Please wait a moment.');
      return;
    }

    setAuthLoading(true);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: async (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              // Fetch user info using the access token
              const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });

              const userData = await userInfoResponse.json();
              console.log('Google User Data:', userData);

              const userName = userData.name || 'User';
              const userEmail = userData.email || '';
              const googleId = userData.sub || '';

              // Sign in via context
              const result = await googleSignIn(userEmail, userName, googleId);

              if (result.success) {
                await saveUser({ email: userEmail, name: userName });
              } else {
                alert(result.message || 'Google Sign-In failed');
              }
            } catch (error) {
              console.error('Error fetching user info:', error);
              alert('Failed to get user info from Google.');
            }
          }
          setAuthLoading(false);
        },
      });

      // Trigger the popup flow
      client.requestAccessToken();

    } catch (error) {
      console.error('Google Auth Error:', error);
      setAuthLoading(false);
      alert('An error occurred during Google Sign-In.');
    }
  }, [GOOGLE_CLIENT_ID, googleSignIn]);

  const handleDemoLogin = async () => {
    await googleSignIn('demo@entropy.ai', 'Demo User', 'demo_google_id');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setAuthLoading(true);

    if (isSignUpMode) {
      const result = await register(email, password, name);
      if (result.success) {
        await saveUser({ email: email, name: name || email.split('@')[0] });
      } else {
        alert(result.message || 'Registration failed');
      }
    } else {
      const result = await login(email, password);
      // Only show alert on failure, success handling is done by AuthContext updating state
      if (!result.success) {
        alert(result.message || 'Login failed');
      }
    }
    setAuthLoading(false);
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
    setName('');
  };

  // Load Google Identity Services script
  useEffect(() => {
    // If script already exists, don't add it again
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // State 1: Authentication Form (Login or Sign Up)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center" style={{ background: 'transparent' }}>
        <div className="container mx-auto px-6 max-w-md">
          <div className="glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden backdrop-blur-xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
                <User className="w-8 h-8" style={{ color: 'var(--bg-primary)' }} />
              </div>
              <h1 className="text-2xl font-bold gradient-heading">
                {isSignUpMode ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                {isSignUpMode ? 'Join Entropy AI to get started' : 'Sign in to access your dashboard'}
              </p>
            </div>

            {/* Google Sign In Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={authLoading}
                className="w-full font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  zIndex: 10
                }}
              >
                {authLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                <span>Sign {isSignUpMode ? 'Up' : 'In'} using Google</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2" style={{ color: 'var(--text-muted)', background: 'var(--bg-secondary)' }}>Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">

              {/* Name Field - Only for Sign Up */}
              {isSignUpMode && (
                <div>
                  <label className="input-label">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field pl-10"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="input-label">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="cta-button w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {authLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isSignUpMode ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center relative z-10">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {isSignUpMode ? "Already have an account?" : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUpMode(!isSignUpMode)}
                  className="font-bold hover:underline focus:outline-none ml-1 transition-colors cursor-pointer"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  {isSignUpMode ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Dashboard (Logged In)
  // ... (Keeping dashboard logic same as it works fine)
  return (
    <div className="min-h-screen pt-32 pb-20 relative z-10" style={{ background: 'transparent' }}>
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8 gradient-heading">My Account</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-white/10 mb-4 relative" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <User className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full border-2 border-[#1a1a2e]" style={{ background: '#10b981' }}></div>
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{user?.email}</p>
            </div>
          </div>

          {/* Settings / Dashboard */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card p-8 rounded-2xl border border-white/10">
              <h3 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Account Settings</h3>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-xl transition-colors border border-white/5 group hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg transition-colors group-hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--accent-primary)' }}>
                      <Settings className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>General Settings</h4>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Update profile information and email</p>
                    </div>
                  </div>
                </button>

                <button className="w-full flex items-center justify-between p-4 rounded-xl transition-colors border border-white/5 group hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg transition-colors group-hover:bg-white/10" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--accent-tertiary)' }}>
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>Billing & Plans</h4>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>View active subscriptions</p>
                    </div>
                  </div>
                </button>

                <div className="pt-4 mt-4 border-t border-white/10">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/10 transition-colors font-medium justify-center"
                    style={{ color: '#ef4444' }}
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;