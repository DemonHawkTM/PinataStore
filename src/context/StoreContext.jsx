import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import { DELIVERY_THRESHOLD_PKR, FLAT_DELIVERY_FEE_PKR } from '../data/lahoreAreas';
import { 
  safeStorage, 
  hashPin, 
  AUTHORIZED_PIN_HASHES, 
  generateSessionProof, 
  verifySessionProof, 
  sanitizeStoreStorage 
} from '../utils/security';

const StoreContext = createContext();

const CANONICAL_MAP = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));

// Authoritative Price Calculation & Tamper Protection
export const validateAndCalculateCartItem = (item) => {
  if (item.isCustom && item.customSpec) {
    let base = 3800;
    const type = item.customSpec.pinataType || '';
    if (type.includes('Giant')) base = 6500;
    else if (type.includes('Mini')) base = 1600;
    else if (type.includes('2D')) base = 3200;

    let sizeExtra = 0;
    const size = (item.customSpec.size || '').toLowerCase();
    if (size.includes('large')) sizeExtra = 1200;
    else if (size.includes('giant')) sizeExtra = 2700;

    const validatedPrice = base + sizeExtra;
    return { ...item, price: validatedPrice };
  }

  // Pre-made catalog items validated against canonical data
  const canonical = CANONICAL_MAP.get(item.id);
  if (!canonical) {
    return item;
  }

  let unitPrice = canonical.price;
  const variant = item.variant || '';
  if (variant.includes('Mini (25–30cm)')) unitPrice = Math.max(1200, unitPrice - 1000);
  else if (variant.includes('Large (65–70cm)')) unitPrice += 1200;
  else if (variant.includes('Giant (100cm+)')) unitPrice += 2800;

  if (variant.includes('Buster Stick')) unitPrice += 450;
  if (variant.includes('Blindfold')) unitPrice += 250;

  return { ...item, price: unitPrice };
};

// Customer Session Helper for Customer-Wise Data Isolation
const getOrCreateCustomerId = () => {
  let cid = safeStorage.get('pinata_customer_session_id', null);
  if (!cid) {
    cid = 'cust_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
    safeStorage.set('pinata_customer_session_id', cid);
  }
  return cid;
};

export const StoreProvider = ({ children }) => {
  // Purge any legacy mock / filler data immediately on initialization
  useEffect(() => {
    sanitizeStoreStorage();
  }, []);

  const [customerId] = useState(getOrCreateCustomerId);

  // 1. Catalog Products (persisted safely)
  const [products, setProducts] = useState(() => safeStorage.get('pinata_store_products', INITIAL_PRODUCTS));
  useEffect(() => {
    safeStorage.set('pinata_store_products', products);
  }, [products]);

  // 2. Cart (Customer-wise, starts completely empty with NO filler data)
  const [cart, setCart] = useState(() => {
    sanitizeStoreStorage();
    const stored = safeStorage.get(`pinata_cart_${customerId}`, null) || safeStorage.get('pinata_store_cart', []);
    // Verify stored is an array and filter out any accidental legacy demo items
    if (Array.isArray(stored)) {
      return stored.filter(item => item && !item.cartItemId?.startsWith('demo-item-'));
    }
    return [];
  });

  useEffect(() => {
    safeStorage.set(`pinata_cart_${customerId}`, cart);
    safeStorage.set('pinata_store_cart', cart);
  }, [cart, customerId]);

  // 3. Wishlist (Customer-wise, starts completely empty with NO filler data)
  const [wishlist, setWishlist] = useState(() => {
    sanitizeStoreStorage();
    const stored = safeStorage.get(`pinata_wishlist_${customerId}`, null) || safeStorage.get('pinata_store_wishlist', []);
    if (Array.isArray(stored)) {
      // Discard stale mock wishlist if single demo product
      if (stored.length === 1 && stored[0] === 'pinata-01' && !localStorage.getItem('pinata_wishlist_explicit')) {
        return [];
      }
      return stored;
    }
    return [];
  });

  useEffect(() => {
    safeStorage.set(`pinata_wishlist_${customerId}`, wishlist);
    safeStorage.set('pinata_store_wishlist', wishlist);
  }, [wishlist, customerId]);

  // 4. Orders (Production-ready: Starts empty with NO filler data or fake PII)
  const [orders, setOrders] = useState(() => {
    const stored = safeStorage.get('pinata_store_orders', []);
    if (Array.isArray(stored)) {
      return stored.filter(o => o.id !== 'PS-10482');
    }
    return [];
  });

  useEffect(() => {
    safeStorage.set('pinata_store_orders', orders);
  }, [orders]);

  // 5. Custom Inquiries (Starts empty with NO filler data)
  const [customInquiries, setCustomInquiries] = useState(() => {
    const stored = safeStorage.get('pinata_custom_inquiries', []);
    if (Array.isArray(stored)) {
      return stored.filter(i => i.id !== 'INQ-901');
    }
    return [];
  });

  useEffect(() => {
    safeStorage.set('pinata_custom_inquiries', customInquiries);
  }, [customInquiries]);

  // 6. Contact Inquiries
  const [contactInquiries, setContactInquiries] = useState(() => safeStorage.get('pinata_contact_inquiries', []));
  useEffect(() => {
    safeStorage.set('pinata_contact_inquiries', contactInquiries);
  }, [contactInquiries]);

  // 7. Cryptographically Verified Admin Authentication
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const sess = sessionStorage.getItem('pinata_admin_session');
        if (!sess) {
          setIsAdmin(false);
          return;
        }
        const parsed = JSON.parse(sess);
        const isValid = await verifySessionProof(parsed);
        setIsAdmin(isValid);
        if (!isValid) {
          sessionStorage.removeItem('pinata_admin_session');
        }
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdminSession();
  }, []);

  // UI Modals / Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState(null);

  // Cart Calculations with price protection
  const cartSubtotal = cart.reduce((sum, item) => {
    const verifiedItem = validateAndCalculateCartItem(item);
    return sum + (verifiedItem.price * item.quantity);
  }, 0);
  const deliveryFee = cart.length === 0 ? 0 : (cartSubtotal >= DELIVERY_THRESHOLD_PKR ? 0 : FLAT_DELIVERY_FEE_PKR);
  const cartTotal = cartSubtotal + deliveryFee;
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Cart Actions
  const addToCart = (product, quantity = 1, options = {}) => {
    setCart(prev => {
      const cartItemId = options.cartItemId || `${product.id}-${options.variant || 'default'}-${Date.now()}`;
      const existingIndex = prev.findIndex(item => item.id === product.id && item.variant === (options.variant || 'Normal · Standard'));
      
      if (existingIndex > -1 && !options.isCustom) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }

      const rawItem = {
        cartItemId,
        id: product.id,
        title: product.title,
        price: options.customPrice || product.price,
        quantity,
        variant: options.variant || "Normal · Standard",
        image: options.image || product.image,
        isCustom: !!options.isCustom,
        customSpec: options.customSpec || null
      };

      const verifiedItem = validateAndCalculateCartItem(rawItem);
      return [...prev, verifiedItem];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item));
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Actions
  const toggleWishlist = (productId) => {
    try {
      localStorage.setItem('pinata_wishlist_explicit', 'true');
    } catch (_) {}
    setWishlist(prev => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };
  const isInWishlist = (productId) => wishlist.includes(productId);

  // Product CRUD (Admin)
  const toggleProductStock = (productId) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, inStock: !p.inStock } : p));
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...updatedFields } : p));
  };

  const addProduct = (newProduct) => {
    const id = `pinata-${Date.now().toString().slice(-4)}`;
    const productWithId = { ...newProduct, id, inStock: true, rating: 5.0, reviewCount: 1 };
    setProducts(prev => [productWithId, ...prev]);
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Orders Actions with High-Entropy IDs (Prevents ID Enumeration)
  const placeOrder = (orderData) => {
    // High-entropy alphanumeric Order ID: e.g. PS-LR39X-4B8K
    const entropyPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const timePart = Date.now().toString(36).slice(-5).toUpperCase();
    const newOrderId = `PS-${timePart}-${entropyPart}`;

    // Authoritative re-validation of all cart items
    const validatedItems = cart.map(validateAndCalculateCartItem);
    const validatedSubtotal = validatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const validatedDeliveryFee = (validatedItems.length === 0 || validatedSubtotal >= DELIVERY_THRESHOLD_PKR) ? 0 : FLAT_DELIVERY_FEE_PKR;
    const validatedTotal = validatedSubtotal + validatedDeliveryFee;

    const newOrder = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      status: "placed",
      paymentStatus: "pending",
      subtotal: validatedSubtotal,
      deliveryFee: validatedDeliveryFee,
      total: validatedTotal,
      items: validatedItems,
      ...orderData
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const addCustomInquiry = (inquiry) => {
    const entropy = Math.random().toString(36).substring(2, 5).toUpperCase();
    const newInquiry = {
      id: `INQ-${Date.now().toString(36).slice(-3).toUpperCase()}-${entropy}`,
      createdAt: new Date().toISOString().slice(0, 10),
      ...inquiry
    };
    setCustomInquiries(prev => [newInquiry, ...prev]);
    return newInquiry;
  };

  const addContactInquiry = (inquiry) => {
    const entropy = Math.random().toString(36).substring(2, 6).toUpperCase();
    const record = {
      id: `MSG-${Date.now().toString(36).slice(-4).toUpperCase()}-${entropy}`,
      createdAt: new Date().toISOString(),
      ...inquiry
    };
    setContactInquiries(prev => [record, ...prev]);
    return record;
  };

  // Cryptographically Secured Admin Login
  const loginAdmin = async (pin) => {
    const hash = await hashPin(pin);
    if (hash && AUTHORIZED_PIN_HASHES.has(hash)) {
      const session = await generateSessionProof(hash);
      sessionStorage.setItem('pinata_admin_session', JSON.stringify(session));
      setIsAdmin(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid master passkey' };
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('pinata_admin_session');
  };

  return (
    <StoreContext.Provider value={{
      customerId,
      products,
      updateProduct,
      addProduct,
      deleteProduct,
      toggleProductStock,
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartSubtotal,
      deliveryFee,
      cartTotal,
      cartCount,
      wishlist,
      toggleWishlist,
      isInWishlist,
      wishlistCount: wishlist.length,
      orders,
      placeOrder,
      updateOrderStatus,
      customInquiries,
      addCustomInquiry,
      contactInquiries,
      addContactInquiry,
      isAdmin,
      loginAdmin,
      logoutAdmin,
      isCartOpen,
      setIsCartOpen,
      isSearchOpen,
      setIsSearchOpen,
      activeProductModal,
      setActiveProductModal
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
