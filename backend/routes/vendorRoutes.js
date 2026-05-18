const express = require('express');
const { createVendorProfile, getMyVendorProfile, updateVendorProfile } = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/profile', createVendorProfile);
router.get('/profile', getMyVendorProfile);
router.put('/profile', updateVendorProfile);

module.exports = router;
