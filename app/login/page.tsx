'use client';

import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/admin');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Failed to log in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0A192F] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#0A192F]/50 backdrop-blur-sm border border-[#c8a46e]/30 rounded-xl p-8 text-center shadow-[0_0_30px_rgba(200,164,110,0.15)]">
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#c8a46e] to-[#a68a5a] p-[1px]">
            <div className="w-full h-full rounded-full bg-[#0A192F] flex items-center justify-center">
              <span className="material-symbols-outlined text-[#c8a46e] text-4xl">
                admin_panel_settings
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            Admin Access
          </h1>
          <p className="text-gray-300 text-sm">
            Please log in to manage bookings.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full py-4 bg-gradient-to-r from-[#c8a46e] to-[#a68a5a] text-white font-bold rounded-lg shadow-[0_0_20px_rgba(200,164,110,0.3)] hover:shadow-[0_0_30px_rgba(200,164,110,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>
          Sign in with Google
        </button>
        
        <div className="mt-8 pt-6 border-t border-[#c8a46e]/10">
          <a href="/" className="text-[#c8a46e] text-sm hover:text-white transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
