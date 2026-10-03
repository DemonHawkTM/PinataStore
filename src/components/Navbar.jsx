import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles, 
  MessageCircle, 
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES, OCCASIONS } from '../data/products';
import { getWhatsAppUrl } from '../config/storeConfig';

export const Navbar = ({ currentRoute, navigate }) => {
  const { cartCount, wishlistCount, setIsCartOpen, setIsSearchOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [occasionDropdownOpen, setOccasionDropdownOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (route, queryParams = {}) => {
    navigate(route, queryParams);
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
    setOccasionDropdownOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo (Left) */}
            <a 
              href="/PinataStore/" 
              onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
              className="flex items-center gap-2 cursor-pointer select-none"
            >
              <span className="text-2xl sm:text-3xl">🪅</span>
              <div className="flex flex-col">
                <span className="font-script text-2xl sm:text-3xl text-brand-pink font-bold leading-none tracking-tight">
                  Pinata Shop
                </span>
                <span className="text-[10px] tracking-widest text-brand-teal uppercase font-semibold pl-0.5">
                  Lahore Studio
                </span>
              </div>
            </a>

            {/* Desktop Navigation (Center) - Semantic Anchor Tags for Crawler Discoverability */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <a 
                href="/PinataStore/"
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  currentRoute === 'home' ? 'text-brand-pink font-semibold bg-brand-pinkLight' : 'text-gray-700 hover:text-brand-pink hover:bg-pink-50'
                }`}
              >
                Home
              </a>

              {/* Shop Piñatas Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setShopDropdownOpen(true)}
                onMouseLeave={() => setShopDropdownOpen(false)}
              >
                <a 
                  href="/PinataStore/shop"
                  onClick={(e) => { e.preventDefault(); handleNavClick('shop'); }}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                    currentRoute === 'shop' ? 'text-brand-pink font-semibold bg-brand-pinkLight' : 'text-gray-700 hover:text-brand-pink hover:bg-pink-50'
                  }`}
                >
                  <span>Shop Piñatas</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${shopDropdownOpen ? 'rotate-180 text-brand-pink' : ''}`} />
                </a>

                {shopDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-pink-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 pb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Browse Categories
                    </div>
                    {CATEGORIES.map(cat => (
                      <a
                        key={cat.id}
                        href={`/PinataStore/shop?category=${cat.id}`}
                        onClick={(e) => { e.preventDefault(); handleNavClick('shop', { category: cat.id }); }}
                        className="w-full text-left px-3.5 py-2 text-sm text-gray-700 hover:bg-brand-pinkLight hover:text-brand-pink font-medium flex items-center justify-between transition-colors block"
                      >
                        <span>{cat.label}</span>
                        <span className="text-xs text-brand-teal font-normal">→</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Occasions Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setOccasionDropdownOpen(true)}
                onMouseLeave={() => setOccasionDropdownOpen(false)}
              >
                <a 
                  href="/PinataStore/shop"
                  onClick={(e) => { e.preventDefault(); handleNavClick('shop'); }}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-pink hover:bg-pink-50 rounded-full transition-colors"
                >
                  <span>Occasions</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${occasionDropdownOpen ? 'rotate-180 text-brand-pink' : ''}`} />
                </a>

                {occasionDropdownOpen && (
                  <div className="absolute top-full left-0 w-60 bg-white rounded-2xl shadow-xl border border-pink-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 pb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Celebrate in Lahore
                    </div>
                    {OCCASIONS.map(occ => (
                      <a
                        key={occ.id}
                        href={`/PinataStore/shop?occasion=${occ.id}`}
                        onClick={(e) => { e.preventDefault(); handleNavClick('shop', { occasion: occ.id }); }}
                        className="w-full text-left px-3.5 py-2 text-sm text-gray-700 hover:bg-brand-pinkLight hover:text-brand-pink font-medium transition-colors block"
                      >
                        {occ.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <a 
                href="/PinataStore/customize"
                onClick={(e) => { e.preventDefault(); handleNavClick('customize'); }}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  currentRoute === 'customize' ? 'text-brand-pink font-semibold bg-brand-pinkLight' : 'text-gray-700 hover:text-brand-pink hover:bg-pink-50'
                }`}
              >
                <Sparkles className="w-4 h-4 text-brand-pink" />
                <span>Custom Studio</span>
              </a>

              <a 
                href="/PinataStore/track"
                onClick={(e) => { e.preventDefault(); handleNavClick('track'); }}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  currentRoute === 'track' ? 'text-brand-pink font-semibold bg-brand-pinkLight' : 'text-gray-700 hover:text-brand-pink hover:bg-pink-50'
                }`}
              >
                Track Order
              </a>

              <a 
                href="/PinataStore/contact"
                onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
                className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                  currentRoute === 'contact' ? 'text-brand-pink font-semibold bg-brand-pinkLight' : 'text-gray-700 hover:text-brand-pink hover:bg-pink-50'
                }`}
              >
                Contact
              </a>
            </nav>

            {/* Right Action Utilities (Search, Wishlist, Cart, Mobile Menu) */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Icon */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-700 hover:text-brand-pink hover:bg-pink-50 rounded-full transition-colors"
                aria-label="Search piñatas"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <a 
                href="/PinataStore/wishlist"
                onClick={(e) => { e.preventDefault(); handleNavClick('wishlist'); }}
                className="relative p-2 text-gray-700 hover:text-brand-pink hover:bg-pink-50 rounded-full transition-colors inline-block"
                aria-label="View wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </a>

              {/* Shopping Cart Icon */}
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-brand-pink hover:bg-pink-50 rounded-full transition-colors"
                aria-label="View cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-pink text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Menu Trigger */}
              <div className="flex items-center lg:hidden ml-1">
                <button 
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 rounded-xl text-gray-800 hover:text-brand-pink hover:bg-pink-50 transition-colors focus:outline-none"
                  aria-label="Open navigation menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

            </div>

          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] lg:hidden overflow-hidden">
          {/* Backdrop with fade-in */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs sm:max-w-sm bg-white shadow-2xl z-10 flex flex-col justify-between h-[100dvh] overflow-y-auto animate-in slide-in-from-right duration-300 ease-out">
            
            {/* Top Header */}
            <div className="p-6 border-b border-pink-100 flex items-center justify-between shrink-0">
              <a 
                href="/PinataStore/"
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                className="flex items-center gap-2"
              >
                <span className="text-2xl">🪅</span>
                <span className="font-script text-2xl text-brand-pink font-bold">
                  Pinata Shop
                </span>
              </a>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full text-gray-500 hover:text-brand-pink hover:bg-pink-50 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Links */}
            <div className="p-6 space-y-2 flex-1 overflow-y-auto">
              <a 
                href="/PinataStore/"
                onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
                className={`w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm transition-colors flex items-center justify-between ${
                  currentRoute === 'home' ? 'bg-pink-100/70 text-brand-pink' : 'text-gray-800 hover:bg-pink-50 hover:text-brand-pink'
                }`}
              >
                <span>Home</span>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </a>

              <a 
                href="/PinataStore/shop"
                onClick={(e) => { e.preventDefault(); handleNavClick('shop'); }}
                className={`w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm transition-colors flex items-center justify-between ${
                  currentRoute === 'shop' ? 'bg-pink-100/70 text-brand-pink' : 'text-gray-800 hover:bg-pink-50 hover:text-brand-pink'
                }`}
              >
                <span>Shop All Piñatas</span>
                <span className="text-xs bg-pink-100 text-brand-pink font-bold px-2 py-0.5 rounded-full">Catalog</span>
              </a>

              <a 
                href="/PinataStore/customize"
                onClick={(e) => { e.preventDefault(); handleNavClick('customize'); }}
                className={`w-full text-left px-4 py-3 rounded-2xl font-bold text-sm transition-colors flex items-center justify-between ${
                  currentRoute === 'customize' ? 'bg-brand-pink text-white shadow-brand' : 'bg-brand-pinkLight text-brand-pink hover:bg-pink-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Custom Piñata Studio</span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-white/30 px-2 py-0.5 rounded-full">Bespoke</span>
              </a>

              <a 
                href="/PinataStore/track"
                onClick={(e) => { e.preventDefault(); handleNavClick('track'); }}
                className={`w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm transition-colors flex items-center justify-between ${
                  currentRoute === 'track' ? 'bg-pink-100/70 text-brand-pink' : 'text-gray-800 hover:bg-pink-50 hover:text-brand-pink'
                }`}
              >
                <span>Track Order</span>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </a>

              <a 
                href="/PinataStore/wishlist"
                onClick={(e) => { e.preventDefault(); handleNavClick('wishlist'); }}
                className={`w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm transition-colors flex items-center justify-between ${
                  currentRoute === 'wishlist' ? 'bg-pink-100/70 text-brand-pink' : 'text-gray-800 hover:bg-pink-50 hover:text-brand-pink'
                }`}
              >
                <span>Wishlist</span>
                {wishlistCount > 0 && (
                  <span className="text-xs font-bold text-white bg-brand-pink px-2 py-0.5 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </a>

              <a 
                href="/PinataStore/contact"
                onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
                className={`w-full text-left px-4 py-3 rounded-2xl font-semibold text-sm transition-colors flex items-center justify-between ${
                  currentRoute === 'contact' ? 'bg-pink-100/70 text-brand-pink' : 'text-gray-800 hover:bg-pink-50 hover:text-brand-pink'
                }`}
              >
                <span>Contact & Lahore Studio</span>
                <ArrowRight className="w-4 h-4 opacity-50" />
              </a>
            </div>

            {/* Bottom Lahore Assistance Box */}
            <div className="p-6 border-t border-pink-100 space-y-3 shrink-0 bg-brand-pinkSubtle/40">
              <div className="text-xs text-gray-600">
                <p className="font-bold text-brand-pink">Doorstep Delivery in Lahore</p>
                <p className="text-[11px] text-gray-500 mt-0.5">DHA, Gulberg, Bahria Town & all sectors.</p>
              </div>
              <a 
                href={getWhatsAppUrl("Hi Pinata Shop! I want to order a piñata in Lahore.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp to Order</span>
              </a>
            </div>

          </div>
        </div>,
        document.body
      )}
    </>
  );
};
