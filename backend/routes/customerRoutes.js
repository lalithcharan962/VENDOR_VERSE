const express = require('express');
const {
  getAllVendors,
  getVendorById,
  incrementVendorInquiry,
  getVendorProducts,
  getAllProducts,
} = require('../controllers/customerController');

const router = express.Router();

router.get('/vendors', getAllVendors);
router.get('/vendors/:id', getVendorById);
router.post('/vendors/:id/inquire', incrementVendorInquiry);
router.get('/vendors/:vendorId/products', getVendorProducts);
router.get('/products', getAllProducts);

module.exports = router;
