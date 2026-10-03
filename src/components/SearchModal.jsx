import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Star, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SearchModal = ({ navigate }) => {
  const { isSearchOpen, setIsSearchOpen, products, setActiveProductModal } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen || typeof document === 'undefined') return null;

  const filtered = searchTerm.trim() === '' 
    ? products.slice(0, 4) 
    : products.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchTerm.toLowerCase())
      );

  const handleSelectProduct = (product) => {
    setIsSearchOpen(false);
    setActiveProductModal(product);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-pink-100 overflow-hidden z-10 animate-in fade-in slide-in-from-top-4 duration-200">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-pink-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-brand-pink shrink-0" />
          <input
            type="text"
            placeholder="Search custom piñatas, characters, themes (e.g. Unicorn, Number, Spider)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-3">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            {searchTerm.trim() === '' ? 'Popular in Lahore Right Now' : `Matching Results (${filtered.length})`}
          </div>

          {filtered.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-sm">
              No piñatas found matching "{searchTerm}". Have a custom design in mind?
              <div className="mt-3">
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    navigate('customize');
                  }}
                  className="text-xs font-bold text-brand-pink underline"
                >
                  Create Custom Piñata in Studio →
                </button>
              </div>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectProduct(item)}
                className="flex items-center gap-4 p-2.5 rounded-2xl hover:bg-pink-50/60 cursor-pointer transition-all border border-transparent hover:border-pink-100 group"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-brand-pinkSubtle shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 group-hover:text-brand-pink truncate transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="text-brand-teal font-medium">{item.categoryLabel}</span>
                    <span>•</span>
                    <span className="font-bold text-brand-pink">PKR {item.price.toLocaleString()}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-pink group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>

      </div>
    </div>,
    document.body
  );
};
