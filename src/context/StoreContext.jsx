import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import { DELIVERY_THRESHOLD_PKR, FLAT_DELIVERY_FEE_PKR } from '../data/lahoreAreas';

const StoreContext = createContext();

const DEMO_INITIAL_ORDERS = [
  {
    id: "PS-10482",
    createdAt: "2026-10-01T14:30:00Z",
    customer: {
      fullName: "Sara Khan",
      email: "sara@example.com",
      phone: "+92 300 8492019",
      lahoreArea: "DHA Phase 5 - 6",
      streetAddress: "House 42, Sector C, DHA Phase 5, Lahore"
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
  // 1. Catalog Products (persisted)
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('pinata_store_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('pinata_store_products', JSON.stringify(products));
  }, [products]);

  // 2. Cart (persisted)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('pinata_store_cart');
    return saved ? JSON.parse(saved) : [
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
    ];
  });

  useEffect(() => {
    localStorage.setItem('pinata_store_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. Wishlist (persisted)
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('pinata_store_wishlist');
    return saved ? JSON.parse(saved) : ["pinata-01"];
  });

  useEffect(() => {
    localStorage.setItem('pinata_store_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // 4. Orders (persisted)
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('pinata_store_orders');
    return saved ? JSON.parse(saved) : DEMO_INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('pinata_store_orders', JSON.stringify(orders));
  }, [orders]);

  // 5. Custom Inquiries (persisted)
  const [customInquiries, setCustomInquiries] = useState(() => {
    const saved = localStorage.getItem('pinata_custom_inquiries');
    return saved ? JSON.parse(saved) : [
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
    ];
  });

  useEffect(() => {
    localStorage.setItem('pinata_custom_inquiries', JSON.stringify(customInquiries));
  }, [customInquiries]);

  // 6. Admin Authentication
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('pinata_admin_auth') === 'true';
  });

  // UI Modals / Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState(null);

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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

      return [
        ...prev,
        {
          cartItemId,
          id: product.id,
          title: product.title,
          price: options.customPrice || product.price,
          quantity,
          variant: options.variant || "Normal · Standard",
          image: options.image || product.image,
          isCustom: !!options.isCustom,
          customSpec: options.customSpec || null
        }
      ];
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

  // Orders Actions
  const placeOrder = (orderData) => {
    const newOrderId = `PS-${Math.floor(10000 + Math.random() * 90000)}`;
    const newOrder = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      status: "placed",
      paymentStatus: "pending",
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartTotal,
      items: [...cart],
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

  // Admin Auth
  const loginAdmin = (pin) => {
    if (pin === '1234' || pin === 'admin123') {
      setIsAdmin(true);
      sessionStorage.setItem('pinata_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('pinata_admin_auth');
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
