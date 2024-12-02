import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Joi from "joi";
import validator from "validator";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "admin name is required"],
    trim: true,
    minLength: [3, "Name must be at least 3 characters"],
    maxLength: [50, "Name cannot exceed 50 characters"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: [validator.isEmail, "please provide a valid email address"],
  },

  password: {
    type: String,
    required: [true, "password is required"],
    minLength: [8, "Password must be at least 8 characters"],
    select: false,
  },

  role: {
    type: String,
    enum: ["superadmin", "moderator"],
    default: "moderator",
  },

  permissions: [
    {
      type: String,
      enum: [
        "manage_users",
        "manage_products",
        "manage_orders",
        "manage_reviews",
        "view_reports",
        "update_settings",
      ],
    },
  ],

  lastLogin: {
    typ: Date,
    default: null,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Joi validation

adminSchema.static.validation = function (admin) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid("superadmin", "moderator").default("moderator"),
    permissions: Joi.array()
      .items(
        Joi.string().valid(
          "manage_users",
          "manage_products",
          "manage_orders",
          "manage_reviews",
          "viwe_reports",
          "update_settings"
        )
      )
      .optional(),
    isActive: Joi.boolean().default(true),
  });
  return schema.validate(admin);
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
