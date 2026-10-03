import React, { useState } from 'react';
import { HeroSection } from '../components/HeroSection';
import { OccasionGrid } from '../components/OccasionGrid';
import { ProductCard } from '../components/ProductCard';
import { CraftProcess } from '../components/CraftProcess';
import { StudioBanner } from '../components/StudioBanner';
import { Testimonials } from '../components/Testimonials';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HomePage = ({ navigate }) => {
  const { products } = useStore();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredProducts = selectedFilter === 'all' 
    ? products.slice(0, 8) 
    : products.filter(p => p.category === selectedFilter).slice(0, 8);

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection navigate={navigate} />

      {/* 2. Shop by Occasion */}
      <OccasionGrid navigate={navigate} />

      {/* 3. Popular Piñatas Grid */}
      <section className="py-16 bg-brand-pinkSubtle/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-brand-pink text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Lahore Bestsellers</span>
              </div>
              <h2 className="font-script text-3xl sm:text-5xl text-brand-pink font-bold">
                Popular Piñatas
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Ready-to-personalise party showstoppers crafted in Lahore.
              </p>
            </div>

            <button
              onClick={() => navigate('shop')}
              className="text-xs sm:text-sm font-bold text-brand-pink hover:text-brand-pinkHover inline-flex items-center gap-1 transition-colors self-start md:self-end"
            >
              <span>View all designs ({products.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedFilter === cat.id
                    ? 'bg-brand-pink text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-pink-50 border border-pink-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 4. Four Simple Steps Craft Process */}
      <CraftProcess />

      {/* 5. Custom Studio Highlight Banner */}
      <StudioBanner navigate={navigate} />

      {/* 6. Lahore Verified Reviews */}
      <Testimonials />
    </div>
  );
};
