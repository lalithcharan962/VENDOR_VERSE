const Product = require('../models/Product');

const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, image } = req.body;
    if (!title || !description || price == null) {
      res.status(400);
      throw new Error('Title, description, and price are required');
    }

    const product = await Product.create({
      title,
      description,
      price,
      image: image || '',
      vendorId: req.user._id,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const incrementProductInquiry = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.inquiryCount = (product.inquiryCount || 0) + 1;
    await product.save();

    res.json({ message: 'Inquiry recorded', inquiryCount: product.inquiryCount });
  } catch (error) {
    next(error);
  }
};

const getVendorProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ vendorId: req.user._id });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, vendorId: req.user._id });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const { title, description, price, image } = req.body;
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price != null ? price : product.price;
    product.image = image || product.image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, vendorId: req.user._id });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  incrementProductInquiry,
  getVendorProducts,
  updateProduct,
  deleteProduct,
};
