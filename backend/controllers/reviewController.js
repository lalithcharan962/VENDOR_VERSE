const Review = require('../models/Review');
const VendorProfile = require('../models/VendorProfile');

const getVendorReviews = async (req, res, next) => {
  try {
    const vendorId = req.params.vendorId;
    const reviews = await Review.find({ vendorId }).sort({ createdAt: -1 }).lean();
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

const createVendorReview = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { rating, comment } = req.body;

    const vendor = await VendorProfile.findById(vendorId);
    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    if (!rating || rating < 1 || rating > 5) {
      res.status(400);
      throw new Error('Rating must be between 1 and 5');
    }

    // prevent duplicate reviews from the same user: update if exists
    const existing = await Review.findOne({ vendorId, userId: req.user._id });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment?.trim() || '';
      existing.updatedAt = Date.now();
      await existing.save();
      return res.status(200).json(existing);
    }

    const review = await Review.create({
      vendorId,
      userId: req.user._id,
      userName: req.user.name || req.user.email,
      rating,
      comment: comment?.trim() || '',
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

module.exports = { getVendorReviews, createVendorReview };
