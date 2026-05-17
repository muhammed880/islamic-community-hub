const { v4: uuidv4 } = require('uuid');

// Generate unique ID
const generateId = () => uuidv4();

// Generate receipt number
const generateReceiptNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `RECEIPT-${new Date().getFullYear()}-${timestamp}${random}`;
};

// Generate certificate number
const generateCertificateNumber = () => {
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `CERT-${new Date().getFullYear()}-${timestamp}${random}`;
};

// Paginate results
const paginate = (page = 1, limit = 10) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.min(Math.max(1, parseInt(limit) || 10), 100);
  const skip = (pageNum - 1) * limitNum;
  
  return { skip, limit: limitNum, page: pageNum };
};

// Format error response
const formatErrorResponse = (message, errors = []) => {
  return {
    success: false,
    message,
    errors
  };
};

// Format success response
const formatSuccessResponse = (message, data = null, pagination = null) => {
  const response = {
    success: true,
    message,
    data
  };
  
  if (pagination) {
    response.pagination = pagination;
  }
  
  return response;
};

module.exports = {
  generateId,
  generateReceiptNumber,
  generateCertificateNumber,
  paginate,
  formatErrorResponse,
  formatSuccessResponse
};
