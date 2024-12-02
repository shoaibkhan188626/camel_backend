import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";
import Joi from "joi";
import moment from "moment";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Name should have at least 3 characters"],
      maxLength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "please porvide a valid email address"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
    },

    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "password must be at least 8 characters long"],
      select: false,
    },

    profilePicture: {
      type: String,
      default:
        "https://images.pexels.com/photos/2080189/pexels-photo-2080189.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",

      validate: [
        validator.isURL,
        "please provide a valid URL for the profile pic",
      ],
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },

    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },

    role: {
      type: String,
      enum: ["admin", "seller", "buyer"],
      default: "buyer",
    },

    status: {
      type: String,
      enum: ["active", "suspended", "deactivated"],
      default: "active",
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },

    lastUpdated: {
      type: Date,
      default: Date.now(),
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailVerificationToken: String,
    emailVerificationExpire: Date,

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    isTwofactoreEnabled: {
      type: Boolean,
      default: false,
    },

    shippingAddress: {
      type: {
        street: { type: String, required: [true, "Street is required"] },
        city: { type: String, required: [true, "city is required"] },
        state: { type: String, required: [true, "State is required"] },
        zipCode: { type: String, required: [true, "zip code is rquired"] },
        country: { type: String, required: [true, "country is required"] },
      },
      default: {},
    },

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    paymentMethods: [
      {
        type: String,
        required: true,
      },
    ],
  },
  { Timestamps: true }
);

//Hashing the password before saving it
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.pre("save", async function (next) {
  if (this.dateOfBirth) {
    this.dateOfBirth = moment(this.dateOfBirth).format("YYYY-MM-DD");
  }
  next();
});

// Password Comparison Method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//joi validation of schema
userSchema.static.validateUser = function (user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string()
      .pattern(/^\d{10}$/)
      .required(),
    password: Joi.string().min(8).required(),
    profilePicture: Joi.string()
      .uri()
      .default(
        "https://images.pexels.com/photos/2080189/pexels-photo-2080189.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      ),
    gender: Joi.string().valid("male", "female", "other").required(),
    dateOfBirth: Joi.date().required(),
    role: Joi.string().valid("admin", "seller", "buyer").default("buyer"),
    status: Joi.string()
      .valid("active", "suspended", "deactivated")
      .default("active"),
    shippingAddress: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      zipCode: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
  });

  return schema.validate(user);
};

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ status: 1 });

const User = mongoose.model("User", userSchema);
export default User;
