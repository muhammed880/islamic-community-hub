const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/environment');
const { USER_ROLES } = require('../config/constants');

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.userRole !== USER_ROLES.SUPER_ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Only Super Admin can access this resource'
    });
  }
  next();
};

const isMasjidAuthority = (req, res, next) => {
  if (req.userRole !== USER_ROLES.MASJID_AUTHORITY) {
    return res.status(403).json({
      success: false,
      message: 'Only Masjid Authority can access this resource'
    });
  }
  next();
};

const isGeneralUser = (req, res, next) => {
  if (req.userRole !== USER_ROLES.GENERAL_USER) {
    return res.status(403).json({
      success: false,
      message: 'Only General Users can access this resource'
    });
  }
  next();
};

module.exports = {
  verifyToken,
  isSuperAdmin,
  isMasjidAuthority,
  isGeneralUser
};
