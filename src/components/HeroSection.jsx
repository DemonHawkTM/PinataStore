import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Star, Heart, Clock, Gift } from 'lucide-react';

export const HeroSection = ({ navigate }) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF2E93', '#00B4D8', '#FFB703', '#9D4EDD', '#FF6584']
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-pinkSubtle via-white to-white py-12 lg:py-20">
      {/* Decorative festive confetti circles in background */}
      <div className="absolute top-10 left-10 w-4 h-4 rounded-full bg-brand-pink/30 animate-pulse"></div>
      <div className="absolute top-20 right-24 w-6 h-6 rounded-full bg-brand-teal/30"></div>
      <div className="absolute bottom-10 left-1/4 w-5 h-5 rounded-full bg-brand-yellow/30"></div>
      <div className="absolute top-1/2 right-10 w-3 h-3 rounded-full bg-purple-400/30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-brand-pink text-xs sm:text-sm font-semibold tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-brand-pink" />
              <span>Handmade · Custom · Lahore Party-Ready</span>
            </div>

            {/* Main Headline with Dancing Script accent */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-800 uppercase">
                It's Your Party...
              </h2>
              <h1 className="font-script text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-brand-pink via-pink-600 to-brand-teal bg-clip-text text-transparent leading-none py-1">
                We Make It Special!
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-body">
              Custom piñatas, mini gifts, and giant surprise eggs — handcrafted in Lahore around your theme, your colours, and your people. <strong className="text-gray-800 font-semibold">You think it. We make it.</strong>
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button 
                onClick={() => navigate('customize')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pinkHover hover:to-pink-700 text-white rounded-full font-bold text-base shadow-brand hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>Customize Now</span>
                <Sparkles className="w-5 h-5" />
              </button>

              <button 
                onClick={() => navigate('shop')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-pink-50 text-brand-teal hover:text-brand-tealDark border-2 border-brand-teal rounded-full font-bold text-base transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>Browse Piñatas</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Stats Bar */}
            <div className="pt-8 border-t border-pink-100 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  1,000+
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  designs to start from in Lahore
                </div>
              </div>

              <div className="text-center lg:text-left border-x border-pink-100 px-2 sm:px-4">
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  5–7 days
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  typical handmade lead time
                </div>
              </div>

              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-pink flex items-center justify-center lg:justify-start gap-1">
                  4.9 <Star className="w-5 h-5 fill-brand-yellow text-brand-yellow inline" />
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  from Lahore party hosts
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Floating Tilted Piñata Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
            
            {/* Interactive Confetti Popping Card */}
            <div 
              onClick={triggerConfetti}
              className="relative w-full max-w-sm sm:max-w-md h-[400px] sm:h-[450px] cursor-pointer group"
              title="Click to pop celebration confetti!"
            >
              {/* Card 1: Pink Guitar (Tilted Left) */}
              <div className="absolute left-0 top-12 w-44 sm:w-52 bg-white rounded-3xl p-3 shadow-card border border-pink-100 transform -rotate-12 group-hover:-rotate-16 transition-all duration-300 animate-float-reverse z-10">
                <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-pink-50 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80" 
                    alt="Pink Guitar Piñata" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-brand-pink text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    New
                  </span>
                </div>
                <div className="mt-2.5 text-center">
                  <p className="font-bold text-xs sm:text-sm text-gray-800 truncate">Pink Guitar</p>
                  <p className="text-xs font-semibold text-brand-pink">PKR 4,200</p>
                </div>
              </div>

              {/* Card 2: Centerpiece Unicorn Dream (Standing Hero Front) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-4 w-48 sm:w-56 bg-white rounded-3xl p-3.5 shadow-2xl border-2 border-brand-pink/30 transform group-hover:scale-105 transition-all duration-300 animate-float z-30">
                <div className="w-full h-52 sm:h-60 rounded-2xl overflow-hidden bg-pink-50 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=80" 
                    alt="Unicorn Dream Piñata" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 bg-brand-pink text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Bestseller
                  </span>
                </div>
                <div className="mt-3 text-center">
                  <p className="font-bold text-sm sm:text-base text-gray-900">Unicorn Dream</p>
                  <p className="text-xs sm:text-sm font-extrabold text-brand-pink">PKR 3,500</p>
                </div>
              </div>

              {/* Card 3: Number 1 Crown (Tilted Right) */}
              <div className="absolute right-0 top-14 w-44 sm:w-52 bg-white rounded-3xl p-3 shadow-card border border-pink-100 transform rotate-12 group-hover:rotate-16 transition-all duration-300 animate-float-reverse z-20">
                <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden bg-sky-50 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500&auto=format&fit=crop&q=80" 
                    alt="Number 1 Crown Piñata" 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-brand-teal text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    Popular
                  </span>
                </div>
                <div className="mt-2.5 text-center">
                  <p className="font-bold text-xs sm:text-sm text-gray-800 truncate">Number 1 Crown</p>
                  <p className="text-xs font-semibold text-brand-teal">PKR 2,800</p>
                </div>
              </div>

              {/* Floating Party Popper Hint */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm border border-pink-200 px-4 py-1.5 rounded-full shadow-md text-xs font-semibold text-brand-pink flex items-center gap-1.5 z-40 pointer-events-none whitespace-nowrap">
                <span>✨ Tap cards for celebratory confetti!</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
