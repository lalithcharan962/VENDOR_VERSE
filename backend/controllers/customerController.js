const Product = require('../models/Product');
const VendorProfile = require('../models/VendorProfile');
const User = require('../models/User');

const getAllVendors = async (req, res, next) => {
  try {
    const vendors = await VendorProfile.find()
      .populate('ownerId', 'name email')
      .lean();

    res.json(vendors);
  } catch (error) {
    next(error);
  }
};

const getVendorById = async (req, res, next) => {
  try {
    const vendor = await VendorProfile.findById(req.params.id)
      .populate('ownerId', 'name email');

    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    res.json(vendor);
  } catch (error) {
    next(error);
  }
};

const incrementVendorInquiry = async (req, res, next) => {
  try {
    const vendor = await VendorProfile.findById(req.params.id);
    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    vendor.inquiryCount = (vendor.inquiryCount || 0) + 1;
    await vendor.save();

    res.json(vendor);
  } catch (error) {
    next(error);
  }
};

const getVendorProducts = async (req, res, next) => {
  try {
    // vendorId param is the VendorProfile _id; products reference the vendor owner's user id
    const vendorProfile = await VendorProfile.findById(req.params.vendorId);
    if (!vendorProfile) {
      res.status(404);
      throw new Error('Vendor not found');
    }
    const ownerId = vendorProfile.ownerId;
    const products = await Product.find({ vendorId: ownerId });
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('vendorId', 'name email')
      .lean();

    res.json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVendors,
  getVendorById,
  incrementVendorInquiry,
  getVendorProducts,
  getAllProducts,
};
