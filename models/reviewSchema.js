import mongoose from "mongoose";
import Joi from 'joi'

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "user is required"],
  },

  camel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Camel",
    required: [true, "Camel is required"],
  },

  rating: {
    type: Number,
    required: [true, "rating is required"],
    min: [1, "rating must be at least 1"],
    max: [5, "rating can not exceed 5"],
  },

  comment: {
    type: String,
    trim: true,
    maxLength: [1000, "comment cannot exceed 100 characters"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.static.valiadteReview = function (review) {
  const schema = Joi.object({
    user: Joi.string().required(),
    camel: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().max(1000).allow(""),
  });
  return schema.validate(review);
};

reviewSchema.index({ user: 1, camel: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
