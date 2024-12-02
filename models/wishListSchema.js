import mongoose from "mongoose";
import Joi from "joi";

const wishListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },

  camels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Camel",
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

wishListSchema.static.validateWishList = function (wishlist) {
  const schema = Joi.object({
    user: Joi.string().required(),
    camels: Joi.array().items(Joi.string()),
  });
  return schema.validate(wishlist);
};

const Wishlist = mongoose.model("Wishlist", wishListSchema);
export default Wishlist;
