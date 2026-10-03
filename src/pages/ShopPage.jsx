import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { CATEGORIES, OCCASIONS } from '../data/products';
import { Search, SlidersHorizontal, Sparkles, ArrowRight } from 'lucide-react';

export const ShopPage = ({ queryParams, navigate }) => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState(queryParams?.category || 'all');
  const [selectedOccasion, setSelectedOccasion] = useState(queryParams?.occasion || 'all');
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (queryParams?.category) setSelectedCategory(queryParams.category);
    if (queryParams?.occasion) setSelectedOccasion(queryParams.occasion);
  }, [queryParams]);

  // Filtering
  let filtered = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchOccasion = selectedOccasion === 'all' || p.occasion === selectedOccasion;
    const matchSearch = searchQuery.trim() === '' || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchOccasion && matchSearch;
  });

  // Sorting
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else {
    // popular
    filtered.sort((a, b) => b.reviewCount - a.reviewCount);
  }

  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
          <a href="/PinataStore/" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="hover:text-brand-pink transition-colors">Home</a>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Shop Piñatas</span>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-script text-3xl sm:text-5xl text-brand-pink font-bold">
            {selectedCategory === 'all' 
              ? 'Handcrafted Piñatas' 
              : CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Piñata Catalog'}
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-1 max-w-2xl font-body">
            Showing handmade designs ready for your party in Lahore. Every piece is constructed with reinforced suspension and a hidden candy flap.
          </p>
        </div>

        {/* Controls Bar: Category Pills + Search + Sort */}
        <div className="space-y-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-brand-pink text-white shadow-sm'
                    : 'bg-brand-pinkSubtle/60 text-gray-700 hover:bg-pink-100 border border-pink-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Controls: Occasion Filter & Search & Sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search characters or themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-full border border-pink-100 bg-pink-50/40 focus:outline-none focus:border-brand-pink text-gray-800"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Occasion Dropdown */}
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="px-3 py-2 text-xs rounded-full border border-pink-100 bg-white text-gray-700 focus:outline-none focus:border-brand-pink cursor-pointer"
              >
                {OCCASIONS.map(occ => (
                  <option key={occ.id} value={occ.id}>{occ.label}</option>
                ))}
              </select>

              {/* Sort By Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-xs rounded-full border border-pink-100 bg-white text-gray-700 focus:outline-none focus:border-brand-pink cursor-pointer font-medium"
              >
                <option value="popular">Sort by: Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated (Stars)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-brand-pinkSubtle/30 rounded-3xl p-8 border border-pink-100">
            <span className="text-4xl">🪅</span>
            <h3 className="font-bold text-gray-800 text-lg">No piñatas found</h3>
            <p className="text-gray-500 text-xs sm:text-sm max-w-md mx-auto">
              We couldn't find a catalog match, but our Lahore workshop builds anything! Upload a reference photo in our Custom Studio.
            </p>
            <button
              onClick={() => navigate('customize')}
              className="px-6 py-3 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-bold rounded-full shadow-md transition-all inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Custom Piñata Studio</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
