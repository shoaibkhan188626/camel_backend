import mongoose, { Schema } from "mongoose";
import Joi from "joi";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },

  camels: [
    {
      camel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Camel",
        required: [true, "Camel is required"],
      },
      quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
        default: 1,
      },
    },
  ],

  totalQuantity: {
    type: Number,
    required: true,
    default: 0,
  },

  totalPrice: {
    type: Number,
    required: true,
    default: 0,
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

cartSchema.pre("save", function (next) {
  this.totalQuantity = this.camels.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  this.totalPrice = this.camels.reduce(
    (acc, item) => acc + item.quantity * (item.camel.price || 0),
    0
  );
  next();
});

cartSchema.static.validateCart = function (cart) {
  const schema = Joi.object({
    user: Joi.string().required(),
    camels: Joi.array()
      .items(
        Joi.object({
          camel: Joi.string().required(),
          quantity: Joi.number().min(1).required(),
        })
      )
      .required(),
  });

  return schema.validate(cart);
};

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
