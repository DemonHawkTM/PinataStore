import React from 'react';
import { Cake, Sparkles, Heart, Baby, PartyPopper } from 'lucide-react';

export const OccasionGrid = ({ navigate }) => {
  const occasions = [
    {
      id: "birthday",
      title: "1st & Kids Birthdays",
      subtitle: "Numbers, characters, superheroes",
      icon: Cake,
      color: "from-pink-500 to-rose-400",
      bgImg: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "baby-shower",
      title: "Baby Shower & Gender Reveal",
      subtitle: "Reveal piñatas, question marks, pastels",
      icon: Baby,
      color: "from-teal-400 to-emerald-400",
      bgImg: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "anniversary",
      title: "Anniversary & Couples",
      subtitle: "Heart piñatas, numbers, celebrations",
      icon: Heart,
      color: "from-red-400 to-pink-500",
      bgImg: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&auto=format&fit=crop&q=80"
    },
    {
      id: "party",
      title: "Milestones & Theme Events",
      subtitle: "Graduations, brands, custom piñatas",
      icon: PartyPopper,
      color: "from-amber-400 to-orange-400",
      bgImg: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-brand-pink text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrate in Lahore</span>
          </div>
          <h2 className="font-script text-3xl sm:text-4xl text-gray-900 font-bold">
            Shop by Occasion
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Every celebration deserves its own custom handcrafted shape.
          </p>
        </div>

        {/* Occasion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {occasions.map((occ) => {
            const Icon = occ.icon;
            return (
              <div
                key={occ.id}
                onClick={() => navigate('shop', { occasion: occ.id })}
                className="group relative rounded-3xl overflow-hidden h-64 shadow-card hover:shadow-card-hover cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Background Image with dark gradient overlay */}
                <img 
                  src={occ.bgImg} 
                  alt={occ.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-pink-300 transition-colors">
                      {occ.title}
                    </h3>
                    <p className="text-gray-200 text-xs mt-1 font-body">
                      {occ.subtitle}
                    </p>
                    <span className="inline-flex items-center text-xs font-semibold text-pink-400 mt-2 group-hover:translate-x-1 transition-transform">
                      Explore Designs →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
