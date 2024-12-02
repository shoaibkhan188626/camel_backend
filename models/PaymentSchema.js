import mongoose from "mongoose";
import Joi from 'joi'
import { uniqueId } from "lodash";

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },

  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "Order is required"],
  },

  paymentMethod: {
    type: String,
    enum: ["Credit Card", "PayPal", "Bank Transfer", "Cash", "STC_PAY"],
    required: [true, "payment method is required"],
  },

  paymentStatus: {
    type: String,
    enum: ["paid", "pending", "failed", "refund"],
    default: "pending",
  },

  amount: {
    type: Number,
    required: [true, "Payment amount is required"],
    min: [0, "amount must be a positive number"],
  },

  transactionId: {
    type: String,
    required: [true, "transaction ID is required"],
    unique: true,
  },

  paymentDate: {
    type: Date,
    default: Date.now,
  },

  paymentGatewayResponse: {
    type: Object,
    default: {},
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
paymentSchema.static.validatePayment = function (payment) {
  const schema = Joi.object({
    user: Joi.string().required(),
    order: Joi.string().required(),
    paymentMethod: Joi.string()
      .valid("Credit Card", "PayPal", "Bank Transfer", "Cash", "STC_PAY")
      .required(),
    paymentStatus: Joi.string()
      .valid("paid", "pending", "failed", "refunded")
      .default("pending"),

    amount: Joi.number().min(0).required(),
    transactionId: Joi.string().required(),
    paymentDate: Joi.date().default(Date.now),
  });

  return schema.validate(payment);
};

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
