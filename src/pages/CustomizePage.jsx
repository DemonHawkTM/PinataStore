import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  MessageCircle, 
  ShoppingBag, 
  Calendar, 
  Check, 
  Clock, 
  Info,
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { compressImage } from '../utils/security';

export const CustomizePage = ({ navigate }) => {
  const { addToCart, addCustomInquiry } = useStore();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [pinataType, setPinataType] = useState('3D Character Piñata');
  const [size, setSize] = useState('normal');
  const [selectedColor, setSelectedColor] = useState('Hot Pink');
  const [textOnPiece, setTextOnPiece] = useState('');
  const [partyDate, setPartyDate] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [imageError, setImageError] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  // Swatch colors
  const colorOptions = [
    { label: 'Hot Pink', hex: '#FF2E93' },
    { label: 'Royal Blue', hex: '#2563EB' },
    { label: 'Sunny Yellow', hex: '#FACC15' },
    { label: 'Party Teal', hex: '#0D9488' },
    { label: 'Vibrant Orange', hex: '#EA580C' },
    { label: 'Pastel Purple', hex: '#9333EA' },
    { label: 'Charcoal Black', hex: '#1E293B' },
    { label: 'Pure White', hex: '#FFFFFF', border: true }
  ];

  // Pricing formula
  let basePrice = 3800;
  if (pinataType.includes('Giant')) basePrice = 6500;
  if (pinataType.includes('Mini')) basePrice = 1600;
  if (pinataType.includes('2D')) basePrice = 3200;

  let sizeExtra = 0;
  if (size === 'large') sizeExtra = 1200;
  if (size === 'giant') sizeExtra = 2700;

  const estimatedTotal = basePrice + sizeExtra;

  // Minimum date: 5 days from now
  const today = new Date();
  today.setDate(today.getDate() + 5);
  const minDateString = today.toISOString().split('T')[0];

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageError('');
    setIsCompressing(true);
    try {
      const compressedUrl = await compressImage(file, 600, 600, 0.75);
      setImagePreview(compressedUrl);
    } catch (err) {
      setImageError(err.message || 'Error processing image. Please select a smaller photo under 4MB.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!customerName || !whatsappNumber) {
      alert("Please provide your Name and WhatsApp number so our Lahore artisans can verify the design with you!");
      return;
    }

    const customSpec = {
      customerName,
      whatsappNumber,
      pinataType,
      size: size === 'normal' ? 'Normal (45–50cm)' : size === 'large' ? 'Large (65–70cm)' : 'Giant (100cm+)',
      color: selectedColor,
      textOnPiece: textOnPiece || 'None',
      partyDate: partyDate || 'Not specified',
      specialInstructions,
      referenceImage: imagePreview
    };

    addToCart(
      {
        id: `custom-${Date.now()}`,
        title: `Custom ${pinataType}`,
        price: estimatedTotal,
        image: imagePreview || "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80"
      },
      1,
      {
        isCustom: true,
        variant: `${customSpec.size} · ${selectedColor}`,
        customPrice: estimatedTotal,
        customSpec
      }
    );

    addCustomInquiry(customSpec);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 4000);
  };

  const whatsappMessage = encodeURIComponent(
    `🪅 *CUSTOM PIÑATA REQUEST — LAHORE STUDIO*
Name: ${customerName || 'Customer'}
WhatsApp: ${whatsappNumber || 'N/A'}
Type: ${pinataType}
Size: ${size === 'normal' ? 'Normal (45–50cm)' : size === 'large' ? 'Large (65–70cm)' : 'Giant (100cm+)'}
Color Theme: ${selectedColor}
Text on Piece: ${textOnPiece || 'None'}
Party Date: ${partyDate || 'Within 1-2 weeks'}
Estimated Quote: PKR ${estimatedTotal.toLocaleString()}
Notes: ${specialInstructions || 'None'}
_Please let me know if this party slot is open!_`
  );

  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
          <a href="/PinataStore/" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="hover:text-brand-pink transition-colors">Home</a>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Custom Studio</span>
        </div>

        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <h1 className="font-script text-3xl sm:text-5xl text-brand-pink font-bold">
            Design your piñata
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-2 font-body leading-relaxed">
            Same studio process as a custom craft house — photo, quote, 50% deposit, then we make it. This builder lets you build the requirements, drop it in the cart, or send directly on WhatsApp to our Lahore workshop.
          </p>
        </div>

        {/* 2-Column Workstation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-7 bg-brand-pinkSubtle/30 p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-6">
            
            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Your name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fatima Tariq"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-brand-pink text-xs sm:text-sm bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  WhatsApp number *
                </label>
                <input
                  type="tel"
                  placeholder="0300 1234567"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-brand-pink text-xs sm:text-sm bg-white"
                  required
                />
              </div>
            </div>

            {/* Type & Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Piñata Type
                </label>
                <select
                  value={pinataType}
                  onChange={(e) => setPinataType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-brand-pink text-xs sm:text-sm bg-white cursor-pointer"
                >
                  <option value="3D Character Piñata">3D Character Piñata</option>
                  <option value="2D Flat Piñata">2D Flat / Pull-String Piñata</option>
                  <option value="Mini Tabletop Piñata">Mini Tabletop Piñata</option>
                  <option value="Giant 3D Piñata">Giant 3D Piñata (2.5ft)</option>
                  <option value="Number or Letter Piñata">Number or Letter Piñata</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                  Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-brand-pink text-xs sm:text-sm bg-white cursor-pointer"
                >
                  <option value="normal">Normal · 45–50cm (Standard)</option>
                  <option value="large">Large · 65–70cm (+PKR 1,200)</option>
                  <option value="giant">Giant · 100cm+ (+PKR 2,700)</option>
                </select>
              </div>
            </div>

            {/* Colour Swatches */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center justify-between">
                <span>Colour Theme</span>
                <span className="text-brand-pink font-semibold lowercase">Selected: {selectedColor}</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {colorOptions.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setSelectedColor(c.label)}
                    className={`w-9 h-9 rounded-full transition-transform flex items-center justify-center ${
                      selectedColor === c.label ? 'scale-110 ring-4 ring-brand-pink/30 shadow-md' : 'hover:scale-105'
                    } ${c.border ? 'border border-gray-300' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  >
                    {selectedColor === c.label && (
                      <Check className={`w-4 h-4 ${c.hex === '#FFFFFF' ? 'text-gray-800' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Text on the Piece */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Name / text on the piece
              </label>
              <input
                type="text"
                placeholder="e.g. Happy 5th Birthday Zayn, or Baby Boy"
                value={textOnPiece}
                onChange={(e) => setTextOnPiece(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-brand-pink text-xs sm:text-sm bg-white"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Custom cut letters handcrafted onto the front or side.
              </p>
            </div>

            {/* Party Date (Min 5 days for Lahore lead time) */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                <span>Party Date in Lahore *</span>
                <span className="text-[11px] text-brand-teal font-semibold">Min 5–7 days lead time</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={minDateString}
                  value={partyDate}
                  onChange={(e) => setPartyDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-brand-pink text-xs sm:text-sm bg-white"
                  required
                />
              </div>
            </div>

            {/* Reference Image Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Upload reference (Photo, cartoon, logo)
              </label>
              <div className="border-2 border-dashed border-pink-200 hover:border-brand-pink rounded-2xl p-4 sm:p-6 text-center bg-white transition-colors cursor-pointer relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {isCompressing ? (
                  <div className="py-4 text-center">
                    <div className="w-6 h-6 border-2 border-brand-pink border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs font-semibold text-brand-pink">Optimizing image safely...</p>
                  </div>
                ) : imagePreview ? (
                  <div className="flex flex-col items-center space-y-2">
                    <img 
                      src={imagePreview} 
                      alt="Uploaded reference preview" 
                      className="w-24 h-24 object-cover rounded-xl shadow-md border border-pink-100"
                    />
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Reference loaded & optimized! Tap to change
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-8 h-8 text-brand-pink mx-auto" />
                    <p className="text-xs font-medium text-gray-700">
                      Drag & drop your reference photo or tap to browse
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Supports JPG, PNG, WebP (auto-optimized under 4MB)
                    </p>
                  </div>
                )}
              </div>
              {imageError && (
                <p className="text-xs text-red-600 mt-1 font-medium">{imageError}</p>
              )}
            </div>

            {/* Tell Us What You Want */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                Tell us what you want
              </label>
              <textarea
                rows="3"
                placeholder="Describe theme details, pull-string vs stick preference, favourite cartoon characters, color preferences..."
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 focus:outline-none focus:border-brand-pink text-xs sm:text-sm bg-white resize-none"
              ></textarea>
            </div>

          </div>

          {/* Right Column: Sticky Quote Card & Submission Actions */}
          <div className="lg:col-span-5 sticky top-24 space-y-4">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-100 shadow-xl space-y-5">
              
              <div>
                <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
                  Lahore Studio Calculation
                </span>
                <h3 className="font-script text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5">
                  Estimated quote
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-body leading-relaxed">
                  Real price depends on difficulty, extra 3D parts, and lead time just like an authentic craft studio.
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 py-4 border-y border-pink-100 text-xs sm:text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Base Sculpting:</span>
                  <span className="font-semibold text-gray-800">PKR {basePrice.toLocaleString()}</span>
                </div>
                {sizeExtra > 0 && (
                  <div className="flex justify-between">
                    <span>Size Upgrade:</span>
                    <span className="font-semibold text-brand-pink">+PKR {sizeExtra.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Personalisation (Name):</span>
                  <span className="font-semibold text-emerald-600">Included (Free)</span>
                </div>
                <div className="flex justify-between">
                  <span>Reinforced Loops:</span>
                  <span className="font-semibold text-emerald-600">Included</span>
                </div>
              </div>

              {/* Final Highlighted Total */}
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-gray-400 uppercase">From:</span>
                <span className="text-3xl font-extrabold text-brand-pink">
                  PKR {estimatedTotal.toLocaleString()}
                </span>
              </div>

              {/* Lahore Lead time pill */}
              <div className="bg-pink-50 p-3 rounded-2xl flex items-center gap-2 text-xs text-gray-700">
                <Clock className="w-4 h-4 text-brand-pink shrink-0" />
                <span>Handmade in 5–7 days with 50% deposit.</span>
              </div>

              {/* Dual Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-gradient-to-r from-brand-pink to-pink-600 hover:from-brand-pinkHover hover:to-pink-700 text-white rounded-full font-bold text-sm shadow-brand flex items-center justify-center gap-2 transition-all transform active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Custom Order to Cart</span>
                </button>

                <a
                  href={`https://wa.me/923001234567?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send on WhatsApp</span>
                </a>
              </div>

              {/* Success Feedback Banner */}
              {successToast && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Custom piece added to cart! Proceed to checkout or send on WhatsApp.</span>
                </div>
              )}

            </div>

            {/* Lahore Artisan Assurance Card */}
            <div className="bg-brand-pinkSubtle/60 p-4 rounded-2xl border border-pink-100 text-xs text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">Need immediate help in Lahore?</p>
              <p>Call or WhatsApp our master artisan at <strong>+92 300 1234567</strong> for same-day sketch approval.</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
