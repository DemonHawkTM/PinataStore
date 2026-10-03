import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, ShieldAlert, ArrowRight, Clock } from 'lucide-react';
import { getAdminLockoutState, recordAdminFailedAttempt, resetAdminLockout } from '../utils/security';

export const AdminLoginPage = ({ navigate }) => {
  const { loginAdmin } = useStore();
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Rate Limiting & Lockout persisted across page refreshes (MED-04)
  const [lockoutState, setLockoutState] = useState(getAdminLockoutState);
  const { failedAttempts, lockoutRemainingSeconds } = lockoutState;

  useEffect(() => {
    let timer;
    if (lockoutRemainingSeconds > 0) {
      timer = setInterval(() => {
        setLockoutState(getAdminLockoutState());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutRemainingSeconds]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (lockoutRemainingSeconds > 0) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await loginAdmin(pin.trim());
      if (res.success) {
        resetAdminLockout();
        navigate('admin');
      } else {
        const nextState = recordAdminFailedAttempt();
        setLockoutState(nextState);
        if (nextState.lockoutRemainingSeconds > 0) {
          setErrorMessage(`Too many failed attempts. Security lockout active for ${nextState.lockoutRemainingSeconds}s.`);
        } else {
          setErrorMessage(`Access Denied: Invalid passkey (${5 - nextState.failedAttempts} attempts remaining).`);
        }
      }
    } catch (err) {
      setErrorMessage('Authentication error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 bg-gradient-to-b from-brand-pinkSubtle/50 to-white min-h-[80vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-pink-100 shadow-2xl max-w-md w-full space-y-6 text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-pink-100 text-brand-pink flex items-center justify-center mx-auto shadow-inner">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] font-bold text-brand-teal uppercase tracking-widest">
            Lahore Studio Staff Access
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
            Studio Security Gate
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Authorized Lahore Studio personnel only. Access is cryptographically verified and monitored.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter Master Passkey"
              value={pin}
              disabled={lockoutRemainingSeconds > 0 || isLoading}
              onChange={(e) => {
                setPin(e.target.value);
                setErrorMessage('');
              }}
              className="w-full text-center px-4 py-3 rounded-2xl border border-pink-200 text-lg font-mono tracking-widest focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 disabled:bg-gray-100 disabled:cursor-not-allowed"
              autoFocus
              required
            />
          </div>

          {errorMessage && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 font-semibold p-2.5 bg-red-50 rounded-xl">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {lockoutRemainingSeconds > 0 ? (
            <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Locked for {lockoutRemainingSeconds} seconds</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pinkHover hover:to-pink-700 disabled:opacity-50 text-white rounded-full font-bold text-sm shadow-brand flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <span>{isLoading ? 'Verifying...' : 'Authenticate & Unlock'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </form>

        <a
          href="/PinataStore/"
          onClick={(e) => { e.preventDefault(); navigate('home'); }}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors inline-block"
        >
          ← Return to Public Storefront
        </a>

      </div>
    </div>
  );
};
