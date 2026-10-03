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
  const { isAdmin } = useStore();
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
