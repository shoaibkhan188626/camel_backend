import mongoose from "mongoose";
import Joi from 'joi'

const shippingSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "Order refrence is required"],
  },

  shippingAddress: {
    type: {
      street: { type: String, required: [true, " street is required"] },
      city: { type: String, required: [true, " city is required"] },
      state: { type: String, required: [true, " state is required"] },
      zipCode: { type: String, required: [true, " zipcode is required"] },
      country: { type: String, required: [true, " Country is required"] },
    },
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "shipped", "in transit", "delivered", "cancelled"],
    default: "pending",
  },

  courier: {
    type: String,
    required: [true, "Courier service is required"],
  },

  trackingNumber: {
    type: String,
    unique: true,
    sparse: true,
  },

  estimatedDelivery: {
    type: Date,
    required: [true, "Estimated delivery date is required"],
  },

  actualDelivery: {
    type: Date,
    default: null,
  },

  createdtAt: {
    type: Date,
    default: Date.now,
  },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

shippingSchema.static.validateShipping = function (shipping) {
  const schema = Joi.object({
    order: Joi.string().required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    status: Joi.string()
      .valid("pending", "shipped", "in transit", "delivered", "cancelled")
      .default("pending"),
    courier: Joi.string().required(),
    trackingNumber: Joi.string().optional(),
    estimatedDelivery: Joi.date().required(),
    actualDelivery: Joi.date().optional(),
  });
  return schema.validate(shipping);
};

const Shipping = mongoose.model("Shipping", shippingSchema);
export default Shipping;
