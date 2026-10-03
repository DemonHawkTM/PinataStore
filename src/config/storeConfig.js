/**
 * Central Store Configuration
 * Update store phone, WhatsApp, email, and studio location here.
 */
export const STORE_CONFIG = {
  name: "Pinata Shop Lahore",
  tagline: "Custom Handcrafted Piñatas",
  
  // Contact details
  phoneDisplay: "+92 300 1234567",
  whatsappNumber: "923001234567", // E.164 without plus for wa.me links
  email: "pinatashoplahore@gmail.com",
  
  // Physical / Delivery Location
  city: "Lahore",
  province: "Punjab",
  country: "Pakistan",
  countryCode: "PK",
  postalCode: "54000",
  addressDisplay: "Gulberg III & DHA Delivery Hub, Lahore, Pakistan",
  operatingHours: "Mon – Sat: 10:00 AM – 8:00 PM",
  
  // URLs & Integrations
  websiteUrl: "https://demonhawktm.github.io/PinataStore/",
  
  // Google Analytics 4 (GA4) Measurement ID
  googleAnalyticsId: "G-99M8DR6WV8"
};

export const getWhatsAppUrl = (customText = "") => {
  const text = customText ? encodeURIComponent(customText) : "";
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}${text ? `?text=${text}` : ""}`;
};
