// Same list as the backend (server/models/Item.js)
export const CATEGORIES = [
  'ID Card',
  'Electronics',
  'Books & Stationery',
  'Wallet & Money',
  'Keys',
  'Bags',
  'Clothing',
  'Accessories',
  'Other',
];

// Starting values for the Browse page filters
export const DEFAULT_FILTERS = {
  search: '',
  category: '',
  location: '',
  type: '',
  status: 'active',
  sort: 'newest',
};

// Same email rule as the server (server/utils/validators.js)
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export const isValidEmail = (value) => {
  const text = value.trim();
  return text.length <= 254 && !text.includes('..') && EMAIL_REGEX.test(text);
};

// Contact must be a valid email or a phone number (10 to 13 digits)
export const isValidContact = (value) => {
  const text = value.trim();
  const digits = text.replace(/\D/g, '');
  const isPhone = /^\+?[\d\s()-]+$/.test(text) && digits.length >= 10 && digits.length <= 13;
  return isValidEmail(text) || isPhone;
};

// Shrinks a photo to max 800px and converts it to a small JPEG "data URL" (text).
// Done in the browser with a <canvas>, so the server never receives huge files.
export const resizeImage = (file, maxSize = 800) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff'; // white background for transparent PNGs
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let result = canvas.toDataURL('image/jpeg', 0.7);
        if (result.length > 380000) result = canvas.toDataURL('image/jpeg', 0.4); // still big? compress more
        resolve(result);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

// Shows a date like "12 Oct 2026"
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC', // dates are stored as UTC midnight, so show them in UTC too
  });

// Converts a stored date into "2026-10-12" for <input type="date">
export const dateToInputValue = (date) => new Date(date).toISOString().split('T')[0];

// Today's date as "YYYY-MM-DD" in the user's own timezone (used as the max date)
export const todayInputValue = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
