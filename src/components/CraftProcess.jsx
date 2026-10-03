import React from 'react';
import { Camera, Calculator, Hammer, PartyPopper } from 'lucide-react';

export const CraftProcess = () => {
  const steps = [
    {
      num: "01",
      title: "Share the idea",
      desc: "Send a photo, a character, or pick a design from our catalog. Tell us your party date in Lahore.",
      icon: Camera
    },
    {
      num: "02",
      title: "Get a quote",
      desc: "We confirm dimensions, colours, and quote. Custom requests receive a sketch preview before starting.",
      icon: Calculator
    },
    {
      num: "03",
      title: "50% to begin",
      desc: "Handcrafted sculpting begins after deposit. We share making-of photos while it comes to life in our workshop.",
      icon: Hammer
    },
    {
      num: "04",
      title: "Pay & smash!",
      desc: "Balance on completion. Doorstep courier across Lahore — fill with your favorite candy and smash!",
      icon: PartyPopper
    }
  ];

  return (
    <section className="py-16 bg-brand-pinkSubtle/60 border-y border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-script text-3xl sm:text-5xl text-brand-pink font-bold">
            Four simple steps
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mt-2">
            The same authentic artisanal craft process, wrapped in a smooth Lahore order flow.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="bg-white rounded-3xl p-6 sm:p-7 shadow-card border border-pink-100 hover:shadow-card-hover transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-script text-3xl sm:text-4xl font-bold text-brand-pink group-hover:scale-110 transition-transform">
                      {step.num}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-pink-50 text-brand-pink flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm font-body leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
