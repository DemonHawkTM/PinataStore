import React from 'react';
import { Sparkles, Camera, Layers, Truck, ShieldCheck, MessageCircle, MapPin, Phone, Mail, Clock, Lock } from 'lucide-react';

export const Footer = ({ navigate }) => {
  return (
    <footer className="bg-white border-t border-pink-100">
      
      {/* 5 Trust Highlights Row */}
      <div className="border-b border-pink-100 py-10 bg-brand-pinkSubtle/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-pink-100 flex items-center justify-center text-brand-pink">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Easy Customization</h4>
              <p className="text-gray-500 text-[11px]">Pick colours, size & text</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-pink-100 flex items-center justify-center text-brand-pink">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Upload Photos</h4>
              <p className="text-gray-500 text-[11px]">Any theme or cartoon</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-pink-100 flex items-center justify-center text-brand-pink">
                <Layers className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Multiple Categories</h4>
              <p className="text-gray-500 text-[11px]">3D, 2D, numbers & mini</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-pink-100 flex items-center justify-center text-brand-pink">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Fast Lahore Delivery</h4>
              <p className="text-gray-500 text-[11px]">Doorstep courier</p>
            </div>

            <div className="col-span-2 md:col-span-1 flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-pink-100 flex items-center justify-center text-brand-pink">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Safe Payments</h4>
              <p className="text-gray-500 text-[11px]">Cash on delivery & JazzCash</p>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links & Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('home')}>
              <span className="text-3xl">🪅</span>
              <span className="font-script text-3xl text-brand-pink font-bold">
                Pinata Shop
              </span>
            </div>
            <p className="text-gray-600 text-sm font-body max-w-sm leading-relaxed">
              You think it, we make it. Lahore's dedicated artisanal craft house for handmade custom piñatas and party celebrations.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://wa.me/923001234567" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors shadow-sm"
                title="WhatsApp Us"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <span className="text-xs text-gray-500 font-medium">
                Lahore WhatsApp: <strong className="text-gray-800">+92 300 1234567</strong>
              </span>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-sm tracking-wider uppercase">
              Shop
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button onClick={() => navigate('shop')} className="hover:text-brand-pink transition-colors">
                  All Piñatas
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: '3d' })} className="hover:text-brand-pink transition-colors">
                  3D Character Piñatas
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'mini' })} className="hover:text-brand-pink transition-colors">
                  Mini Tabletop Piñatas
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'giant' })} className="hover:text-brand-pink transition-colors">
                  Giant 3D Piñatas
                </button>
              </li>
              <li>
                <button onClick={() => navigate('shop', { category: 'number' })} className="hover:text-brand-pink transition-colors">
                  Number & Letter Piñatas
                </button>
              </li>
            </ul>
          </div>

          {/* Help & Tracking Column */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-sm tracking-wider uppercase">
              Help
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <button onClick={() => navigate('track')} className="hover:text-brand-pink transition-colors">
                  Track Order (PS-10482)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('customize')} className="hover:text-brand-pink transition-colors">
                  Request a Custom Piece
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-brand-pink transition-colors">
                  Contact Workshop
                </button>
              </li>

            </ul>
          </div>

          {/* Lahore Visit & Timing Column */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-sm tracking-wider uppercase">
              Lahore Studio
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600 font-body">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-pink shrink-0 mt-0.5" />
                <span>Gulberg III & DHA Delivery Hub, Lahore</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-teal shrink-0" />
                <span>Mon – Sat: 10:00 AM – 8:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <span>orders@pinatashop.demo</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Payment Options & Rights */}
        <div className="pt-10 mt-10 border-t border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © 2026 Pinata Shop Lahore. All rights reserved. Handcrafted with love.
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-700">Accepted:</span>
            <span className="bg-pink-50 text-brand-pink font-semibold px-2.5 py-1 rounded-md">Cash on Delivery</span>
            <span className="bg-amber-50 text-amber-700 font-semibold px-2.5 py-1 rounded-md">JazzCash</span>
            <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-md">EasyPaisa</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
