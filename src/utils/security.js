/**
 * Security, Authentication & Data Sanitization Utilities
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

// 2. High-Strength Key Derivation via PBKDF2-HMAC-SHA256 (100,000 Iterations)
const PBKDF2_SALT = 'Lahore_Pinata_Craft_Salt_v2_2026';

export async function hashPin(pin) {
  try {
    const encoder = new TextEncoder();
    const importedKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode((pin || '').trim()),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    const derived = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode(PBKDF2_SALT),
        iterations: 100000,
        hash: 'SHA-256'
      },
      importedKey,
      256
    );
    const hashArray = Array.from(new Uint8Array(derived));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (err) {
    console.error('PBKDF2 derivation error:', err);
    return null;
  }
}

// Authorized Master Passkey Hashes (PBKDF2 with 100k iterations; resistant to offline brute-force)
export const AUTHORIZED_PIN_HASHES = new Set([
  '874d5899bed2fe7f01511472a22038032f1c5e290df2fa0df95a8894109e1f85', // Master Studio Passkey
  'f125f7265a44f74e924627be2750a6264a007d376155f9e57a50f8ce6f61aa2b'  // Secondary Studio Passkey
]);

// 3. Cryptographic Session Token & Key-Bound Verification
export async function computeSessionSignature(token, expiresAt, keyProof) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(`pinata_sig_v2:${token}:${expiresAt}:${keyProof || ''}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return null;
  }
}

export async function generateSessionProof(keyProof) {
  const array = new Uint8Array(24);
  crypto.getRandomValues(array);
  const token = Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours validity
  const signature = await computeSessionSignature(token, expiresAt, keyProof);
  return { token, expiresAt, keyProof, signature };
}

export async function verifySessionProof(session) {
  if (!session || !session.token || !session.expiresAt || !session.signature || !session.keyProof) return false;
  if (session.expiresAt <= Date.now()) return false;
  // Verify keyProof belongs to an authorized hash
  if (!AUTHORIZED_PIN_HASHES.has(session.keyProof)) return false;
  const expectedSig = await computeSessionSignature(session.token, session.expiresAt, session.keyProof);
  return session.signature === expectedSig;
}

// 4. Rate-Limiting & Lockout Persistence (Resistant to Page Refresh)
const LOCKOUT_KEY = 'pinata_admin_lockout';
export const getAdminLockoutState = () => {
  try {
    const raw = localStorage.getItem(LOCKOUT_KEY);
    if (!raw) return { failedAttempts: 0, lockoutRemainingSeconds: 0 };
    const data = JSON.parse(raw);
    const now = Date.now();
    if (data.lockoutUntil && data.lockoutUntil > now) {
      const remaining = Math.ceil((data.lockoutUntil - now) / 1000);
      return { failedAttempts: data.failedAttempts || 5, lockoutRemainingSeconds: remaining };
    }
    return { failedAttempts: data.failedAttempts || 0, lockoutRemainingSeconds: 0 };
  } catch {
    return { failedAttempts: 0, lockoutRemainingSeconds: 0 };
  }
};

export const recordAdminFailedAttempt = () => {
  try {
    const current = getAdminLockoutState();
    const nextAttempts = current.failedAttempts + 1;
    let lockoutUntil = null;
    let lockoutSeconds = 0;
    if (nextAttempts >= 5) {
      lockoutSeconds = 60;
      lockoutUntil = Date.now() + 60 * 1000;
    }
    localStorage.setItem(LOCKOUT_KEY, JSON.stringify({
      failedAttempts: nextAttempts,
      lockoutUntil
    }));
    return { failedAttempts: nextAttempts, lockoutRemainingSeconds: lockoutSeconds };
  } catch {
    return { failedAttempts: 1, lockoutRemainingSeconds: 0 };
  }
};

export const resetAdminLockout = () => {
  try {
    localStorage.removeItem(LOCKOUT_KEY);
  } catch {
    // ignore
  }
};

// 5. Safe LocalStorage Wrapper with Quota Protection & Try/Catch
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

// 6. Cleanup & Purge Old Demo / Mock / Filler Data
export const sanitizeStoreStorage = () => {
  try {
    // Purge mock demo items from cart
    const cart = safeStorage.get('pinata_store_cart', null);
    if (cart && Array.isArray(cart)) {
      const isDemoCart = cart.some(item => 
        item.cartItemId === 'demo-item-1' || 
        item.cartItemId === 'demo-item-2' ||
        item.id === 'demo-item-1' ||
        item.id === 'demo-item-2'
      );
      if (isDemoCart) {
        safeStorage.remove('pinata_store_cart');
      }
    }

    // Purge mock wishlist
    const wishlist = safeStorage.get('pinata_store_wishlist', null);
    if (wishlist && Array.isArray(wishlist) && wishlist.length === 1 && wishlist[0] === 'pinata-01') {
      safeStorage.remove('pinata_store_wishlist');
    }

    // Purge mock order PS-10482
    const orders = safeStorage.get('pinata_store_orders', null);
    if (orders && Array.isArray(orders)) {
      const filtered = orders.filter(o => o.id !== 'PS-10482');
      if (filtered.length !== orders.length) {
        safeStorage.set('pinata_store_orders', filtered);
      }
    }

    // Purge mock inquiry INQ-901
    const inquiries = safeStorage.get('pinata_custom_inquiries', null);
    if (inquiries && Array.isArray(inquiries)) {
      const filtered = inquiries.filter(i => i.id !== 'INQ-901');
      if (filtered.length !== inquiries.length) {
        safeStorage.set('pinata_custom_inquiries', filtered);
      }
    }
  } catch (err) {
    console.warn('Storage sanitation notice:', err);
  }
};

// 7. PII Masking Utilities for Public View & Storage Protection
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
  const parts = address.split(',');
  if (parts.length > 1) {
    return 'Sector Protected, ' + parts.slice(1).join(',').trim();
  }
  return address.replace(/\d+/g, '•');
};
