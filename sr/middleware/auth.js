const jwt = require('jsonwebtoken');
const config = require('../config/constants');

module.exports = (req, res, next) => {
  // Lấy token từ header
  const token = req.header('x-auth-token');

  // Kiểm tra nếu không có token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Xác minh token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Thêm user vào request
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};