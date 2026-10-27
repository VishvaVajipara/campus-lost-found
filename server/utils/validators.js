// Email rule shared by the User model and the controllers.
// The browser uses the same rule (client/src/utils/helpers.js).
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const isValidEmail = (value) => {
  const text = String(value).trim();
  return text.length <= 254 && !text.includes('..') && EMAIL_REGEX.test(text);
};

// Contact info: either a valid email or a phone number with 10 to 13 digits
const isValidContact = (value) => {
  const text = String(value).trim();
  const digits = text.replace(/\D/g, ''); // keep only the digits
  const isPhone = /^\+?[\d\s()-]+$/.test(text) && digits.length >= 10 && digits.length <= 13;
  return isValidEmail(text) || isPhone;
};

module.exports = { EMAIL_REGEX, isValidEmail, isValidContact };
