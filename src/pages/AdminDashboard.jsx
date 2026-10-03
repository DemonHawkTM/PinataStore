import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/products';
import { compressImage } from '../utils/security';
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
  DollarSign
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

  const [activeTab, setActiveTab] = useState('products'); // products, orders, inquiries
  const [showAddModal, setShowAddModal] = useState(false);

  // New Product Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('3d');
  const [newPrice, setNewPrice] = useState('');
  const [newDimensions, setNewDimensions] = useState('50cm x 40cm x 15cm');
  const [newBadge, setNewBadge] = useState('New');
  const [newImage, setNewImage] = useState('');
  const [newDesc, setNewDesc] = useState('');

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

    addProduct({
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newCategory,
      categoryLabel: catObj.label,
      occasion: "birthday",
      price: parseInt(newPrice, 10),
      dimensions: newDimensions,
      badge: newBadge,
      image: newImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
      description: newDesc || "Artisanal custom piñata handcrafted in our Lahore studio."
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewPrice('');
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
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-6 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-brand-pink text-brand-pink bg-white rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Product Catalog & Stock ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-6 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-brand-pink text-brand-pink bg-white rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Live Orders & Tracking ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-6 text-xs sm:text-sm font-bold border-b-2 transition-all ${
              activeTab === 'inquiries'
                ? 'border-brand-pink text-brand-pink bg-white rounded-t-xl'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Custom Quotes & Photos ({customInquiries.length})
          </button>
        </div>

        {/* TAB 1: PRODUCT CATALOG & STOCK CONTROLS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">Live Inventory List</h2>
                <p className="text-xs text-gray-500">Toggle stock states, add new piñatas, or adjust prices.</p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Piñata</span>
              </button>
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

                        {/* Price */}
                        <td className="py-3 px-4">
                          <span className="font-extrabold text-brand-pink text-xs">
                            PKR {item.price.toLocaleString()}
                          </span>
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
                            <span className="bg-pink-100 text-brand-pink text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => deleteProduct(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
          </div>
        )}

        {/* TAB 3: CUSTOM STUDIO INQUIRIES & REFERENCE VIEWER */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">Custom Studio Reference Submissions</h2>
              <p className="text-xs text-gray-500">Inspect customer uploaded sketches and respond with a quote via WhatsApp.</p>
            </div>

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
                  <label className="block font-bold text-gray-700 uppercase mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    placeholder="3800"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-pink text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 uppercase mb-1">Dimensions & Lead Time</label>
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
                  <option value="New">New</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="Popular">Popular</option>
                  <option value="Viral">Viral</option>
                </select>
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
                  className="px-5 py-2 bg-brand-pink text-white rounded-xl font-bold shadow-md"
                >
                  Publish to Lahore Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
