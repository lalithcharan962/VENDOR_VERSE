const Product = require('../models/Product');
const Review = require('../models/Review');
const VendorProfile = require('../models/VendorProfile');

const createVendorProfile = async (req, res, next) => {
  try {
    const { businessName, category, location, description } = req.body;
    if (!businessName || !category || !location || !description) {
      res.status(400);
      throw new Error('Business name, category, location and description are required');
    }

    const existingProfile = await VendorProfile.findOne({ ownerId: req.user._id });
    if (existingProfile) {
      res.status(409);
      throw new Error('Vendor profile already exists for this user');
    }

    const profile = await VendorProfile.create({
      businessName,
      category,
      location,
      phoneNumber: req.body.phoneNumber || '',
      description,
      profilePhoto: req.body.profilePhoto || '',
      ownerId: req.user._id,
    });

    res.status(201).json(profile);
  } catch (error) {
    next(error);
  }
};

const getMyVendorProfile = async (req, res, next) => {
  try {
    const profile = await VendorProfile.findOne({ ownerId: req.user._id });
    if (!profile) {
      res.status(404);
      throw new Error('Vendor profile not found');
    }
    res.json(profile);
  } catch (error) {
    next(error);
  }
};

const updateVendorProfile = async (req, res, next) => {
  try {
    const profile = await VendorProfile.findOne({ ownerId: req.user._id });
    if (!profile) {
      res.status(404);
      throw new Error('Vendor profile not found');
    }

    const { businessName, category, location, phoneNumber, description, profilePhoto } = req.body;
    profile.businessName = businessName || profile.businessName;
    profile.category = category || profile.category;
    profile.location = location || profile.location;
    profile.phoneNumber = phoneNumber || profile.phoneNumber;
    profile.description = description || profile.description;
    profile.profilePhoto = profilePhoto || profile.profilePhoto;

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVendorProfile,
  getMyVendorProfile,
  updateVendorProfile,
};
