import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

export const WishlistPage = ({ navigate }) => {
  const { wishlist, products } = useStore();
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
          <a href="/PinataStore/" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="hover:text-brand-pink transition-colors">Home</a>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Wishlist</span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900">
            Wishlist
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Designs saved for your upcoming party in Lahore.
          </p>
        </div>

        {wishlistedProducts.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-brand-pinkSubtle/30 rounded-3xl p-8 border border-pink-100 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-pink-50 text-brand-pink flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">Nothing saved yet</h3>
            <p className="text-gray-500 text-xs max-w-xs mx-auto">
              Tap the heart on any piñata to bookmark it for your party.
            </p>
            <a
              href="/PinataStore/shop"
              onClick={(e) => { e.preventDefault(); navigate('shop'); }}
              className="px-6 py-2.5 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-bold rounded-full shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Browse Designs</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {wishlistedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
