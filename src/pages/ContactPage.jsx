import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, MessageCircle, Clock, Mail, Send, CheckCircle2 } from 'lucide-react';
import { STORE_CONFIG, getWhatsAppUrl } from '../config/storeConfig';

export const ContactPage = ({ navigate }) => {
  const { addContactInquiry } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [savedData, setSavedData] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !message) return;

    // Persist inquiry to store state so admin staff can review it
    const record = addContactInquiry({
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim()
    });

    setSavedData({ name, phone, message, id: record.id });
    setSubmitted(true);
  };

  const directWaUrl = savedData
    ? getWhatsAppUrl(`🪅 *NEW INQUIRY (${savedData.id})*\nName: ${savedData.name}\nPhone: ${savedData.phone}\nMessage: ${savedData.message}`)
    : getWhatsAppUrl(`Hi Pinata Shop Lahore! I have an inquiry regarding a handcrafted piñata.`);

  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
          <a href="/PinataStore/" onClick={(e) => { e.preventDefault(); navigate('home'); }} className="hover:text-brand-pink transition-colors">Home</a>
          <span>/</span>
          <span className="text-gray-900 font-semibold">Contact</span>
        </div>

        {/* Heading */}
        <div className="mb-10 text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-wider">
            Lahore Workshop & Studio
          </span>
          <h1 className="font-script text-3xl sm:text-5xl text-brand-pink font-bold mt-1">
            Get in touch
          </h1>
          <p className="text-gray-600 text-xs sm:text-sm mt-2">
            Have a question about custom themes, sizes, or urgent delivery in Lahore? We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Workshop Info */}
          <div className="md:col-span-5 bg-brand-pinkSubtle/50 p-6 sm:p-8 rounded-3xl border border-pink-100 space-y-6">
            <h2 className="font-bold text-gray-900 text-base">
              Lahore Craft Headquarters
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900">Workshop & Delivery Hub</strong>
                  <p className="text-gray-600">{STORE_CONFIG.addressDisplay}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900">Operating Hours</strong>
                  <p className="text-gray-600">{STORE_CONFIG.operatingHours}</p>
                  <p className="text-[11px] text-gray-400">Courier dispatches daily across Lahore</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-pink shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900">WhatsApp & Call Desk</strong>
                  <p className="text-gray-600">{STORE_CONFIG.phoneDisplay}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900">Email Inquiries</strong>
                  <p className="text-gray-600">{STORE_CONFIG.email}</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action */}
            <div className="pt-4 border-t border-pink-100">
              <a
                href={directWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right Column: Contact Message Form */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-card space-y-5">
            <h2 className="font-bold text-gray-900 text-base">
              Send us a direct message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Usman Ali"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm focus:outline-none focus:border-brand-pink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  placeholder="0300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm focus:outline-none focus:border-brand-pink"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  How can we help your party? *
                </label>
                <textarea
                  rows="4"
                  placeholder="Tell us your celebration date, character theme, or delivery questions in Lahore..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-xs sm:text-sm focus:outline-none focus:border-brand-pink resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-brand-pink hover:bg-brand-pinkHover text-white rounded-full font-bold text-xs sm:text-sm shadow-brand flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send Message to Lahore Workshop</span>
              </button>

              {submitted && savedData && (
                <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl text-xs space-y-3 border border-emerald-200">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Inquiry Logged ({savedData.id})! Saved to workshop queue.</span>
                  </div>
                  <p className="text-emerald-700">
                    Want immediate response? Click below to send directly to our artisan on WhatsApp:
                  </p>
                  <a
                    href={directWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Open on WhatsApp Now</span>
                  </a>
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
