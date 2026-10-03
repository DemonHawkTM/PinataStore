import React from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { DELIVERY_THRESHOLD_PKR } from '../data/lahoreAreas';

export const CartPage = ({ navigate }) => {
  const { cart, removeFromCart, updateQuantity, cartSubtotal, deliveryFee, cartTotal } = useStore();

  const freeDeliveryRemaining = Math.max(0, DELIVERY_THRESHOLD_PKR - cartSubtotal);

  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
          <a href="/PinataStore/" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="hover:text-brand-pink transition-colors">Home</a>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Cart</span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-script text-4xl sm:text-5xl text-brand-pink font-bold">
            Your cart
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            Review your handcrafted piñatas and party pieces before Lahore dispatch.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-brand-pinkSubtle/30 rounded-3xl p-8 border border-pink-100">
            <span className="text-5xl">🪅</span>
            <h3 className="font-bold text-gray-800 text-lg">Your cart is empty</h3>
            <p className="text-gray-500 text-xs sm:text-sm max-w-sm mx-auto">
              Add a ready design from our collection or build a custom piece in the studio.
            </p>
            <a
              href="/PinataStore/shop"
              onClick={(e) => { e.preventDefault(); navigate('shop'); }}
              className="px-6 py-3 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-bold rounded-full shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Items Column */}
            <div className="md:col-span-7 space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.cartItemId}
                  className="p-4 sm:p-5 rounded-3xl bg-brand-pinkSubtle/30 border border-pink-100 flex items-center gap-4 sm:gap-5 shadow-sm hover:shadow-card transition-all"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white shrink-0 border border-pink-50">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                        {item.title}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.variant || 'Normal · Pink'}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <span className="font-extrabold text-sm sm:text-base text-brand-pink">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center border border-pink-200 rounded-xl overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-pink-50 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-xs font-bold text-gray-800 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-pink-50 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() => navigate('shop')}
                className="text-xs font-bold text-brand-teal hover:underline inline-flex items-center gap-1.5 pt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Add more piñatas from catalog</span>
              </button>
            </div>

            {/* Order Summary Column */}
            <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border-2 border-pink-100 shadow-xl space-y-5">
              <h2 className="font-bold text-base sm:text-lg text-gray-900">
                Order summary
              </h2>

              <div className="space-y-3 text-xs sm:text-sm text-gray-600 py-3 border-y border-pink-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">PKR {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lahore Delivery</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {deliveryFee === 0 ? 'Free' : `PKR ${deliveryFee}`}
                  </span>
                </div>
                {freeDeliveryRemaining > 0 && (
                  <p className="text-[11px] text-brand-pink">
                    Add PKR {freeDeliveryRemaining.toLocaleString()} more for free Lahore delivery.
                  </p>
                )}
              </div>

              <div className="flex justify-between items-baseline text-base sm:text-lg">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-extrabold text-2xl text-brand-pink">
                  PKR {cartTotal.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => navigate('checkout')}
                  className="w-full py-4 bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pinkHover hover:to-pink-700 text-white rounded-full font-bold text-sm shadow-brand flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('shop')}
                  className="w-full py-3 bg-pink-50 hover:bg-pink-100 text-gray-700 rounded-full font-semibold text-xs transition-colors"
                >
                  Continue shopping
                </button>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
