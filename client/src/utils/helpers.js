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
