import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';
import { ProductModal } from './components/ProductModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CustomizePage } from './pages/CustomizePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';

const getRouteFromUrl = () => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
  const pathSegments = window.location.pathname.toLowerCase().split('/').filter(Boolean);
  const lastPath = pathSegments[pathSegments.length - 1] || '';
  const target = hash || lastPath;

  if (target === 'admin' || target === 'admin-login' || target === 'admin-dashboard') {
    return 'admin';
  }
  if (['shop', 'customize', 'cart', 'checkout', 'track', 'wishlist', 'contact'].includes(target)) {
    return target;
  }
  return 'home';
};

function AppContent() {
  const { products, activeProductModal, setActiveProductModal, isAdmin } = useStore();
  const [currentRoute, setCurrentRoute] = useState(getRouteFromUrl);
  const [queryParams, setQueryParams] = useState({});

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(getRouteFromUrl());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Dedicated Product URL deep-linking (?product=...)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const productParam = searchParams.get('product');
      if (productParam && products.length > 0 && !activeProductModal) {
        const match = products.find(p => p.slug === productParam || p.id === productParam);
        if (match) {
          setActiveProductModal(match);
        }
      }
    } catch (_) {}
  }, [products, activeProductModal, setActiveProductModal]);

  // Dynamic Document Title & Meta Description per Page (SEO Requirement)
  useEffect(() => {
    let title = 'Pinata Shop Lahore — Custom Handmade Piñatas';
    let desc = 'Custom 3D & 2D handcrafted piñatas in Lahore. Over 1,000+ custom party themes sculpted and delivered across Lahore.';

    if (activeProductModal) {
      title = `${activeProductModal.title} | Pinata Shop Lahore`;
      desc = `${activeProductModal.title} - PKR ${activeProductModal.price?.toLocaleString()}. Handcrafted in Lahore with 5–7 days lead time. Order on Pinata Shop Lahore.`;
    } else {
      switch (currentRoute) {
        case 'shop':
          title = 'Handcrafted Piñatas Catalog | Pinata Shop Lahore';
          desc = 'Browse 3D character, 2D pull-string, giant celebration and mini tabletop piñatas handcrafted in Lahore.';
          break;
        case 'customize':
          title = 'Bespoke Custom Piñata Studio Lahore | Order 3D & 2D Piñatas';
          desc = 'Design your bespoke custom piñata with instant quote, photo upload, and Lahore doorstep delivery.';
          break;
        case 'track':
          title = 'Track Your Piñata Order | Pinata Shop Lahore';
          desc = 'Track real-time craft progress and delivery status for your handcrafted piñata in Lahore.';
          break;
        case 'contact':
          title = 'Contact Lahore Piñata Workshop | Gulberg & DHA Delivery';
          desc = 'Get in touch with our Lahore artisans for custom party themes, lead times, and urgent orders.';
          break;
        case 'cart':
          title = 'Shopping Cart | Pinata Shop Lahore';
          desc = 'Your selected handcrafted piñatas and party accessories ready for checkout.';
          break;
        case 'checkout':
          title = 'Secure Checkout | Pinata Shop Lahore';
          desc = 'Doorstep Lahore delivery with Cash on Delivery, JazzCash & EasyPaisa payments.';
          break;
        case 'wishlist':
          title = 'Your Wishlist | Pinata Shop Lahore';
          desc = 'Saved handcrafted piñatas for your upcoming birthday and milestone celebrations in Lahore.';
          break;
        case 'admin':
          title = 'Studio Security Gate | Pinata Shop Lahore';
          desc = 'Authorized Lahore Studio personnel access portal.';
          break;
        default:
          title = 'Pinata Shop Lahore — Custom Handmade Piñatas';
          desc = 'Custom 3D & 2D handcrafted piñatas in Lahore. Over 1,000+ custom party themes sculpted and delivered across Lahore.';
      }
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);
    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', desc);
  }, [currentRoute, activeProductModal]);

  const navigate = (route, params = {}) => {
    setCurrentRoute(route);
    setQueryParams(params);

    const isGhPages = window.location.pathname.startsWith('/PinataStore');
    const basePath = isGhPages ? '/PinataStore' : '';
    const urlPath = route === 'home' ? (basePath || '/') : `${basePath}/${route}`;
    if (window.location.pathname !== urlPath) {
      window.history.pushState(null, '', urlPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans selection:bg-brand-pink selection:text-white">
      {/* Top Announcement Bar */}
      <AnnouncementBar />

      {/* Navigation Bar */}
      <Navbar currentRoute={currentRoute} navigate={navigate} />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentRoute === 'home' && <HomePage navigate={navigate} />}
        {currentRoute === 'shop' && <ShopPage queryParams={queryParams} navigate={navigate} />}
        {currentRoute === 'customize' && <CustomizePage navigate={navigate} />}
        {currentRoute === 'cart' && <CartPage navigate={navigate} />}
        {currentRoute === 'checkout' && <CheckoutPage navigate={navigate} />}
        {currentRoute === 'track' && <TrackOrderPage queryParams={queryParams} navigate={navigate} />}
        {currentRoute === 'wishlist' && <WishlistPage navigate={navigate} />}
        {currentRoute === 'contact' && <ContactPage navigate={navigate} />}
        
        {/* Private Admin Route (URL only: /admin) with Route Guard */}
        {currentRoute === 'admin' && (
          isAdmin ? <AdminDashboard navigate={navigate} /> : <AdminLoginPage navigate={navigate} />
        )}
      </main>

      {/* Global Footer */}
      <Footer navigate={navigate} />

      {/* Slide-over Drawers & Modals */}
      <CartDrawer navigate={navigate} />
      <SearchModal navigate={navigate} />
      <ProductModal />
    </div>
  );
}

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
