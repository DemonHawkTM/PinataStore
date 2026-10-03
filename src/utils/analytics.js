/**
 * Storefront Visitor & Traffic Analytics Engine
 * Pinata Store Lahore
 * Tracks page views, product popularity, conversion events, and device telemetry
 */

const ANALYTICS_STORAGE_KEY = 'pinata_store_analytics_v1';
const VISITOR_SESSION_KEY = 'pinata_analytics_visitor_id';

// Helper to get or create unique visitor ID
const getVisitorId = () => {
  if (typeof window === 'undefined') return 'anon';
  let vid = sessionStorage.getItem(VISITOR_SESSION_KEY);
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
    sessionStorage.setItem(VISITOR_SESSION_KEY, vid);
  }
  return vid;
};

// Initial state
const getInitialState = () => ({
  totalPageViews: 0,
  uniqueVisitors: [],
  pageViewsByRoute: {
    home: 0,
    shop: 0,
    customize: 0,
    track: 0,
    contact: 0,
    cart: 0,
    checkout: 0,
    wishlist: 0
  },
  productViews: {}, // { [productId]: { count: 0, title: '' } }
  events: {
    addToCart: 0,
    whatsappInquiry: 0,
    orderPlaced: 0,
    customInquiry: 0,
    wishlistToggle: 0
  },
  deviceTypes: {
    mobile: 0,
    desktop: 0
  },
  recentActivity: [] // Last 40 activities
});

// Safe read
export const getAnalyticsData = () => {
  if (typeof window === 'undefined') return getInitialState();
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw);
    return { ...getInitialState(), ...parsed };
  } catch {
    return getInitialState();
  }
};

// Safe write
const saveAnalyticsData = (data) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Analytics storage quota:', e);
  }
};

// 1. Record Page View
export const recordPageView = (route = 'home') => {
  if (typeof window === 'undefined' || route === 'admin') return;
  
  const data = getAnalyticsData();
  const visitorId = getVisitorId();
  const isMobile = window.innerWidth < 768;

  data.totalPageViews = (data.totalPageViews || 0) + 1;
  
  // Track unique visitor IDs (capped at 500)
  if (!Array.isArray(data.uniqueVisitors)) data.uniqueVisitors = [];
  if (!data.uniqueVisitors.includes(visitorId)) {
    data.uniqueVisitors.push(visitorId);
    if (data.uniqueVisitors.length > 500) data.uniqueVisitors.shift();
  }

  // Route tally
  const cleanRoute = (route || 'home').toLowerCase();
  data.pageViewsByRoute[cleanRoute] = (data.pageViewsByRoute[cleanRoute] || 0) + 1;

  // Device tally
  if (isMobile) {
    data.deviceTypes.mobile = (data.deviceTypes.mobile || 0) + 1;
  } else {
    data.deviceTypes.desktop = (data.deviceTypes.desktop || 0) + 1;
  }

  // Recent activity stream
  const activityItem = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    type: 'page_view',
    route: cleanRoute,
    timestamp: new Date().toISOString(),
    device: isMobile ? 'Mobile' : 'Desktop'
  };

  data.recentActivity = [activityItem, ...(data.recentActivity || [])].slice(0, 40);

  saveAnalyticsData(data);
};

// 2. Record Product View
export const recordProductView = (productId, productTitle = '') => {
  if (typeof window === 'undefined' || !productId) return;

  const data = getAnalyticsData();
  if (!data.productViews) data.productViews = {};

  const current = data.productViews[productId] || { count: 0, title: productTitle || productId };
  data.productViews[productId] = {
    count: current.count + 1,
    title: productTitle || current.title || productId
  };

  const activityItem = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    type: 'product_view',
    title: productTitle || productId,
    timestamp: new Date().toISOString()
  };

  data.recentActivity = [activityItem, ...(data.recentActivity || [])].slice(0, 40);

  saveAnalyticsData(data);
};

// 3. Record Interaction Event (WhatsApp, Add-to-cart, Order)
export const recordAnalyticsEvent = (eventType, label = '') => {
  if (typeof window === 'undefined' || !eventType) return;

  const data = getAnalyticsData();
  if (!data.events) data.events = {};

  if (eventType === 'add_to_cart') data.events.addToCart = (data.events.addToCart || 0) + 1;
  if (eventType === 'whatsapp_inquiry') data.events.whatsappInquiry = (data.events.whatsappInquiry || 0) + 1;
  if (eventType === 'order_placed') data.events.orderPlaced = (data.events.orderPlaced || 0) + 1;
  if (eventType === 'custom_inquiry') data.events.customInquiry = (data.events.customInquiry || 0) + 1;
  if (eventType === 'wishlist') data.events.wishlistToggle = (data.events.wishlistToggle || 0) + 1;

  const activityItem = {
    id: Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    type: eventType,
    label,
    timestamp: new Date().toISOString()
  };

  data.recentActivity = [activityItem, ...(data.recentActivity || [])].slice(0, 40);

  saveAnalyticsData(data);
};

// 4. Reset Analytics Data
export const resetAnalyticsData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ANALYTICS_STORAGE_KEY);
};
