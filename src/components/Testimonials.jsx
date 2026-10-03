import React from 'react';
import { Star, MapPin, Quote } from 'lucide-react';

export const Testimonials = () => {
  const reviews = [
    {
      name: "Hira K.",
      location: "DHA Phase 5, Lahore",
      quote: "The unicorn arrived exactly as the sketch. Guests thought we imported it! Filling it with sweets was the absolute highlight of the party.",
      rating: 5,
      event: "4th Birthday Party"
    },
    {
      name: "Omar S.",
      location: "Gulberg III, Lahore",
      quote: "Ordered a custom logo piñata for a corporate brand launch. They sent progress photos during making and delivered in five days. Professional from start to finish.",
      rating: 5,
      event: "Corporate Brand Event"
    },
    {
      name: "Ayesha M.",
      location: "Bahria Town, Lahore",
      quote: "First birthday number 1 with our daughter's name. Soft colours, gold crown, and it actually survived the photo session before the smash!",
      rating: 5,
      event: "1st Birthday Celebration"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-script text-3xl sm:text-5xl text-gray-900 font-bold">
            A few words from Lahore hosts
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-2">
            Real celebrations, real smiles, and unforgettable smashes.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div 
              key={i}
              className="bg-brand-pinkSubtle/50 rounded-3xl p-6 sm:p-7 border border-pink-100 flex flex-col justify-between shadow-card hover:shadow-card-hover transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-brand-yellow">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-pink-200" />
                </div>
                <p className="text-gray-700 text-sm font-body leading-relaxed italic">
                  "{r.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-pink-100/80 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{r.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-brand-pink" />
                    <span>{r.location}</span>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-brand-teal bg-teal-50 px-2 py-0.5 rounded-full">
                  {r.event}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
