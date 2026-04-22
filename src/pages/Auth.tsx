import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Mail, Lock, User, ArrowRight, Github } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';

export function Auth() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log(`[Auth] Attempting ${mode} for:`, email);
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              full_name: fullName,
              created_at: new Date().toISOString()
            }
          }
        });
        
        if (signUpError) {
          console.error('[Auth] Signup Error:', signUpError);
          // Handle rate limits natively 
          if (signUpError.message.toLowerCase().includes('security purposes') || signUpError.message.toLowerCase().includes('rate limit')) {
            throw new Error(`Rate limit exceeded: You've tried to sign up too many times recently. Supabase limits email sending on free tiers. Please try again later or use a different email.`);
          }
          throw signUpError;
        }

        if (data.user) {
          if (data.user.identities?.length === 0) {
            setError('An account with this email already exists. Please try logging in.');
            return;
          }
          
          // Fallback: Manually create profile if trigger hasn't fired or failed
          try {
            await supabase.from('profiles').insert({
              id: data.user.id,
              full_name: fullName,
              created_at: new Date().toISOString()
            });
          } catch (profileErr) {
            console.warn('[Auth] Manual profile creation failed (might already exist via trigger):', profileErr);
          }
        }

        setSuccessMessage('Successfully created! A verification email has been sent to your inbox. Please verify to login securely.');
        setMode('login'); // Toggle UI backwards to login mode
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error('[Auth] Signin Error:', signInError);
          // Make the error more descriptive for users who might not have signed up
          if (signInError.message.includes('Invalid login credentials')) {
             throw new Error('Invalid email or password. If you are a new user, please switch to "Sign Up" to create an account first.');
          }
          throw signInError;
        }
        navigate('/dashboard'); // Go to dashboard on successful login instead of home necessarily
      }
    } catch (err: any) {
      console.error('[Auth] Unexpected error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const { error: socialError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      });
      if (socialError) throw socialError;
    } catch (err: any) {
      setError(err.message || `An error occurred during ${provider} login`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl shadow-bloom-pink/50 border border-gray-50 flex flex-col space-y-10"
      >
        <div className="text-center space-y-2">
          <Link to="/" className="font-serif text-3xl font-bold text-bloom-rose">
            The Bloom & Blossom
          </Link>
          <h2 className="text-gray-400 font-medium">
            {mode === 'login' ? 'Welcome back, beautiful!' : 'Create your bloom account'}
          </h2>
        </div>

        <div className="flex bg-gray-50 p-1 rounded-full">
           <AuthTab active={mode === 'login'} onClick={() => setMode('login')}>Login</AuthTab>
           <AuthTab active={mode === 'signup'} onClick={() => setMode('signup')}>Sign Up</AuthTab>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-xs rounded-2xl border border-red-100 font-medium">
              {error}
            </div>
          )}
          {successMessage && (
            <div className="p-4 bg-green-50 text-green-600 text-xs rounded-2xl border border-green-100 font-medium text-center">
              {successMessage}
            </div>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {mode === 'signup' && (
                <div className="relative">
                  <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-bloom-rose transition-all outline-none"
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-bloom-rose transition-all outline-none"
                />
              </div>

              <div className="relative">
                <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-bloom-rose transition-all outline-none"
                />
              </div>

              {mode === 'login' && (
                <div className="flex justify-end">
                   <button type="button" className="text-xs font-bold text-bloom-rose hover:underline">Forgot Password?</button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-bloom-rose text-white rounded-full font-bold hover:bg-bloom-rose/90 transition-all flex items-center justify-center shadow-xl shadow-bloom-rose/20 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <span className="flex items-center">
                {mode === 'login' ? 'Welcome Back' : 'Join the Blossom'}
                <ArrowRight size={18} className="ml-2" />
              </span>
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-gray-400 font-medium">Or continue with</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button"
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all space-x-3 text-sm font-medium"
          >
             <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
             <span>Google</span>
          </button>
          <button 
            type="button"
            onClick={() => handleSocialLogin('github')}
            className="flex items-center justify-center py-4 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all space-x-3 text-sm font-medium"
          >
             <Github size={20} />
             <span>Github</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function AuthTab({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex-grow py-3 text-sm font-bold rounded-full transition-all",
        active ? "bg-white text-bloom-rose shadow-sm" : "text-gray-400 hover:text-gray-600"
      )}
    >
      {children}
    </button>
  );
}
