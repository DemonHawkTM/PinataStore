import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import { DELIVERY_THRESHOLD_PKR, FLAT_DELIVERY_FEE_PKR } from '../data/lahoreAreas';
import { safeStorage, hashPin, AUTHORIZED_PIN_HASHES, generateSessionProof } from '../utils/security';

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

const DEMO_INITIAL_ORDERS = [
  {
    id: "PS-10482",
    createdAt: "2026-10-01T14:30:00Z",
    customer: {
      fullName: "Sara Khan",
      email: "sara@example.com",
      phone: "+92 300 8492019",
      lahoreArea: "DHA Phase 5 - 6",
      streetAddress: "Sector C, DHA Phase 5, Lahore"
    },
    partyDate: "2026-10-10",
    items: [
      {
        id: "pinata-01",
        title: "Unicorn Dream Piñata",
        price: 3500,
        quantity: 1,
        variant: "Normal 45-50cm · Pink & Gold",
        image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80"
      },
      {
        id: "pinata-06",
        title: "Mini Heart Tabletop Piñata",
        price: 1200,
        quantity: 2,
        variant: "Mini · Romantic Red",
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80"
      }
    ],
    subtotal: 5900,
    deliveryFee: 0,
    total: 5900,
    paymentMethod: "cod",
    paymentStatus: "deposit_paid", // pending, deposit_paid, completed
    status: "crafting", // placed, deposit_received, crafting, dispatched, delivered
    notes: "Please pack gently with pastel ribbons. Surprise for 4th birthday!"
  }
];

export const StoreProvider = ({ children }) => {
  // 1. Catalog Products (persisted safely)
  const [products, setProducts] = useState(() => safeStorage.get('pinata_store_products', INITIAL_PRODUCTS));
  useEffect(() => {
    safeStorage.set('pinata_store_products', products);
  }, [products]);

  // 2. Cart (persisted safely)
  const [cart, setCart] = useState(() => safeStorage.get('pinata_store_cart', [
    {
      cartItemId: "demo-item-1",
      id: "pinata-01",
      title: "Unicorn Dream Piñata",
      price: 3500,
      quantity: 1,
      variant: "Normal · Pink",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80"
    },
    {
      cartItemId: "demo-item-2",
      id: "pinata-06",
      title: "Mini Heart Piñata",
      price: 1200,
      quantity: 2,
      variant: "Normal · Pink",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80"
    }
  ]));
  useEffect(() => {
    safeStorage.set('pinata_store_cart', cart);
  }, [cart]);

  // 3. Wishlist (persisted safely)
  const [wishlist, setWishlist] = useState(() => safeStorage.get('pinata_store_wishlist', ["pinata-01"]));
  useEffect(() => {
    safeStorage.set('pinata_store_wishlist', wishlist);
  }, [wishlist]);

  // 4. Orders (persisted safely)
  const [orders, setOrders] = useState(() => safeStorage.get('pinata_store_orders', DEMO_INITIAL_ORDERS));
  useEffect(() => {
    safeStorage.set('pinata_store_orders', orders);
  }, [orders]);

  // 5. Custom Inquiries (persisted safely)
  const [customInquiries, setCustomInquiries] = useState(() => safeStorage.get('pinata_custom_inquiries', [
    {
      id: "INQ-901",
      customerName: "Ayesha Malik",
      whatsapp: "+92 321 4455667",
      pinataType: "3D Character",
      size: "Normal (45-50cm)",
      color: "Pink & Mint",
      textOnPiece: "Zayd Turns 3",
      partyDate: "2026-10-15",
      estimatedPrice: 3800,
      specialInstructions: "Needs pull string for small toddlers",
      createdAt: "2026-10-02"
    }
  ]));
  useEffect(() => {
    safeStorage.set('pinata_custom_inquiries', customInquiries);
  }, [customInquiries]);

  // 6. Contact Inquiries (prevents silent drop of contact form submissions)
  const [contactInquiries, setContactInquiries] = useState(() => safeStorage.get('pinata_contact_inquiries', []));
  useEffect(() => {
    safeStorage.set('pinata_contact_inquiries', contactInquiries);
  }, [contactInquiries]);

  // 7. Cryptographically Hashed Admin Authentication
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const sess = sessionStorage.getItem('pinata_admin_session');
      if (!sess) return false;
      const parsed = JSON.parse(sess);
      return !!(parsed && parsed.token && parsed.expiresAt > Date.now());
    } catch {
      return false;
    }
  });

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

      // Ensure price conforms to canonical rules
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

  const clearCart = () => setCart([]);

  // Wishlist Actions
  const toggleWishlist = (productId) => {
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

  // Orders Actions with Authoritative Price Validation
  const placeOrder = (orderData) => {
    const newOrderId = `PS-${Math.floor(10000 + Math.random() * 90000)}`;

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
    const newInquiry = {
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().slice(0, 10),
      ...inquiry
    };
    setCustomInquiries(prev => [newInquiry, ...prev]);
    return newInquiry;
  };

  const addContactInquiry = (inquiry) => {
    const record = {
      id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      ...inquiry
    };
    setContactInquiries(prev => [record, ...prev]);
    return record;
  };

  // Admin Auth via SHA-256 and Session Token
  const loginAdmin = async (pin) => {
    const hash = await hashPin(pin);
    if (hash && AUTHORIZED_PIN_HASHES.has(hash)) {
      const session = generateSessionProof();
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
