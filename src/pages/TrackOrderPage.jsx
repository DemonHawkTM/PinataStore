import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  Hammer, 
  Truck, 
  PartyPopper, 
  MessageCircle, 
  MapPin, 
  Calendar,
  AlertCircle
} from 'lucide-react';

export const TrackOrderPage = ({ queryParams, navigate }) => {
  const { orders } = useStore();
  
  const [orderIdInput, setOrderIdInput] = useState(queryParams?.orderId || 'PS-10482');
  const [contactInput, setContactInput] = useState('sara@example.com');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Auto-load demo on initial view
    const initialMatch = orders.find(o => o.id === (queryParams?.orderId || 'PS-10482'));
    if (initialMatch) {
      setSearchedOrder(initialMatch);
      setSearched(true);
    }
  }, [orders, queryParams]);

  const handleTrack = (e) => {
    e.preventDefault();
    const cleanId = orderIdInput.trim().toUpperCase();
    const match = orders.find(o => 
      o.id.toUpperCase() === cleanId || 
      (contactInput && (o.customer.email.toLowerCase() === contactInput.trim().toLowerCase() || o.customer.phone.includes(contactInput.trim())))
    );

    setSearchedOrder(match || null);
    setSearched(true);
  };

  const stages = [
    { key: "placed", label: "Order Placed", desc: "Order recorded & specs logged", icon: Package },
    { key: "deposit_received", label: "50% Deposit Received", desc: "Advance verified by studio", icon: CheckCircle2 },
    { key: "crafting", label: "In Crafting", desc: "Artisans sculpting & fringing", icon: Hammer },
    { key: "dispatched", label: "Dispatched in Lahore", desc: "With courier for delivery", icon: Truck },
    { key: "delivered", label: "Ready to Smash!", desc: "Delivered to party venue", icon: PartyPopper }
  ];

  const getStageIndex = (status) => {
    switch(status) {
      case "placed": return 0;
      case "deposit_received": return 1;
      case "crafting": return 2;
      case "dispatched": return 3;
      case "delivered": return 4;
      default: return 0;
    }
  };

  const currentStageIndex = searchedOrder ? getStageIndex(searchedOrder.status) : 0;

  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
          <button onClick={() => navigate('home')} className="hover:text-brand-pink transition-colors">Home</button>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Track Order</span>
        </div>

        {/* Heading matching inspiration */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
            Track your order
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-body">
            Try demo ID <strong className="text-brand-pink font-semibold">PS-10482</strong> with <span className="text-gray-700">sara@example.com</span>
          </p>
        </div>

        {/* Search Box Form matching screenshot */}
        <div className="bg-brand-pinkSubtle/40 rounded-3xl p-6 sm:p-8 border border-pink-100 shadow-sm max-w-lg mx-auto mb-10">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Order ID
              </label>
              <input
                type="text"
                placeholder="e.g. PS-10482"
                value={orderIdInput}
                onChange={(e) => setOrderIdInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-brand-pink font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email or WhatsApp Number
              </label>
              <input
                type="text"
                placeholder="sara@example.com"
                value={contactInput}
                onChange={(e) => setContactInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-brand-pink"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pinkHover hover:to-pink-700 text-white rounded-full font-bold text-sm shadow-brand flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <span>Track order</span>
            </button>
          </form>
        </div>

        {/* Search Result */}
        {searched && (
          searchedOrder ? (
            <div className="bg-white rounded-3xl border-2 border-pink-100 shadow-xl p-6 sm:p-10 space-y-8 animate-in fade-in">
              
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-pink-100 gap-4">
                <div>
                  <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
                    Lahore Order Status
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-0.5">
                    Order {searchedOrder.id}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    Booked for: <strong className="text-gray-800">{searchedOrder.customer.fullName}</strong> ({searchedOrder.customer.lahoreArea})
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-brand-pink text-xs font-bold uppercase">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Stage: {stages[currentStageIndex].label}</span>
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    Party Date: {searchedOrder.partyDate}
                  </p>
                </div>
              </div>

              {/* 5-Stage Stepper */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-gray-900 uppercase tracking-wide">
                  Crafting & Delivery Milestones
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {stages.map((stage, idx) => {
                    const Icon = stage.icon;
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;

                    return (
                      <div 
                        key={stage.key}
                        className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                          isCurrent 
                            ? 'bg-brand-pinkLight border-brand-pink shadow-md ring-2 ring-brand-pink/20' 
                            : isCompleted 
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                            : 'bg-gray-50/50 border-gray-100 text-gray-400 opacity-60'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isCurrent 
                            ? 'bg-brand-pink text-white animate-pulse' 
                            : isCompleted 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div>
                          <p className={`font-bold text-xs ${isCurrent ? 'text-brand-pink' : isCompleted ? 'text-emerald-900' : 'text-gray-600'}`}>
                            {stage.label}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                            {stage.desc}
                          </p>
                        </div>

                        {isCurrent && (
                          <span className="mt-2 text-[10px] font-extrabold text-brand-pink uppercase bg-white px-2 py-0.5 rounded-full shadow-sm">
                            Current Stage
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Summary */}
              <div className="pt-6 border-t border-pink-100">
                <h3 className="font-bold text-sm text-gray-900 mb-3">
                  Items in this order:
                </h3>
                <div className="space-y-2">
                  {searchedOrder.items.map((it, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-pink-50/40 text-xs">
                      {it.image && <img src={it.image} alt={it.title} className="w-10 h-10 object-cover rounded-lg shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-gray-800">{it.title}</span>
                        <span className="text-gray-500 ml-2">({it.variant})</span>
                      </div>
                      <span className="font-bold text-brand-pink">Qty: {it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Support CTA */}
              <div className="p-4 bg-emerald-50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-emerald-900">Have questions about your order?</p>
                  <p className="text-emerald-700">Chat directly with the artisan working on your piñata.</p>
                </div>
                <a
                  href={`https://wa.me/923001234567?text=Hi!%20Checking%20status%20for%20order%20${searchedOrder.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full inline-flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Artisan</span>
                </a>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center space-y-3 bg-brand-pinkSubtle/30 rounded-3xl p-6 border border-pink-100 max-w-lg mx-auto">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-bold text-gray-900 text-sm">Order not found</h3>
              <p className="text-xs text-gray-500">
                Please double check your Order ID (e.g. <strong>PS-10482</strong>) or WhatsApp number.
              </p>
            </div>
          )
        )}

      </div>
    </div>
  );
};
