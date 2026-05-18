const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { getVendorReviews, createVendorReview } = require('../controllers/reviewController');

const router = express.Router();

// public reviews for a vendor
router.get('/vendors/:vendorId', getVendorReviews);
router.post('/vendors/:vendorId', authMiddleware, createVendorReview);

module.exports = router;
