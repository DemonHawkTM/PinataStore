import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { compressImage } from '../utils/security';
import { getAnalyticsData, resetAnalyticsData } from '../utils/analytics';
import { STORE_CONFIG } from '../config/storeConfig';
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  LogOut, 
  Eye, 
  Sparkles, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Upload, 
  Calendar,
  CheckCircle2,
  DollarSign,
  BarChart3,
  TrendingUp,
  Users,
  MousePointer,
  Download,
  Copy,
  FileCode,
  Tag,
  Percent,
  Smartphone,
  Monitor,
  RefreshCw
} from 'lucide-react';

export const AdminDashboard = ({ navigate }) => {
  const { 
    isAdmin, 
    logoutAdmin, 
    products, 
    toggleProductStock, 
    addProduct, 
    deleteProduct, 
    updateProduct,
    orders, 
    updateOrderStatus, 
    customInquiries,
    contactInquiries
  } = useStore();

  const [activeTab, setActiveTab] = useState('products'); // products, orders, inquiries, analytics
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit Product Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('3d');
  const [editPrice, setEditPrice] = useState('');
  const [editOriginalPrice, setEditOriginalPrice] = useState('');
  const [editDimensions, setEditDimensions] = useState('50cm x 40cm x 15cm');
  const [editBadge, setEditBadge] = useState('None');
  const [editImage, setEditImage] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editInStock, setEditInStock] = useState(true);

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('3d');
  const [newPrice, setNewPrice] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newDimensions, setNewDimensions] = useState('50cm x 40cm x 15cm');
  const [newBadge, setNewBadge] = useState('None');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Permanent Catalog Export State
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState(() => getAnalyticsData());
  const refreshAnalytics = () => {
    setAnalyticsData(getAnalyticsData());
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      refreshAnalytics();
    }
  }, [activeTab]);

  if (!isAdmin) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 mt-3">Access Denied</h2>
        <p className="text-xs text-gray-500 mt-1">Please authenticate with your PIN.</p>
        <button
          onClick={() => navigate('admin-login')}
          className="mt-4 px-6 py-2.5 bg-brand-pink text-white rounded-full font-bold text-xs"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newTitle || !newPrice) {
      alert("Please provide title and price");
      return;
    }

    const catObj = CATEGORIES.find(c => c.id === newCategory) || CATEGORIES[1];
    const parsedPrice = parseInt(newPrice, 10);
    const parsedOriginal = newOriginalPrice ? parseInt(newOriginalPrice, 10) : null;

    addProduct({
      title: newTitle.trim(),
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newCategory,
      categoryLabel: catObj.label,
      occasion: "birthday",
      price: parsedPrice,
      originalPrice: (parsedOriginal && parsedOriginal > parsedPrice) ? parsedOriginal : null,
      dimensions: newDimensions,
      badge: newBadge === 'None' ? '' : newBadge,
      image: newImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
      description: newDesc || "Artisanal custom piñata handcrafted in our Lahore studio."
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewPrice('');
    setNewOriginalPrice('');
    setNewImage('');
    setNewDesc('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 600, 600, 0.75);
        setNewImage(compressed);
      } catch (err) {
        alert(err.message || 'Image processing failed');
      }
    }
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setEditTitle(product.title || '');
    setEditCategory(product.category || '3d');
    setEditPrice(product.price ? product.price.toString() : '');
    setEditOriginalPrice(product.originalPrice ? product.originalPrice.toString() : '');
    setEditDimensions(product.dimensions || '50cm x 40cm x 15cm');
    setEditBadge(product.badge || 'None');
    setEditImage(product.image || '');
    setEditDesc(product.description || '');
    setEditInStock(product.inStock !== false);
    setShowEditModal(true);
  };

  const handleSaveEditedProduct = (e) => {
    e.preventDefault();
    if (!editingProduct || !editTitle || !editPrice) {
      alert("Please provide title and price");
      return;
    }

    const catObj = CATEGORIES.find(c => c.id === editCategory) || CATEGORIES[1];
    const parsedPrice = parseInt(editPrice, 10);
    const parsedOriginal = editOriginalPrice ? parseInt(editOriginalPrice, 10) : null;

    updateProduct(editingProduct.id, {
      title: editTitle.trim(),
      category: editCategory,
      categoryLabel: catObj.label,
      price: parsedPrice,
      originalPrice: (parsedOriginal && parsedOriginal > parsedPrice) ? parsedOriginal : null,
      dimensions: editDimensions,
      badge: editBadge === 'None' ? '' : editBadge,
      image: editImage || editingProduct.image,
      description: editDesc,
      inStock: editInStock
    });

    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleEditImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file, 600, 600, 0.75);
        setEditImage(compressed);
      } catch (err) {
        alert(err.message || 'Image processing failed');
      }
    }
  };

  const generateProductsJsCode = () => {
    return `export const INITIAL_PRODUCTS = ${JSON.stringify(products, null, 2)};\n`;
  };

  const handleCopyCatalog = () => {
    const code = generateProductsJsCode();
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleDownloadProductsJs = () => {
    const code = generateProductsJsCode();
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const outOfStockCount = products.filter(p => !p.inStock).length;

  return (
    <div className="py-8 sm:py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪅</span>
              <span className="text-xs font-bold bg-pink-100 text-brand-pink px-2.5 py-0.5 rounded-full uppercase">
                Lahore Admin Back-Office
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Store Control & Inventory Portal
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage live Lahore catalog, 1-click out-of-stock toggles, and live order progression.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => navigate('home')}
              className="px-4 py-2 bg-pink-50 hover:bg-pink-100 text-brand-pink text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Live Store</span>
            </button>
            <button
              onClick={() => {
                logoutAdmin();
                navigate('home');
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* KPI Metric Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
            <span className="text-xs text-gray-500 font-medium">Total Piñata Designs</span>
            <div className="text-2xl font-extrabold text-gray-900 mt-1">{products.length}</div>
            <span className="text-[11px] text-emerald-600 font-semibold">{products.length - outOfStockCount} active in stock</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
            <span className="text-xs text-gray-500 font-medium">Out of Stock Items</span>
            <div className={`text-2xl font-extrabold mt-1 ${outOfStockCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
              {outOfStockCount}
            </div>
            <span className="text-[11px] text-gray-400">1-click toggle anytime</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
            <span className="text-xs text-gray-500 font-medium">Total Lahore Orders</span>
            <div className="text-2xl font-extrabold text-brand-pink mt-1">{orders.length}</div>
            <span className="text-[11px] text-gray-400">Syncs with /track</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
            <span className="text-xs text-gray-500 font-medium">Custom Studio Inquiries</span>
            <div className="text-2xl font-extrabold text-brand-teal mt-1">{customInquiries.length}</div>
            <span className="text-[11px] text-gray-400">Direct WhatsApp quotes</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'products'
                ? 'border-brand-pink text-brand-pink bg-white rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Product Catalog & Stock ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'orders'
                ? 'border-brand-pink text-brand-pink bg-white rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Live Orders & Tracking ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === 'inquiries'
                ? 'border-brand-pink text-brand-pink bg-white rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Custom Quotes & Photos ({customInquiries.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('analytics');
              refreshAnalytics();
            }}
            className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'border-brand-pink text-brand-pink bg-white rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Traffic & Visitor Analytics</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT CATALOG & STOCK CONTROLS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900">Live Inventory List</h2>
                <p className="text-xs text-gray-500">Edit products, put items on sale, toggle stock states, or export code.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-3.5 py-2.5 bg-white hover:bg-pink-50 text-gray-700 hover:text-brand-pink border border-pink-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                  title="Make product additions & edits permanently visible to incognito & all devices"
                >
                  <FileCode className="w-4 h-4 text-brand-pink" />
                  <span>Permanent Deploy / Export</span>
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2.5 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Piñata</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-600">
                  <thead className="bg-pink-50/60 text-gray-700 font-bold uppercase text-[10px] tracking-wider border-b border-pink-100">
                    <tr>
                      <th className="py-3.5 px-4">Design / Image</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price (PKR)</th>
                      <th className="py-3.5 px-4 text-center">Stock State (1-Click Toggle)</th>
                      <th className="py-3.5 px-4">Badge</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-pink-50/30 transition-colors">
                        
                        {/* Design & Title */}
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                          <div>
                            <span className="font-bold text-gray-900 block text-xs">{item.title}</span>
                            <span className="text-[11px] text-gray-400">{item.dimensions}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-[10px]">
                            {item.categoryLabel}
                          </span>
                        </td>

                        {/* Price & Sale Status */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-extrabold text-brand-pink text-xs">
                              PKR {item.price.toLocaleString()}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price ? (
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[10px] text-gray-400 line-through">
                                  PKR {item.originalPrice.toLocaleString()}
                                </span>
                                <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1 py-0.2 rounded">
                                  {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                                </span>
                              </div>
                            ) : null}
                          </div>
                        </td>

                        {/* 1-Click Stock Toggle */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => toggleProductStock(item.id)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5 transition-all shadow-sm ${
                              item.inStock
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                            title="Click to toggle In Stock / Out of Stock"
                          >
                            <span className={`w-2 h-2 rounded-full ${item.inStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                            <span>{item.inStock ? 'In Stock' : 'Out of Stock'}</span>
                          </button>
                        </td>

                        {/* Badge */}
                        <td className="py-3 px-4">
                          {item.badge ? (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.badge === 'Sale' ? 'bg-red-100 text-red-700' :
                              item.badge === 'Bestseller' ? 'bg-pink-100 text-brand-pink' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {item.badge}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 text-gray-500 hover:text-brand-pink rounded-lg hover:bg-pink-50 transition-colors"
                              title="Edit product, sale price, or details"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete design"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ORDERS & TRACKING PROGRESSION */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Lahore Order Management</h2>
              <p className="text-xs text-gray-500">Updating milestone stages here updates the customer's /track page in real-time.</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-gray-500">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <h3 className="font-bold text-gray-800 text-sm">No customer orders placed yet</h3>
                <p className="text-xs text-gray-400 mt-1">New customer orders will appear here in real-time as they checkout.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-brand-pink text-base">{order.id}</span>
                        <span className="text-xs text-gray-400">• Booked on {new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-800 mt-0.5">
                        {order.customer.fullName} ({order.customer.phone})
                      </p>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-brand-pink" />
                        <span>{order.customer.streetAddress}, {order.customer.lahoreArea}</span>
                      </p>
                    </div>

                    {/* Order Status Control */}
                    <div className="flex flex-col sm:items-end gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        Current Milestone (Syncs to /track):
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="px-3.5 py-1.5 rounded-xl border border-pink-200 bg-pink-50/50 text-brand-pink font-bold text-xs focus:outline-none cursor-pointer"
                      >
                        <option value="placed">1. Placed (Pending)</option>
                        <option value="deposit_received">2. 50% Deposit Received</option>
                        <option value="crafting">3. In Crafting (Workshop)</option>
                        <option value="dispatched">4. Dispatched in Lahore</option>
                        <option value="delivered">5. Delivered & Completed</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 text-xs">
                        {it.image && <img src={it.image} alt={it.title} className="w-10 h-10 object-cover rounded-lg shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 truncate">{it.title}</p>
                          <p className="text-[11px] text-gray-400">{it.variant}</p>
                        </div>
                        <span className="font-extrabold text-brand-pink">PKR {(it.price * it.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Action Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
                    <div>
                      <span className="text-gray-500">Party Date: </span>
                      <strong className="text-gray-800">{order.partyDate}</strong>
                      <span className="text-gray-400 ml-3">Method: {order.paymentMethod.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-gray-900">Total: PKR {order.total.toLocaleString()}</span>
                      <a
                        href={`https://wa.me/${(order.customer.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${order.customer.fullName || 'Customer'}! Regarding your piñata order ${order.id}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Client</span>
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CUSTOM STUDIO INQUIRIES & REFERENCE VIEWER */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Custom Studio Reference Submissions</h2>
            <p className="text-xs text-gray-500">Inspect customer uploaded sketches and respond with a quote via WhatsApp.</p>
          </div>

          {customInquiries.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-gray-500">
              <Sparkles className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <h3 className="font-bold text-gray-800 text-sm">No custom inquiries submitted yet</h3>
              <p className="text-xs text-gray-400 mt-1">Customer reference photos and bespoke requests from the Custom Studio will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customInquiries.map((inq) => (
                <div key={inq.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-brand-pink text-xs">{inq.id}</span>
                      <span className="text-[11px] text-gray-400">{inq.createdAt}</span>
                    </div>

                    <div className="flex gap-4">
                      {inq.referenceImage ? (
                        <img 
                          src={inq.referenceImage} 
                          alt="Customer uploaded reference" 
                          className="w-24 h-24 object-cover rounded-2xl shadow-sm border border-pink-100 shrink-0" 
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-pink-50 text-pink-300 flex items-center justify-center shrink-0">
                          <Package className="w-8 h-8" />
                        </div>
                      )}

                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-gray-900 text-sm">{inq.customerName}</h4>
                        <p className="text-gray-500">Phone: {inq.whatsapp}</p>
                        <p className="text-brand-teal font-semibold">{inq.pinataType} ({inq.size})</p>
                        <p className="text-gray-600">Colour: {inq.color}</p>
                        <p className="text-gray-600">Text: "{inq.textOnPiece}"</p>
                      </div>
                    </div>

                    {inq.specialInstructions && (
                      <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 italic">
                        "{inq.specialInstructions}"
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-gray-400">Estimated: </span>
                      <strong className="text-brand-pink font-extrabold">PKR {inq.estimatedPrice?.toLocaleString()}</strong>
                    </div>
                    {(() => {
                      const msg = encodeURIComponent(
                        `Hi ${inq.customerName || 'Customer'}! We reviewed your custom piñata request (${inq.pinataType}) for party date ${inq.partyDate || 'upcoming'}. Our Lahore artisan is ready to begin!`
                      );
                      const cleanPhone = (inq.whatsapp || '').replace(/[^0-9]/g, '');
                      return (
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${msg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>WhatsApp Quick Reply</span>
                        </a>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}

            {/* General Contact Form Inquiries */}
            {contactInquiries && contactInquiries.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                  Workshop Contact Inquiries ({contactInquiries.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contactInquiries.map((msg) => (
                    <div key={msg.id} className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900">{msg.name || 'Customer'}</h4>
                          <span className="text-xs text-gray-500">{msg.phone}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-mono">{msg.id}</span>
                      </div>
                      <p className="text-xs text-gray-600 bg-gray-50 p-3 rounded-xl italic">
                        "{msg.message}"
                      </p>
                      <div className="pt-2 border-t border-gray-100 flex justify-end">
                        <a
                          href={`https://wa.me/${(msg.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${msg.name || 'there'}! We received your workshop inquiry: "${msg.message}". How can we help?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Reply</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TRAFFIC & VISITOR ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-pink" />
                  <span>Store Traffic & Engagement Intelligence</span>
                </h2>
                <p className="text-xs text-gray-500">Live visitor telemetry, page impressions, most popular piñatas, and conversion rates.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshAnalytics}
                  className="px-3.5 py-2 bg-white hover:bg-pink-50 text-gray-700 hover:text-brand-pink border border-pink-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Data</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm("Reset all test analytics data to zero?")) {
                      resetAnalyticsData();
                      refreshAnalytics();
                    }
                  }}
                  className="px-3 py-2 text-xs font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  Reset Telemetry
                </button>
              </div>
            </div>

            {/* 5 KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Page Views</span>
                  <Eye className="w-4 h-4 text-brand-pink" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{analyticsData.totalPageViews || 0}</div>
                <p className="text-[11px] text-gray-400 mt-1">Total route impressions</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Unique Visitors</span>
                  <Users className="w-4 h-4 text-brand-teal" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{analyticsData.uniqueVisitors?.length || 0}</div>
                <p className="text-[11px] text-gray-400 mt-1">Distinct user browser sessions</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Cart Additions</span>
                  <ShoppingBag className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{analyticsData.events?.addToCart || 0}</div>
                <p className="text-[11px] text-gray-400 mt-1">Add to cart clicks</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">WhatsApp Leads</span>
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{analyticsData.events?.whatsappInquiry || 0}</div>
                <p className="text-[11px] text-gray-400 mt-1">Direct inquiries opened</p>
              </div>

              <div className="col-span-2 lg:col-span-1 bg-white p-5 rounded-2xl border border-pink-100 shadow-sm">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Conversion Rate</span>
                  <TrendingUp className="w-4 h-4 text-brand-pink" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-pink">
                  {analyticsData.uniqueVisitors?.length > 0
                    ? `${Math.min(100, Math.round(((analyticsData.events?.whatsappInquiry || 0) + (orders.length || 0)) / analyticsData.uniqueVisitors.length * 100))}%`
                    : '0%'}
                </div>
                <p className="text-[11px] text-gray-400 mt-1">Visitors ➔ WhatsApp / Order</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Popular Pages & Device Breakdown */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Route Breakdown */}
                <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-brand-pink" />
                    <span>Most Visited Storefront Pages</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    {[
                      { label: 'Home Page (/)', count: analyticsData.pageViewsByRoute?.home || 0 },
                      { label: 'Shop Catalog (/shop)', count: analyticsData.pageViewsByRoute?.shop || 0 },
                      { label: 'Custom Studio (/customize)', count: analyticsData.pageViewsByRoute?.customize || 0 },
                      { label: 'Order Tracking (/track)', count: analyticsData.pageViewsByRoute?.track || 0 },
                      { label: 'Contact Workshop (/contact)', count: analyticsData.pageViewsByRoute?.contact || 0 },
                      { label: 'Cart (/cart)', count: analyticsData.pageViewsByRoute?.cart || 0 },
                      { label: 'Checkout (/checkout)', count: analyticsData.pageViewsByRoute?.checkout || 0 },
                    ].map(route => {
                      const maxViews = Math.max(1, analyticsData.totalPageViews || 1);
                      const pct = Math.round((route.count / maxViews) * 100);
                      return (
                        <div key={route.label} className="space-y-1">
                          <div className="flex justify-between font-medium">
                            <span className="text-gray-700">{route.label}</span>
                            <span className="text-gray-900 font-bold">{route.count} views ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-pink-50 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-pink rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Device Telemetry */}
                <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-brand-teal" />
                    <span>Device Distribution</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-brand-pinkSubtle/50 rounded-2xl border border-pink-100">
                      <Smartphone className="w-6 h-6 text-brand-pink mx-auto mb-1" />
                      <p className="text-xs text-gray-600 font-semibold">Mobile Visitors</p>
                      <p className="text-xl font-extrabold text-gray-900 mt-0.5">{analyticsData.deviceTypes?.mobile || 0}</p>
                    </div>
                    <div className="p-4 bg-brand-pinkSubtle/50 rounded-2xl border border-pink-100">
                      <Monitor className="w-6 h-6 text-brand-teal mx-auto mb-1" />
                      <p className="text-xs text-gray-600 font-semibold">Desktop Visitors</p>
                      <p className="text-xl font-extrabold text-gray-900 mt-0.5">{analyticsData.deviceTypes?.desktop || 0}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Top Viewed Piñatas & GA4 Configuration */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Most Popular Piñatas */}
                <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Top Piñatas by Customer Interest</span>
                  </h3>
                  {Object.keys(analyticsData.productViews || {}).length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">No individual piñata views recorded yet. Product clicks in the catalog will appear here.</p>
                  ) : (
                    <div className="space-y-2.5">
                      {Object.entries(analyticsData.productViews || {})
                        .sort(([, a], [, b]) => (b.count || 0) - (a.count || 0))
                        .slice(0, 6)
                        .map(([id, info], idx) => {
                          const matchedProduct = products.find(p => p.id === id);
                          return (
                            <div key={id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-gray-50 border border-gray-100 text-xs">
                              <span className="w-6 h-6 rounded-full bg-pink-100 text-brand-pink font-extrabold flex items-center justify-center shrink-0 text-[11px]">
                                #{idx + 1}
                              </span>
                              {matchedProduct && (
                                <img src={matchedProduct.image} alt={matchedProduct.title} className="w-10 h-10 object-cover rounded-xl shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 truncate">{info.title || id}</p>
                                <p className="text-[10px] text-gray-400">ID: {id}</p>
                              </div>
                              <span className="font-extrabold text-brand-pink bg-pink-50 px-2.5 py-1 rounded-xl">
                                {info.count} views
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>

                {/* Google Analytics 4 (GA4) Card */}
                <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-3xl border-2 border-brand-pink/20 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📊</span>
                      <h3 className="font-bold text-sm text-gray-900">Google Analytics 4 (GA4) Setup</h3>
                    </div>
                    {STORE_CONFIG.googleAnalyticsId ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Connected ({STORE_CONFIG.googleAnalyticsId})</span>
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Ready to Connect
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-body">
                    Want to track exact search keywords, Lahore city maps, bounce rates, and user retention in Google Analytics?
                  </p>
                  <div className="bg-white p-3.5 rounded-2xl border border-pink-100 text-xs text-gray-700 space-y-1.5 font-mono">
                    <p className="text-gray-500 font-sans font-semibold text-[11px]">3-Step GA4 Setup:</p>
                    <p>1. Go to <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="text-brand-pink underline font-sans">analytics.google.com</a> and create a free web property.</p>
                    <p>2. Copy your Measurement ID: <code className="bg-pink-50 text-brand-pink px-1 rounded">G-XXXXXXXXXX</code></p>
                    <p>3. Paste it in <code className="bg-gray-100 px-1 rounded">src/config/storeConfig.js</code> under <code className="text-brand-teal">googleAnalyticsId</code>.</p>
                  </div>
                </div>

                {/* Real-time Interaction Feed */}
                <div className="bg-white p-6 rounded-3xl border border-pink-100 shadow-sm space-y-3 max-h-72 overflow-y-auto">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center justify-between">
                    <span>Recent Activity Stream</span>
                    <span className="text-[10px] text-gray-400 font-normal">Last 40 events</span>
                  </h3>
                  <div className="space-y-2 text-xs">
                    {(analyticsData.recentActivity || []).length === 0 ? (
                      <p className="text-gray-400 text-center py-4">No recent activity recorded yet.</p>
                    ) : (
                      analyticsData.recentActivity.map((act) => (
                        <div key={act.id} className="flex items-center justify-between p-2 rounded-xl bg-gray-50 border border-gray-100 text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              act.type === 'whatsapp_inquiry' ? 'bg-emerald-500' :
                              act.type === 'add_to_cart' ? 'bg-brand-pink' :
                              act.type === 'product_view' ? 'bg-amber-500' : 'bg-brand-teal'
                            }`} />
                            <span className="font-bold text-gray-800 capitalize">
                              {act.type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-gray-500 truncate max-w-[150px]">
                              {act.route || act.title || act.label || ''}
                            </span>
                          </div>
                          <span className="text-gray-400 text-[10px] shrink-0">
                            {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* ADD NEW PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-pink-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-900">Add New Piñata Design</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Cocomelon Melon Piñata"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-pink text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Selling Price (PKR) *</label>
                  <input
                    type="number"
                    placeholder="3800"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-pink text-xs font-bold text-brand-pink"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Regular / Original Price (PKR)</label>
                <input
                  type="number"
                  placeholder="e.g. 4500 (Set higher than Selling Price to put on Sale)"
                  value={newOriginalPrice}
                  onChange={(e) => setNewOriginalPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-pink text-xs"
                />
                <p className="text-[10px] text-gray-400 mt-0.5">Optional: Appears as strikethrough price with discount percentage badge</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Dimensions</label>
                  <input
                    type="text"
                    placeholder="50cm x 40cm x 15cm"
                    value={newDimensions}
                    onChange={(e) => setNewDimensions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Badge Flag</label>
                  <select
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="None">None</option>
                    <option value="Sale">Sale (Red Flag)</option>
                    <option value="New">New</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Popular">Popular</option>
                    <option value="Viral">Viral</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Upload Piñata Photo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-brand-pink hover:file:bg-pink-100"
                />
                {newImage && (
                  <img src={newImage} alt="Preview" className="w-16 h-16 object-cover rounded-xl mt-2 border border-pink-100" />
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Handcrafted features, candy compartment capacity..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white rounded-xl font-bold shadow-md transition-colors"
                >
                  Publish to Lahore Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-pink-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Edit Piñata Design</h3>
                <p className="text-[11px] text-gray-400">ID: {editingProduct.id}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Title *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-pink text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Badge Flag</label>
                  <select
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white"
                  >
                    <option value="None">None</option>
                    <option value="Sale">Sale (Red Flag)</option>
                    <option value="Bestseller">Bestseller (Pink)</option>
                    <option value="Popular">Popular (Teal)</option>
                    <option value="Viral">Viral (Purple)</option>
                    <option value="New">New</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Sale Section */}
              <div className="p-3.5 bg-brand-pinkSubtle/40 rounded-2xl border border-pink-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-800 uppercase text-[11px] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-brand-pink" />
                    <span>Price & Sale Configuration</span>
                  </span>
                  {parseInt(editOriginalPrice, 10) > parseInt(editPrice, 10) && (
                    <span className="bg-red-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                      {Math.round(((parseInt(editOriginalPrice, 10) - parseInt(editPrice, 10)) / parseInt(editOriginalPrice, 10)) * 100)}% DISCOUNT ACTIVE
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-gray-600 mb-1">
                      Selling Price (PKR) *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 3500"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-pink text-xs font-bold text-brand-pink bg-white"
                      required
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5">Price customer pays</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-gray-600 mb-1">
                      Original / Regular Price (PKR)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 4200 (optional)"
                      value={editOriginalPrice}
                      onChange={(e) => setEditOriginalPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-pink text-xs bg-white"
                    />
                    <p className="text-[10px] text-gray-400 mt-0.5">Appears with strikethrough</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Dimensions</label>
                  <input
                    type="text"
                    value={editDimensions}
                    onChange={(e) => setEditDimensions(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Inventory State</label>
                  <button
                    type="button"
                    onClick={() => setEditInStock(!editInStock)}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      editInStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${editInStock ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span>{editInStock ? 'In Stock (Available)' : 'Out of Stock'}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Update Piñata Photo</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleEditImageUpload}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-brand-pink hover:file:bg-pink-100"
                />
                {editImage && (
                  <img src={editImage} alt="Current Preview" className="w-16 h-16 object-cover rounded-xl mt-2 border border-pink-100" />
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows="2"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs resize-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-pink hover:bg-brand-pinkHover text-white rounded-xl font-bold shadow-md transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PERMANENT CATALOG EXPORT / DEPLOY MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-pink-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-brand-pink" />
                  <span>Permanent Deploy / Catalog Release</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Why products vanish in incognito & how to make your edits permanent across all devices.
                </p>
              </div>
              <button onClick={() => setShowExportModal(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5 leading-relaxed">
              <strong className="block text-amber-950 font-bold">Why newly added products vanish in Incognito Mode:</strong>
              <p>
                GitHub Pages is a static frontend website without a backend database. When you add or edit products in the admin panel on your PC, they are saved locally in that browser's <code>localStorage</code>.
              </p>
              <p>
                <strong>Incognito Mode</strong> creates an isolated temporary sandbox with zero access to your standard browser storage. Other visitors on their own smartphones also cannot see your PC's local storage.
              </p>
              <p>
                To make your new designs and prices <strong>100% permanently live for everyone</strong>, the catalog must be saved to <code className="bg-amber-100 px-1 rounded font-bold">src/data/products.js</code> and deployed to GitHub!
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700">Updated Catalog Code ({products.length} products):</span>
                <span className="text-gray-400">Ready for src/data/products.js</span>
              </div>
              <pre className="p-3 bg-gray-900 text-pink-300 rounded-2xl text-[11px] font-mono max-h-48 overflow-y-auto border border-gray-800">
                {generateProductsJsCode()}
              </pre>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-emerald-600 font-semibold">
                {copiedCode ? '✓ Copied to clipboard!' : ''}
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDownloadProductsJs}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download products.js</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyCatalog}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedCode ? 'Copied!' : 'Copy Code (1-Click)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
