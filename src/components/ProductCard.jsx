import React from 'react';
import { Star, Heart, Plus, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { recordAnalyticsEvent } from '../utils/analytics';

export const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setActiveProductModal } = useStore();
  const wishlisted = isInWishlist(product.id);

  const discountPct = (product.originalPrice && product.originalPrice > product.price)
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.inStock) {
      recordAnalyticsEvent('add_to_cart', product.title);
      addToCart(product, 1, { variant: "Normal (45-50cm) · Standard" });
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    recordAnalyticsEvent('wishlist', product.title);
    toggleWishlist(product.id);
  };

  const productUrl = `/PinataStore/shop?product=${product.slug || product.id}`;

  return (
    <a 
      href={productUrl}
      onClick={(e) => {
        e.preventDefault();
        setActiveProductModal(product);
      }}
      className="group bg-white rounded-3xl p-3.5 sm:p-4 border border-pink-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between cursor-pointer relative block text-left"
    >
      {/* Top Image Container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-brand-pinkSubtle mb-3.5">
        <img 
          src={product.image} 
          alt={`${product.title} Lahore`} 
          width="600"
          height="600"
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${!product.inStock ? 'opacity-60 grayscale-[30%]' : ''}`}
        />

        {/* Status & Sale Badges */}
        {product.inStock ? (
          discountPct > 0 ? (
            <span className="absolute top-3 left-3 text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md bg-gradient-to-r from-red-500 to-pink-600 text-white tracking-wide">
              {product.badge === 'Sale' ? `${discountPct}% OFF SALE` : `${discountPct}% OFF`}
            </span>
          ) : product.badge ? (
            <span className={`absolute top-3 left-3 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm ${
              product.badge === 'Bestseller' ? 'bg-brand-pink text-white' :
              product.badge === 'Popular' ? 'bg-brand-teal text-white' :
              product.badge === 'Viral' ? 'bg-purple-600 text-white' :
              product.badge === 'Sale' ? 'bg-red-500 text-white font-extrabold' :
              'bg-amber-500 text-white'
            }`}>
              {product.badge}
            </span>
          ) : null
        ) : (
          <span className="absolute top-3 left-3 bg-gray-800 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-red-400" />
            <span>Out of Stock</span>
          </span>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors z-10 ${
            wishlisted ? 'bg-pink-50 text-brand-pink' : 'bg-white/80 text-gray-500 hover:text-brand-pink'
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-brand-pink text-brand-pink' : ''}`} />
        </button>
      </div>

      {/* Product Details */}
      <div className="space-y-1.5 flex-1">
        <h3 className="font-bold text-sm sm:text-base text-gray-900 group-hover:text-brand-pink transition-colors line-clamp-1">
          {product.title}
        </h3>

        {/* Star Rating */}
        <div className="flex items-center gap-1.5 text-xs">
          <div className="flex items-center text-brand-yellow">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-current" />
            ))}
          </div>
          <span className="text-gray-400 text-[11px]">({product.reviewCount})</span>
        </div>
      </div>

      {/* Price & Action Row */}
      <div className="flex items-center justify-between pt-3 mt-1 border-t border-pink-50">
        <div>
          <div className="text-sm sm:text-base font-extrabold text-brand-pink flex items-center gap-1.5">
            <span>PKR {product.price.toLocaleString()}</span>
            {discountPct > 0 && (
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded">
                -{discountPct}%
              </span>
            )}
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="text-[11px] text-gray-400 line-through">
              PKR {product.originalPrice.toLocaleString()}
            </div>
          )}
        </div>

        {product.inStock ? (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-pink hover:bg-brand-pinkHover text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all z-10"
            aria-label={`Add ${product.title} to cart`}
            title="Quick add to cart"
          >
            <Plus className="w-5 h-5" />
          </button>
        ) : (
          <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
            Sold Out
          </span>
        )}
      </div>
    </a>
  );
};
