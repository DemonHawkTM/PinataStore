import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { DELIVERY_THRESHOLD_PKR } from '../data/lahoreAreas';

export const CartDrawer = ({ navigate }) => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartSubtotal, 
    deliveryFee, 
    cartTotal 
  } = useStore();

  // Prevent background scrolling on mobile when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const freeDeliveryRemaining = Math.max(0, DELIVERY_THRESHOLD_PKR - cartSubtotal);
  const deliveryProgressPercent = Math.min(100, Math.round((cartSubtotal / DELIVERY_THRESHOLD_PKR) * 100));

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('checkout');
  };

  const handleBrowseClick = () => {
    setIsCartOpen(false);
    navigate('shop');
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between h-[100dvh] animate-in slide-in-from-right duration-300 ease-out z-10">
          
          {/* Header */}
          <div className="p-5 border-b border-pink-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-pink" />
              <h2 className="font-script text-2xl font-bold text-gray-900">
                Your cart
              </h2>
              <span className="text-xs bg-pink-100 text-brand-pink font-bold px-2 py-0.5 rounded-full">
                {cart.length} {cart.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-pink-50 text-gray-500 hover:text-brand-pink transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lahore Free Delivery Progress Bar */}
          {cart.length > 0 && (
            <div className="bg-pink-50/70 px-5 py-3 border-b border-pink-100 text-xs shrink-0">
              {freeDeliveryRemaining > 0 ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-gray-700 font-medium">
                    <span>Add <strong>PKR {freeDeliveryRemaining.toLocaleString()}</strong> for FREE Lahore delivery!</span>
                    <span className="text-brand-pink font-bold">{deliveryProgressPercent}%</span>
                  </div>
                  <div className="w-full bg-pink-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-pink h-full rounded-full transition-all duration-300"
                      style={{ width: `${deliveryProgressPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>🎉 You've unlocked FREE doorstep delivery in Lahore!</span>
                </div>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-4xl">
                  🪅
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">Your cart is empty</h3>
                  <p className="text-gray-500 text-xs mt-1 max-w-xs">
                    Add a ready handcrafted design or start a custom piece in our studio.
                  </p>
                </div>
                <button
                  onClick={handleBrowseClick}
                  className="px-6 py-2.5 bg-brand-pink hover:bg-brand-pinkHover text-white text-xs font-bold rounded-full shadow-md transition-all"
                >
                  Browse Designs
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.cartItemId}
                  className="flex gap-4 p-3.5 rounded-2xl bg-brand-pinkSubtle/40 border border-pink-100 hover:border-pink-200 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm border border-pink-50">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                          {item.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                        {item.variant || 'Normal · Pink'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-xs sm:text-sm text-brand-pink">
                        PKR {(item.price * item.quantity).toLocaleString()}
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-pink-200 rounded-lg overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-pink-50 text-xs font-bold"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-bold text-gray-800 min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 hover:bg-pink-50 text-xs font-bold"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-pink-100 bg-white space-y-4 shadow-lg shrink-0">
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-gray-900">PKR {cartSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Lahore Delivery:</span>
                  <span className={`font-semibold ${deliveryFee === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {deliveryFee === 0 ? 'FREE' : `PKR ${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-pink-100 text-sm">
                  <span className="font-bold text-gray-900">Grand Total:</span>
                  <span className="font-extrabold text-lg text-brand-pink">
                    PKR {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pinkHover hover:to-pink-700 text-white rounded-full font-bold text-sm shadow-brand flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2.5 bg-pink-50 hover:bg-pink-100 text-gray-700 rounded-full font-medium text-xs transition-colors"
                >
                  Continue shopping
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
};
