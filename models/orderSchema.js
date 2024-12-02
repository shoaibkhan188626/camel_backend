import mongoose from "mongoose";
import Joi from 'joi'

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },

  camel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Camel",
    required: [true, "Camel is required"],
  },

  orderStatus: {
    type: String,
    enum: ["pending", "completed", "shipped", "cancelled"],
    default: "pending",
  },

  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },

  totalPrice: {
    type: Number,
    required: [true, "Total Price is required"],
    min: [0, "total price must be a postive number"],
  },

  shippingAddress: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },

  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed"],
    default: "pending",
  },

  paymentMethod: {
    type: String,
    enum: ["Credit Card", "PayPal", "Bank Transfer", "Cash", "STC_PAY"],
    required: [true, "payment method is required"],
  },

  orderDate: {
    type: Date,
    default: Date.now,
  },

  shippingDate: {
    type: Date,
    default: null,
  },

  deliveryDate: {
    type: Date,
    default: null,
  },

  trackingNumber: {
    type: String,
    default: null,
  },

  shippingFee: {
    type: Number,
    default: 0,
  },

  couponCode: {
    type: String,
    default: null,
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

//joi validation

orderSchema.static.validateOrder = function (order) {
  const schema = Joi.object({
    user: Joi.string().required(), // user ID
    camel: Joi.string().required(), // camel ID
    orderStatus: Joi.string()
      .valid("pending", "completed", "shipped", "canceled")
      .default("pending"),
    quantity: Joi.number().min(1).required(),
    totalPrice: Joi.number().min(0).required(),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    paymentStatus: Joi.string()
      .valid("paid", "pending", "failed")
      .default("pending"),
    paymentMethod: Joi.string()
      .valid("Credit Card", "PayPal", "Bank Transfer")
      .required(),
    orderDate: Joi.date().default(Date.now),
    shippingDate: Joi.date().optional(),
    deliveryDate: Joi.date().optional(),
    trackingNumber: Joi.string().optional(),
    shippingFee: Joi.number().min(0).default(0),
    couponCode: Joi.string().optional(),
  });

  return schema.validate(order);
};

const Order = mongoose.model("Order", orderSchema);
export default Order;
