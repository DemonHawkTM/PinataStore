# PinataStore — Custom Handcrafted Piñatas (Lahore Edition) 🪅

A modern, mobile-first, high-conversion eCommerce and bespoke Custom Studio platform for artisanal piñatas (pre-made designs and bespoke custom orders), handcrafted and delivered across Lahore, Pakistan.

---

## ✨ Features

- **Celebratory Visual Branding**: Festive bubblegum pink and celebration teal design system, dynamic confetti animations (`canvas-confetti`), and 3D floating showcase cards.
- **Product Catalog (`/shop`)**: Filterable categories (*3D Character Piñatas, 2D Pull-String, Mini Tabletop, Giant 3D Piñatas, Number/Letter Piñatas*) with real-time fuzzy search and price/rating sorting.
- **Interactive Custom Piñata Studio (`/customize`)**:
  - Live estimated quote calculator (from PKR 3,800).
  - 8-color interactive swatch picker.
  - Custom text personalization on the piece.
  - Event date calendar picker enforcing a 5-day artisanal lead time.
  - Drag-and-drop reference photo/sketch uploader with live thumbnail preview and client-side compression.
  - Dual submission actions: **"Add custom order to cart"** and **"Send on WhatsApp"**.
- **Cart & Slide-Over Drawer (`/cart`)**:
  - Customer-isolated LocalStorage persistence across page reloads.
  - Lahore Free Delivery progress indicator (*Free over PKR 5,000, flat PKR 250 across Lahore otherwise*).
- **Lahore Doorstep Checkout (`/checkout`)**:
  - Area selector covering all major Lahore sectors (*DHA Phases 1–9, Gulberg, Bahria Town, Cantt, Johar Town, Model Town, etc.*).
  - Payment options: Cash on Delivery (50% deposit + 50% on doorstep delivery), JazzCash / EasyPaisa, and Direct Bank Transfer.
- **Order Tracking Timeline (`/track`)**:
  - Dual-factor verification protecting customer order privacy and delivery details.
  - 5-stage visual progress stepper (*Placed → 50% Deposit Received → In Crafting → Dispatched → Delivered*).
- **Admin Back-Office Portal (`/admin`)**:
  - Protected master authentication gate with persistent rate limiting.
  - 1-Click "In Stock" / "Out of Stock" inventory toggles that instantly update the live storefront.
  - "Add New Piñata" modal with photo upload, PKR pricing, dimensions, and badges.
  - Order milestone manager with real-time synchronization to the customer's `/track` page.
  - Custom studio photo inquiry viewer with 1-click WhatsApp quick-reply.
- **Technical & Local SEO**:
  - Schema.org `LocalBusiness` and `ItemList`/`Product` structured data.
  - Canonical link tags, XML sitemap (`sitemap.xml`), and `robots.txt`.
  - Dynamic page metadata and social OpenGraph / Twitter Cards.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173/` on your PC, or `http://<your-ip>:5173/` on your mobile phone on the same Wi-Fi.

### 3. Production Build
```bash
npm run build
```

---

## 🌐 Free Deployment via GitHub Pages

This repository is pre-configured with a GitHub Actions workflow (`.github/workflows/deploy.yml`).
1. In your GitHub repository, navigate to **Settings** → **Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Every push to the `main` branch will automatically build and publish the website live!

---

© 2026 Pinata Shop Lahore. Handcrafted with love.
