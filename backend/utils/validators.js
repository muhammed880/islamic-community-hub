// Email validator
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validator
const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// UPI ID validator
const isValidUpiId = (upiId) => {
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z]+$/;
  return upiRegex.test(upiId);
};

// Password validator
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Amount validator
const isValidAmount = (amount) => {
  return Number.isFinite(amount) && amount > 0;
};

module.exports = {
  isValidEmail,
  isValidPhone,
  isValidUpiId,
  isStrongPassword,
  isValidAmount
};
