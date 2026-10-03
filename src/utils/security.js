/**
 * Security & Data Sanitization Utilities
 * Pinata Store Lahore
 */

// 1. Client-Side Image Compression & Downscaling (Prevents QuotaExceededError DoS)
export const compressImage = (file, maxWidth = 600, maxHeight = 600, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    // Hard ceiling: reject files over 4MB upfront
    if (file.size > 4 * 1024 * 1024) {
      reject(new Error('Image file is too large. Please select a photo under 4MB.'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG at specified quality (~25-50KB)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
  });
};

// 2. Cryptographic SHA-256 Hashing (Native Web Crypto API)
const SALT = 'lahore_pinata_salt_2026:';
export async function hashPin(pin) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(SALT + pin.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('Crypto hashing failed:', err);
    return null;
  }
}

// Pre-computed salted SHA-256 hashes for authorized PINs:
// "1234" -> 6599be86a61478c5b54c9c2a9ac008211abdfc0980c55c29531af7fd7cff7913
// "admin123" -> 94bc5bddc891889bb06e58cc0fc6ace74080f28f37c748ef62b4d20c26264bd0
// "pinata2026" -> 19165ae217eec94c06f65ba5a6fe7973b194c630db2ac800d075943964fea190
export const AUTHORIZED_PIN_HASHES = new Set([
  '6599be86a61478c5b54c9c2a9ac008211abdfc0980c55c29531af7fd7cff7913',
  '94bc5bddc891889bb06e58cc0fc6ace74080f28f37c748ef62b4d20c26264bd0',
  '19165ae217eec94c06f65ba5a6fe7973b194c630db2ac800d075943964fea190'
]);

// 3. Cryptographic Session Token Generation
export function generateSessionProof() {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  const token = Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours validity
  return { token, expiresAt };
}

// 4. Safe LocalStorage Wrapper with Quota Protection & Try/Catch
export const safeStorage = {
  get: (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`Error reading ${key} from storage:`, e);
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`QuotaExceededError writing ${key} to storage:`, e);
      return false;
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing ${key}:`, e);
    }
  }
};

// 5. PII Masking Utilities for Public View & Storage Protection
export const maskPhone = (phone) => {
  if (!phone) return '••••••';
  const clean = phone.replace(/\s+/g, '');
  if (clean.length < 7) return clean;
  return clean.slice(0, 4) + ' •••• ' + clean.slice(-3);
};

export const maskName = (name) => {
  if (!name) return 'Customer';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2) + '•••';
  return `${parts[0]} ${parts[parts.length - 1][0]}•••`;
};

export const maskAddress = (address) => {
  if (!address) return 'Lahore';
  // Keep Lahore sector/area name, mask street number
  const parts = address.split(',');
  if (parts.length > 1) {
    return 'Sector Protected, ' + parts.slice(1).join(',').trim();
  }
  return address.replace(/\d+/g, '•');
};
