import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, Heart, Check, ShoppingBag, MessageCircle, Clock, Ruler, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductModal = () => {
  const { activeProductModal, setActiveProductModal, addToCart, toggleWishlist, isInWishlist } = useStore();
  const [selectedSize, setSelectedSize] = useState("normal");
  const [quantity, setQuantity] = useState(1);
  const [includeStick, setIncludeStick] = useState(false);
  const [includeBlindfold, setIncludeBlindfold] = useState(false);

  useEffect(() => {
    if (activeProductModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeProductModal]);

  if (!activeProductModal || typeof document === 'undefined') return null;

  const product = activeProductModal;
  const wishlisted = isInWishlist(product.id);

  // Size price modifiers
  const sizeOptions = [
    { id: "mini", label: "Mini (25–30cm)", extra: -1000 },
    { id: "normal", label: "Normal (45–50cm)", extra: 0 },
    { id: "large", label: "Large (65–70cm)", extra: 1200 },
    { id: "giant", label: "Giant (100cm+)", extra: 2800 }
  ];

  const currentSizeObj = sizeOptions.find(s => s.id === selectedSize) || sizeOptions[1];
  let calculatedUnitPrice = Math.max(1200, product.price + currentSizeObj.extra);
  if (includeStick) calculatedUnitPrice += 450;
  if (includeBlindfold) calculatedUnitPrice += 250;

  const handleAddToCart = () => {
    const addons = [];
    if (includeStick) addons.push("Buster Stick");
    if (includeBlindfold) addons.push("Blindfold");
    const variantStr = `${currentSizeObj.label}${addons.length > 0 ? ` + ${addons.join(', ')}` : ''}`;

    addToCart(product, quantity, {
      variant: variantStr,
      customPrice: calculatedUnitPrice
    });
    setActiveProductModal(null);
  };

  const whatsappMessage = encodeURIComponent(
    `Hi Pinata Shop Lahore! I am interested in ordering:
Product: ${product.title}
Size: ${currentSizeObj.label}
Quantity: ${quantity}
Addons: ${includeStick ? 'Buster Stick (+450)' : 'None'}, ${includeBlindfold ? 'Blindfold (+250)' : 'None'}
Total Price: PKR ${(calculatedUnitPrice * quantity).toLocaleString()}
Please confirm availability for Lahore delivery.`
  );

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setActiveProductModal(null)}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-pink-100 z-10 max-h-[92vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 hover:text-brand-pink shadow-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Showcase */}
        <div className="md:w-1/2 bg-brand-pinkSubtle p-6 flex flex-col justify-between relative">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-card">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 bg-brand-pink text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Lahore Delivery Note */}
          <div className="mt-4 p-3 bg-white/90 rounded-2xl border border-pink-100 text-xs text-gray-600 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-brand-pink">
              <Clock className="w-3.5 h-3.5" />
              <span>Handmade in Lahore (5–7 Days Lead Time)</span>
            </div>
            <p className="text-[11px] text-gray-500">
              Each piece is custom sculpted with heavy card, crepe fringe & reinforced loops.
            </p>
          </div>
        </div>

        {/* Right Column: Customization Options & Purchase */}
        <div className="md:w-1/2 p-6 overflow-y-auto space-y-5 flex flex-col justify-between">
          <div>
            {/* Category & Title */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-teal uppercase tracking-wider">
                {product.categoryLabel || "Handcrafted Piñata"}
              </span>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="text-gray-400 hover:text-brand-pink transition-colors p-1"
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-brand-pink text-brand-pink' : ''}`} />
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
              {product.title}
            </h2>

            {/* Rating & Review */}
            <div className="flex items-center gap-2 mt-1 text-xs">
              <div className="flex items-center text-brand-yellow">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-gray-700">{product.rating}</span>
              <span className="text-gray-400">({product.reviewCount} Lahore party reviews)</span>
            </div>

            {/* Dynamic Price */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-brand-pink">
                PKR {calculatedUnitPrice.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  PKR {(product.originalPrice + currentSizeObj.extra).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-600 mt-2 font-body leading-relaxed">
              {product.description}
            </p>

            {/* Size Selector */}
            <div className="mt-4">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                Select Size:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {sizeOptions.map(size => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border text-left transition-all ${
                      selectedSize === size.id
                        ? 'border-brand-pink bg-brand-pinkLight text-brand-pink font-semibold shadow-sm'
                        : 'border-gray-200 text-gray-700 hover:border-pink-200'
                    }`}
                  >
                    <div>{size.label}</div>
                    <div className="text-[10px] text-gray-400">
                      {size.extra === 0 ? 'Standard Base' : size.extra > 0 ? `+PKR ${size.extra}` : `-PKR ${Math.abs(size.extra)}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Party Add-ons */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Lahore Party Add-ons:
              </label>
              <label className="flex items-center gap-2 p-2 rounded-xl border border-pink-100 hover:bg-pink-50/50 cursor-pointer text-xs">
                <input 
                  type="checkbox" 
                  checked={includeStick} 
                  onChange={(e) => setIncludeStick(e.target.checked)}
                  className="rounded text-brand-pink focus:ring-brand-pink"
                />
                <span className="font-medium text-gray-800">Matching Buster Stick (Wooden)</span>
                <span className="ml-auto text-brand-pink font-bold">+PKR 450</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl border border-pink-100 hover:bg-pink-50/50 cursor-pointer text-xs">
                <input 
                  type="checkbox" 
                  checked={includeBlindfold} 
                  onChange={(e) => setIncludeBlindfold(e.target.checked)}
                  className="rounded text-brand-pink focus:ring-brand-pink"
                />
                <span className="font-medium text-gray-800">Themed Satin Blindfold</span>
                <span className="ml-auto text-brand-pink font-bold">+PKR 250</span>
              </label>
            </div>

            {/* Quantity Stepper */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-bold text-gray-700 uppercase">Quantity:</span>
              <div className="flex items-center border border-pink-200 rounded-xl overflow-hidden bg-pink-50/40">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-pink-100 font-bold"
                >
                  -
                </button>
                <span className="px-3 py-1.5 text-xs font-bold text-gray-800 min-w-[28px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-pink-100 font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-pink-100 space-y-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pinkHover hover:to-pink-700 text-white rounded-full font-bold text-sm shadow-brand flex items-center justify-center gap-2 transition-all transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart · PKR {(calculatedUnitPrice * quantity).toLocaleString()}</span>
            </button>

            <a
              href={`https://wa.me/923001234567?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire via WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>,
    document.body
  );
};
