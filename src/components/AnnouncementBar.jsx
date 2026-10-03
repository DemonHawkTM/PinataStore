import React from 'react';
import { MessageCircle, Sparkles, MapPin } from 'lucide-react';

export const AnnouncementBar = () => {
  return (
    <aside aria-label="Store Announcement" className="bg-gradient-to-r from-brand-pink via-pink-600 to-brand-teal text-white text-xs sm:text-sm py-2 px-4 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-hidden text-center sm:text-left">
          <span className="hidden sm:inline-flex items-center gap-1 font-semibold bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
            <MapPin className="w-3 h-3 text-brand-yellow" /> Lahore Only
          </span>
          <span className="truncate">
            🎉 <strong className="font-semibold">Handmade in Lahore</strong> · 5–7 Days Lead Time · Free Doorstep Delivery Over PKR 5,000
          </span>
        </div>
        <a 
          href="https://wa.me/923001234567?text=Hi%20Pinata%20Shop!%20I%20want%20to%20inquire%20about%20a%20custom%20pi%C3%B1ata%20in%20Lahore." 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-1.5 font-medium hover:underline hover:text-pink-100 transition-colors ml-4 shrink-0 bg-white/10 px-2.5 py-1 rounded-full text-xs"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
          <span>WhatsApp to order anytime</span>
        </a>
      </div>
    </aside>
  );
};
