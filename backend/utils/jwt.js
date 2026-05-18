const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'vendorverse_dev_secret';
  if (!process.env.JWT_SECRET) {
    console.warn('Warning: JWT_SECRET is not set. Using a local default secret for development.');
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: '7d',
  });
};

module.exports = { generateToken };
