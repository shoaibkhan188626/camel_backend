import mongoose from "mongoose";
import Joi from "joi";

const settingsSchema = new mongoose.Schema({
  taxRates: {
    VAT: { type: Number, default: 0 },
    GST: { type: Number, default: 0 },
    otherTaxes: [{ name: String, rate: Number }],
  },

  shippingPolicies: {
    freeShippingThreshold: { type: Number, default: 0 },
    flatRate: { type: Number, default: 0 },
    deliveryTimes: { type: String, default: "3-7 bussiness days" },
  },

  commisionRates: {
    seller: { type: Number, default: 10 },
  },

  notificationTemplates: {
    email: {
      welcome: { type: String, default: "welcome to CamelCommerce" },
      orderConfirmation: {
        type: String,
        default: "Your order has been placed successfully",
      },
    },
    SMS: {
      orderUpdate: {
        type: String,
        default: "Your order status has been updated",
      },
    },
  },

  platformPolicies: {
    termsAndConditions: { type: String, default: "" },
    privacyPolicy: { type: String, default: "" },
    returnPolicy: { type: String, default: "" },
  },

  currency: {
    type: String,
    default: "SAR",
    enum: ["SAR", "USD", "INR", "GBP", "AUD"],
  },

  timeZone: {
    type: String,
    default: "UTC",
  },

  maintainanceMode: {
    type: Boolean,
    default: false,
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

settingsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

settingsSchema.static.validateSettings = function (settings) {
  const schema = Joi.object({
    taxRates: Joi.object({
      VAT: Joi.number().min(0).default(0),
      GST: Joi.number().min(0).default(0),
      otherTaxes: Joi.array()
        .items(
          Joi.object({
            name: Joi.string().required(),
            rate: Joi.number().min(0).required(),
          })
        )
        .default([]),
    }),

    shippingPolicies: Joi.object({
      freeShippingThreshold: Joi.number().min(0).default(0),
      flatRate: Joi.number().min(0).default(0),
      deliveryTimes: Joi.string().default("3-7 bussiness days"),
    }),

    commisionRates: Joi.object({
      seller: Joi.number().min(0).max(100).default(10),
    }),

    notificationTemplates: Joi.object({
      email: Joi.object({
        welcome: Joi.string().default("Welcome to CamelCommerce"),
        orderConfirmation: Joi.string().default(
          "Your order has been placed successfully"
        ),
      }).default(),
      SMS: Joi.object({
        orderUpdate: Joi.string().default("Your order status has been updated"),
      }).default(),
    }),

    platformPolicies: Joi.object({
      termsAndConditions: Joi.string().default(""),
      privacyPolicy: Joi.string().default(""),
      returnPolicy: Joi.string().default(""),
    }),

    currency: Joi.string()
      .valid("SAR", "USD", "INR", "GBP", "AUD")
      .default("SAR"),

    timeZone: Joi.string().default("UTC"),
    maintainanceMode: Joi.boolean().default(false),
  });
  return schema.validate(settings, { abortEarly: false });
};

const Settings = mongoose.Model("Settings", settingsSchema);
export default Settings;
