const express = require('express');
const {
  createProduct,
  incrementProductInquiry,
  getVendorProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/:id/inquire', incrementProductInquiry);

router.use(authMiddleware);

router.post('/', createProduct);
router.get('/my-products', getVendorProducts);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
