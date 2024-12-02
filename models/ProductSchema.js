import Joi from 'joi'
import mongoose from "mongoose";

const camelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name of the camel is required"],
    trim: true,
    minLength: [3, "camel name must have at least 3 characters"],
    maxLength: [50, "camel not should not exceed 50 characters"],
  },

  price: {
    type: Number,
    required: [true, "price is required"],
    min: [0, "price must be a postive number"],
  },

  description: {
    type: String,
    required: [true, "camel description is required"],
    minLength: [true, " description must have at least 10 characters"],
    maxLength: [true, "description cannot exceed 500 characters"],
  },

  age: {
    type: Number,
    required: [true, "Camel age is requred"],
    min: [0, "age must be a positive number"],
  },

  breed: {
    type: String,
    required: [true, "Camel breed is required"],
  },

  gender: {
    type: String,
    enum: ["male", "female"],
    required: [true, "Gender of the camel is a must"],
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  status: {
    type: String,
    enum: ["available", "sold", "reserved"],
    default: "available",
  },

  images: [
    {
      type: String,
      required: true,
    },
  ],

  location: {
    type: String,
    required: true,
  },

  heigh: {
    type: Number,
    required: true,
  },

  weight: {
    type: Number,
    required: true,
  },

  healthStatus: {
    type: String,
    default: "Healthy",
  },

  featured: {
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

  dateList: {
    type: Date,
    default: Date.now,
  },
});

camelSchema.static.validateCamel = function (camel) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().min(10).max(500).required(),
    age: Joi.number().min(0).required(),
    breed: Joi.string().required(),
    gender: Joi.string().valid("male", "female").required(),
    seller: Joi.string().required(), // Should be the user ID
    status: Joi.string()
      .valid("available", "sold", "reserved")
      .default("available"),
    images: Joi.array().items(Joi.string().uri()).required(),
    location: Joi.string().required(),
    weight: Joi.number().required(),
    height: Joi.number().required(),
    healthStatus: Joi.string().default("Healthy"),
    featured: Joi.boolean().default(false),
  });
  return schema.validate(camel);
};

const Camel = mongoose.model("Camel", camelSchema);
export default Camel;
