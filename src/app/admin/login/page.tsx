'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { dbService } from '@/lib/dbService';
import { Lock, Mail, AlertCircle, ShieldAlert } from 'lucide-react';
import { HenIcon } from '@/components/ui/Icons';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  
  // Brute force lockout state
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    setIsMock(dbService.isMockMode);
    
    // Check if already authenticated, redirect to admin dashboard
    const checkAuth = async () => {
      const authenticated = await dbService.isAdminAuthenticated();
      if (authenticated) {
        router.push('/admin');
      }
    };
    checkAuth();

    // Check lockout on mount
    const storedLockout = localStorage.getItem('mif_lockout_until');
    if (storedLockout) {
      const until = parseInt(storedLockout, 10);
      if (until > Date.now()) {
        setLockoutTime(until);
        setTimeLeft(Math.ceil((until - Date.now()) / 1000));
      } else {
        localStorage.removeItem('mif_lockout_until');
        localStorage.setItem('mif_failed_attempts', '0');
      }
    }
  }, [router]);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutTime) return;

    const timer = setInterval(() => {
      const remaining = lockoutTime - Date.now();
      if (remaining <= 0) {
        setLockoutTime(null);
        setTimeLeft(0);
        localStorage.removeItem('mif_lockout_until');
        localStorage.setItem('mif_failed_attempts', '0');
        setError(null);
        clearInterval(timer);
      } else {
        setTimeLeft(Math.ceil(remaining / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutTime]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if locked out
    if (lockoutTime && lockoutTime > Date.now()) {
      setError(`Account is locked. Please try again in ${timeLeft}s.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await dbService.signInAdmin(email, password);
      if (result.success) {
        // Reset attempts
        localStorage.removeItem('mif_failed_attempts');
        localStorage.removeItem('mif_lockout_until');

        // Set mock session cookie if in mock mode to satisfy middleware
        if (dbService.isMockMode) {
          document.cookie = 'mif_admin_logged_in=true; path=/; max-age=86400';
        }
        router.push('/admin');
        router.refresh();
      } else {
        // Increment attempts
        const attempts = parseInt(localStorage.getItem('mif_failed_attempts') || '0', 10) + 1;
        localStorage.setItem('mif_failed_attempts', attempts.toString());

        if (attempts >= 5) {
          const lockUntil = Date.now() + 5 * 60 * 1000; // 5 minutes lockout
          localStorage.setItem('mif_lockout_until', lockUntil.toString());
          setLockoutTime(lockUntil);
          setTimeLeft(300);
          setError('Too many failed attempts. This account has been locked for 5 minutes.');
        } else {
          setError(`Invalid credentials. Attempt ${attempts} of 5 before lockout.`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-6 font-body text-left">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-cream-dark/45 shadow-md flex flex-col gap-6">
        
        {/* Header Logo */}
        <div className="flex flex-col items-center text-center gap-2">
          <div className="bg-primary text-cream p-3 rounded-full">
            <HenIcon size={32} className="text-cream" />
          </div>
          <h1 className="font-display font-bold text-2xl text-primary mt-2">Mana Inti Farms</h1>
          <span className="text-xs uppercase tracking-wider text-secondary font-semibold">Admin Dashboard Login</span>
        </div>

        {/* Mock Mode Alert */}
        {isMock && !lockoutTime && (
          <div className="bg-[#ff6f00]/5 border border-[#ff6f00]/25 text-[#ff6f00] p-4 rounded-2xl flex items-start gap-3 text-xs leading-normal">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold">Mock Mode Active (No Supabase detected)</span>
              <span>Use these credentials to log in:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border mt-1 w-fit">
                Email: <strong>admin@manaintifarms.com</strong>
              </span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border w-fit">
                Password: <strong>admin123</strong>
              </span>
            </div>
          </div>
        )}

        {/* Lockout Warning */}
        {lockoutTime && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-start gap-3 text-xs leading-normal">
            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="font-bold">Brute-Force Lockout Active</span>
              <span>This panel is temporarily disabled due to too many failed login attempts.</span>
              <span className="font-bold text-sm mt-1">
                Try again in: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
              </span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && !lockoutTime && (
          <div className="bg-red-50 border border-red-250 text-red-700 p-3.5 rounded-xl flex items-center gap-2.5 text-xs font-semibold">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-bold text-foreground/70">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="email"
                id="email"
                required
                disabled={loading || !!lockoutTime}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@manaintifarms.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark/85 bg-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-bold text-foreground/70">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
              <input
                type="password"
                id="password"
                required
                disabled={loading || !!lockoutTime}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream-dark/85 bg-cream/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !!lockoutTime}
            className="mt-2 bg-primary hover:bg-primary-hover text-cream py-3 rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center">
          <Link href="/" className="text-xs text-foreground/50 hover:underline">
            ← Back to Storefront
          </Link>
        </div>

      </div>
    </div>
  );
}
