import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export const StudioBanner = ({ navigate }) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-pink via-purple-600 to-brand-teal p-8 sm:p-12 lg:p-14 shadow-xl text-white">
          {/* Subtle background decorative shapes */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-brand-yellow/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Custom Studio</span>
            </div>

            <h2 className="font-script text-3xl sm:text-5xl font-bold leading-tight">
              Have a wild idea? We'll build it.
            </h2>

            <p className="text-pink-100 text-sm sm:text-base font-body leading-relaxed">
              Upload a photo, logo, or character reference. From 2D party pieces to 5-foot 3D sculptures and giant surprise eggs handcrafted in Lahore.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigate('customize')}
                className="px-8 py-4 bg-white text-brand-pink hover:bg-pink-50 rounded-full font-bold text-sm sm:text-base shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 inline-flex items-center gap-2"
              >
                <span>Start a Custom Order</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
