import React, { useState } from 'react';
import { MapPin, Phone, MessageCircle, Clock, Mail, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage = ({ navigate }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
          <button onClick={() => navigate('home')} className="hover:text-brand-pink transition-colors">Home</button>
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
                  <p className="text-gray-600">Gulberg III & DHA Phase 5 Hub, Lahore, Pakistan</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900">Phone / WhatsApp Hotline</strong>
                  <p className="text-gray-600">+92 300 1234567</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900">Studio Hours</strong>
                  <p className="text-gray-600">Monday – Saturday: 10:00 AM – 8:00 PM</p>
                  <p className="text-[11px] text-gray-400">Sunday: Closed for artisanal sculpting</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900">Email Inquiries</strong>
                  <p className="text-gray-600">hello@pinatashop.lahore</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-4 border-t border-pink-200">
              <a
                href="https://wa.me/923001234567?text=Hi%20Pinata%20Shop%20Lahore!%20I%20have%20an%20inquiry%20regarding%20a%20pi%C3%B1ata."
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

              {submitted && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Message sent! Our Lahore artisan will WhatsApp you shortly.</span>
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
