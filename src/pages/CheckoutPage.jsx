import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { LAHORE_AREAS } from '../data/lahoreAreas';
import { 
  CheckCircle2, 
  MapPin, 
  CreditCard, 
  Phone, 
  Mail, 
  User, 
  Calendar, 
  ArrowRight, 
  MessageCircle, 
  Sparkles,
  ShieldCheck,
  Truck
} from 'lucide-react';

export const CheckoutPage = ({ navigate }) => {
  const { cart, cartSubtotal, deliveryFee, cartTotal, placeOrder } = useStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [lahoreArea, setLahoreArea] = useState(LAHORE_AREAS[0]);
  const [streetAddress, setStreetAddress] = useState('');
  const [partyDate, setPartyDate] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  
  // Placed Order state
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="py-20 text-center max-w-md mx-auto px-4">
        <span className="text-5xl">🪅</span>
        <h2 className="font-bold text-xl text-gray-900 mt-4">Your cart is empty</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">Please add a piñata to checkout.</p>
        <button
          onClick={() => navigate('shop')}
          className="mt-6 px-6 py-3 bg-brand-pink text-white rounded-full font-bold text-xs shadow-md"
        >
          Browse Piñatas
        </button>
      </div>
    );
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !streetAddress) {
      alert("Please fill in all required contact and Lahore address fields.");
      return;
    }

    const order = placeOrder({
      customer: {
        fullName,
        email: email || 'customer@example.com',
        phone,
        lahoreArea,
        streetAddress
      },
      partyDate: partyDate || 'Within 7 days',
      notes,
      paymentMethod
    });

    setConfirmedOrder(order);
  };

  // If order is placed, show confirmation screen
  if (confirmedOrder) {
    const whatsappConfirmText = encodeURIComponent(
      `🎉 *ORDER CONFIRMATION — LAHORE STUDIO*
Order ID: *${confirmedOrder.id}*
Customer: ${confirmedOrder.customer.fullName}
Area: ${confirmedOrder.customer.lahoreArea}
Party Date: ${confirmedOrder.partyDate}
Total Amount: PKR ${confirmedOrder.total.toLocaleString()}
Payment Method: ${confirmedOrder.paymentMethod.toUpperCase()}
Items:
${confirmedOrder.items.map(it => `- ${it.title} (${it.quantity}x)`).join('\n')}
_Please confirm advance deposit details for craft commencement._`
    );

    return (
      <div className="py-12 bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-brand-pinkSubtle/50 rounded-3xl p-6 sm:p-10 border-2 border-brand-pink/30 shadow-xl text-center space-y-6">
            
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
                Order Received in Lahore!
              </span>
              <h1 className="font-script text-3xl sm:text-5xl text-gray-900 font-bold mt-1">
                Thank you, {confirmedOrder.customer.fullName.split(' ')[0]}!
              </h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-2 font-body">
                Your handcrafted order has been logged into our craft workshop.
              </p>
            </div>

            {/* Order ID Box */}
            <div className="p-4 bg-white rounded-2xl border border-pink-100 shadow-sm max-w-sm mx-auto">
              <p className="text-xs text-gray-500 font-medium">Your Order Tracking ID:</p>
              <p className="text-2xl font-extrabold text-brand-pink tracking-wider mt-0.5">
                {confirmedOrder.id}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Save this ID to check craft progress on our tracking page.
              </p>
            </div>

            {/* Next Steps Card */}
            <div className="bg-white/80 p-5 rounded-2xl text-left text-xs text-gray-700 space-y-2.5 border border-pink-100">
              <p className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-pink" />
                <span>Next steps to begin crafting:</span>
              </p>
              <p>1. Our artisan will WhatsApp you to verify the sketch & colour shades.</p>
              <p>2. Send 50% advance deposit via JazzCash/EasyPaisa (0300 1234567) or Bank Transfer.</p>
              <p>3. We craft your piñata in 5–7 days and deliver to {confirmedOrder.customer.lahoreArea}!</p>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <a
                href={`https://wa.me/923001234567?text=${whatsappConfirmText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Confirm on WhatsApp Now</span>
              </a>

              <button
                onClick={() => navigate('track', { orderId: confirmedOrder.id })}
                className="w-full py-3 bg-pink-50 hover:bg-pink-100 text-brand-pink rounded-full font-bold text-xs transition-colors"
              >
                Track Order Progress ({confirmedOrder.id})
              </button>

              <button
                onClick={() => navigate('home')}
                className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
              >
                Return to Home
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Minimum date: 5 days from today
  const today = new Date();
  today.setDate(today.getDate() + 5);
  const minDateString = today.toISOString().split('T')[0];

  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
          <button onClick={() => navigate('home')} className="hover:text-brand-pink transition-colors">Home</button>
          <span>/</span>
          <button onClick={() => navigate('cart')} className="hover:text-brand-pink transition-colors">Cart</button>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Checkout</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-script text-3xl sm:text-5xl text-brand-pink font-bold">
            Lahore Doorstep Checkout
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Provide your event date and Lahore delivery details. 50% deposit to begin crafting.
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Contact Details Card */}
            <div className="bg-brand-pinkSubtle/30 p-6 rounded-3xl border border-pink-100 space-y-4">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <User className="w-4 h-4 text-brand-pink" />
                <span>1. Contact Information</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sara Khan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-brand-pink"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="0300 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-brand-pink"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="sara@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Address in Lahore */}
            <div className="bg-brand-pinkSubtle/30 p-6 rounded-3xl border border-pink-100 space-y-4">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-pink" />
                <span>2. Lahore Delivery Destination</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Lahore Locality / Sector *
                  </label>
                  <select
                    value={lahoreArea}
                    onChange={(e) => setLahoreArea(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-brand-pink cursor-pointer font-medium"
                  >
                    {LAHORE_AREAS.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    Street Address / House / Plot # *
                  </label>
                  <textarea
                    rows="2"
                    placeholder="e.g. House 42, Sector C, Street 5, Phase 5, Lahore"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-brand-pink resize-none"
                    required
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Event / Party Date *
                    </label>
                    <input
                      type="date"
                      min={minDateString}
                      value={partyDate}
                      onChange={(e) => setPartyDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-brand-pink"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Delivery Instructions
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Leave with security / Ring bell"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm bg-white focus:outline-none focus:border-brand-pink"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-brand-pinkSubtle/30 p-6 rounded-3xl border border-pink-100 space-y-4">
              <h2 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand-pink" />
                <span>3. Payment Preference</span>
              </h2>

              <div className="space-y-2.5">
                <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-brand-pink bg-pink-50/80 shadow-sm' : 'border-pink-100 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 text-brand-pink focus:ring-brand-pink"
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-gray-900">
                      Cash on Delivery (50% Deposit + 50% on Doorstep Delivery)
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Pay 50% via JazzCash/EasyPaisa to start crafting, and pay the remaining 50% in cash upon delivery in Lahore.
                    </p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'jazzcash_easypaisa' ? 'border-brand-pink bg-pink-50/80 shadow-sm' : 'border-pink-100 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="jazzcash_easypaisa"
                    checked={paymentMethod === 'jazzcash_easypaisa'}
                    onChange={() => setPaymentMethod('jazzcash_easypaisa')}
                    className="mt-0.5 text-brand-pink focus:ring-brand-pink"
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-gray-900">
                      JazzCash / EasyPaisa Direct Transfer
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Account: <strong>0300 1234567</strong> (Title: Pinata Shop Lahore). Instant transfer.
                    </p>
                  </div>
                </label>

                <label className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer' ? 'border-brand-pink bg-pink-50/80 shadow-sm' : 'border-pink-100 bg-white'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={() => setPaymentMethod('bank_transfer')}
                    className="mt-0.5 text-brand-pink focus:ring-brand-pink"
                  />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-gray-900">
                      Direct Bank Transfer (IBAN)
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Meezan Bank / HBL. Account details provided upon confirmation.
                    </p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Order Review Column */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            
            <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-pink-100 shadow-xl space-y-5">
              <h2 className="font-bold text-base sm:text-lg text-gray-900">
                Order Review ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h2>

              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map(item => (
                  <div key={item.cartItemId} className="flex items-center gap-3 py-1 border-b border-pink-50 text-xs">
                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 truncate">{item.title}</p>
                      <p className="text-gray-400 text-[10px]">{item.variant}</p>
                      <p className="text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-extrabold text-brand-pink">
                      PKR {(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal & Delivery */}
              <div className="space-y-2 pt-3 border-t border-pink-100 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">PKR {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lahore Doorstep Delivery:</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {deliveryFee === 0 ? 'Free' : `PKR ${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-pink-100 text-base">
                  <span className="font-bold text-gray-900">Total:</span>
                  <span className="font-extrabold text-2xl text-brand-pink">
                    PKR {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pinkHover hover:to-pink-700 text-white rounded-full font-bold text-sm shadow-brand flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <span>Place Order in Lahore</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Verified Lahore Artisanal Craft Guarantee</span>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
