import React, { useState, useEffect, useRef, useCallback } from 'react';
import { User, Settings, LogOut, CreditCard, Lock, Mail, ArrowRight } from 'lucide-react';
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
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: {
              credential: string;
            }) => void;
          }) => void;
          renderButton: (element: HTMLElement, config: {
            theme: string;
            size: string;
          }) => void;
          prompt: () => void;
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
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
  
  // Load user data from context when logged in
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);
  
  // Debug: Log if Client ID is loaded (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Google Client ID loaded:', GOOGLE_CLIENT_ID ? 'Yes (configured)' : 'No (missing)');
      if (GOOGLE_CLIENT_ID) {
        console.log('Client ID starts with:', GOOGLE_CLIENT_ID.substring(0, 20) + '...');
      }
    }
  }, [GOOGLE_CLIENT_ID]);

  const handleGoogleCredentialResponse = useCallback(async (response: { credential: string }) => {
    try {
      // Decode the JWT token to get user information
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const userData = JSON.parse(jsonPayload);
      
      const userName = userData.name || 'User';
      const userEmail = userData.email || '';
      const googleId = userData.sub || ''; // Google's user ID
      
      // Use auth context to sign in with Google
      const result = await googleSignIn(userEmail, userName, googleId);
      
      if (result.success) {
        // Also save to Supabase directly (optional - backend should handle this)
        await saveUser({
          email: userEmail,
          name: userName,
        });
        console.log('Google Sign-In successful!', userData);
      } else {
        alert(result.message || 'Google Sign-In failed');
      }
    } catch (error) {
      console.error('Error decoding Google credential:', error);
      alert('Failed to process Google Sign-In. Please try again.');
    }
  }, [googleSignIn]);

  const initializeGoogleSignIn = useCallback(() => {
    if (!window.google) return;

    if (!GOOGLE_CLIENT_ID) {
      console.warn('Google Client ID not configured. Please set REACT_APP_GOOGLE_CLIENT_ID in your .env file.');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredentialResponse,
    });
  }, [GOOGLE_CLIENT_ID, handleGoogleCredentialResponse]);

  // Load Google Identity Services script
  useEffect(() => {
    if (window.google) {
      initializeGoogleSignIn();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeGoogleSignIn();
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [initializeGoogleSignIn]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) return;

    if (isSignUpMode) {
      // Sign Up
      const result = await register(email, password, name);
      if (result.success) {
        // Also save to Supabase directly (optional)
        await saveUser({
          email: email,
          name: name || email.split('@')[0],
        });
      } else {
        alert(result.message || 'Registration failed');
      }
    } else {
      // Login
      const result = await login(email, password);
      if (!result.success) {
        alert(result.message || 'Login failed');
      }
    }
  };

  const handleLogout = () => {
    logout();
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleGoogleLogin = async () => {
    console.log('Google Sign-In button clicked');
    console.log('Client ID available:', !!GOOGLE_CLIENT_ID);
    console.log('Google library loaded:', !!window.google);
    
    try {
      if (!GOOGLE_CLIENT_ID) {
        const useDemo = window.confirm(
          'Google Sign-In is not configured.\n\n' +
          'To enable real Google Sign-In:\n' +
          '1. Go to https://console.cloud.google.com/\n' +
          '2. Create a project and enable Google+ API\n' +
          '3. Create OAuth 2.0 credentials (Web application)\n' +
          '4. Add REACT_APP_GOOGLE_CLIENT_ID=your_client_id to your .env file\n' +
          '5. Restart your dev server\n\n' +
          'Click OK to use demo mode, or Cancel to set up Google Sign-In.'
        );
        
        if (useDemo) {
          // Use demo mode with auth context
          await googleSignIn('user@gmail.com', 'Google User', 'demo-google-id');
        }
        return;
      }

      if (!window.google) {
        alert('Google Sign-In library is still loading. Please wait a moment and try again.');
        return;
      }

      if (!window.google.accounts || !window.google.accounts.id) {
        console.error('Google accounts.id is not available');
        alert('Google Sign-In is not available. Please refresh the page and try again.');
        return;
      }

      console.log('Initializing Google Sign-In with Client ID');
      
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredentialResponse,
      });

      window.google.accounts.id.prompt();
      
      console.log('Creating fallback Google Sign-In button');
      
      const button = document.createElement('div');
      button.id = 'google-signin-button';
      button.style.display = 'none';
      document.body.appendChild(button);
      
      try {
        if (window.google && window.google.accounts && window.google.accounts.id) {
          window.google.accounts.id.renderButton(button, {
            theme: 'outline',
            size: 'large',
          });
          
          setTimeout(() => {
            const renderedButton = button.querySelector('div[role="button"]') as HTMLElement;
            if (renderedButton) {
              console.log('Clicking rendered Google button');
              renderedButton.click();
            } else {
              console.log('Button not rendered, trying alternative method');
              if (button.firstChild) {
                (button.firstChild as HTMLElement).click();
              }
            }
            
            setTimeout(() => {
              if (document.body.contains(button)) {
                document.body.removeChild(button);
              }
            }, 2000);
          }, 500);
        }
      } catch (renderError) {
        console.error('Error rendering Google button:', renderError);
        if (document.body.contains(button)) {
          document.body.removeChild(button);
        }
        alert('Failed to initialize Google Sign-In. Please try refreshing the page.');
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      alert('Failed to sign in with Google. Please try again.');
    }
  };

  // State 1: Authentication Form (Login or Sign Up)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center">
        <div className="container mx-auto px-6 max-w-md">
          <div className="glass-card p-8 rounded-2xl bg-white shadow-xl border border-slate-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-entropy-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-entropy-200">
                <User className="w-8 h-8 text-entropy-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isSignUpMode ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-slate-500 mt-2">
                {isSignUpMode ? 'Join Entropy AI to get started' : 'Sign in to access your dashboard'}
              </p>
            </div>

            {/* Google Sign In Button */}
            <div ref={googleButtonRef} className="mb-6">
              <button 
                onClick={handleGoogleLogin}
                className="w-full bg-white border border-slate-300 text-slate-700 font-medium py-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign {isSignUpMode ? 'Up' : 'In'} using Google
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              
              {/* Name Field - Only for Sign Up */}
              {isSignUpMode && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-3 focus:border-entropy-500 focus:outline-none focus:ring-1 focus:ring-entropy-500 transition-colors text-slate-900"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-3 focus:border-entropy-500 focus:outline-none focus:ring-1 focus:ring-entropy-500 transition-colors text-slate-900"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-4 py-3 focus:border-entropy-500 focus:outline-none focus:ring-1 focus:ring-entropy-500 transition-colors text-slate-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-entropy-600 to-entropy-500 text-white font-bold py-3 rounded-lg hover:from-entropy-700 hover:to-entropy-600 transition-all shadow-lg shadow-entropy-500/20 flex items-center justify-center gap-2 mt-2"
              >
                {isSignUpMode ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                {isSignUpMode ? "Already have an account?" : "Don't have an account?"}{' '}
                <button 
                  onClick={() => setIsSignUpMode(!isSignUpMode)}
                  className="text-entropy-600 font-semibold cursor-pointer hover:underline focus:outline-none"
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
  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Account</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="glass-card p-6 rounded-2xl bg-white shadow-sm border border-slate-200 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-2 border-slate-200 mb-4 relative">
                    <User className="w-10 h-10 text-slate-400" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{user?.name || 'User'}</h2>
                <p className="text-sm text-slate-500 mb-6">{user?.email}</p>
            </div>
          </div>

          {/* Settings / Dashboard */}
          <div className="md:col-span-2 space-y-6">
            <div className="glass-card p-8 rounded-2xl bg-white shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Account Settings</h3>
                
                <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-entropy-50 rounded-lg text-entropy-600 group-hover:bg-entropy-100 transition-colors">
                                <Settings className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-semibold text-slate-900">General Settings</h4>
                                <p className="text-sm text-slate-500">Update profile information and email</p>
                            </div>
                        </div>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 group">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-entropy-50 rounded-lg text-entropy-600 group-hover:bg-entropy-100 transition-colors">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <h4 className="font-semibold text-slate-900">Billing & Plans</h4>
                                <p className="text-sm text-slate-500">View active subscriptions</p>
                            </div>
                        </div>
                    </button>
                    
                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <button 
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-red-50 transition-colors text-red-600 font-medium justify-center"
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