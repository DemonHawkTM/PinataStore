import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, KeyRound, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export const AdminLoginPage = ({ navigate }) => {
  const { loginAdmin } = useStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const success = loginAdmin(pin.trim());
    if (success) {
      navigate('admin-dashboard');
    } else {
      setError(true);
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
            Lahore Studio Back-Office
          </span>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
            Admin Authentication Gate
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Dedicated private portal for inventory, stock toggles & order syncing.
          </p>
        </div>

        {/* Demo credentials hint */}
        <div className="p-3 bg-pink-50 rounded-xl text-xs text-gray-600 border border-pink-100">
          <p className="font-semibold text-brand-pink">Demo Access PIN:</p>
          <code className="bg-white px-2 py-0.5 rounded font-mono font-bold text-gray-800 text-sm mt-0.5 inline-block">
            1234
          </code>
          <span className="text-gray-400 text-[11px] block mt-0.5">(or admin123)</span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              placeholder="Enter Admin PIN"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError(false);
              }}
              className="w-full text-center px-4 py-3 rounded-2xl border border-pink-200 text-lg font-mono tracking-widest focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-red-600 font-semibold">
              <ShieldAlert className="w-4 h-4" />
              <span>Invalid PIN. Please enter 1234 or admin123</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pinkHover hover:to-pink-700 text-white rounded-full font-bold text-sm shadow-brand flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <span>Unlock Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <button
          onClick={() => navigate('home')}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Return to Public Storefront
        </button>

      </div>
    </div>
  );
};
