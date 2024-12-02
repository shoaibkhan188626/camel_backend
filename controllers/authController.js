import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/ErrorHandler.js";
import { sendEmail } from "../utils/sendEMail.js";
import {
  validateLogin,
  validatePasswordReset,
  validateSignup,
} from "../utils/validation.util.js";
import dotenv from "dotenv";
dotenv.config();

const { JWT_SECRET, JWT_EXPIRES_IN, COOKIE_EXPIRES } = process.env;

const RESET_TOKEN_EXPIRY = 15 * 60 * 1000;

export const signup = catchAsync(async (req, res, next) => {
  const { email, password, name, phone, gender, dateOfBirth, shippingAddress } =
    req.body;

  const { error } = validateSignup(req.body);

  if (error) return next(new AppError(error.details[0].message, 400));

  const UserExists = await User.findOne({ email });

  if (UserExists) {
    return next(new AppError("User already exists with this email", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await User.create({
    email,
    password: hashedPassword,
    name,
    phone,
    gender,
    dateOfBirth,
    shippingAddress,
  });
console.log(JWT_SECRET)
  const token = jwt.sign(
    { id: newUser._id, name: newUser.name, email: newUser.email },
    JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  res.cookie("token", token, {
    expires: new Date(
      Date.now() +
        (process.env.COOKIE_EXPIRES
          ? parseInt(process.env.COOKIE_EXPIRES) * 24 * 60 * 60 * 1000 // Days to ms
          : 7 * 24 * 60 * 60 * 1000) // Default to 7 days if undefined
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  console.log("Rquest body", req.body);
  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      gender: newUser.gender,
      DOB: newUser.dateOfBirth,
      address: newUser.shippingAddress,
    },
    token,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Log the incoming request
  console.log("Request Body password-------->>>>>>>>>>:", req.body.password);

  // Validate Input
  const { error } = validateLogin(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  // Find User
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid credentials there is no user", 400));
  }
  console.log('password of the user---------->>>>>>>>>>',user.password);
  // Compare Passwords
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError("Invalid Credentials there is no password", 401));
  }

  // Ensure JWT Configuration is Valid
  if (!JWT_SECRET || !JWT_EXPIRES_IN) {
    console.log("JWT_SECRET:", JWT_SECRET); // Debug log for JWT_SECRET
    console.log("JWT_EXPIRES_IN:", JWT_EXPIRES_IN); // Debug log for JWT_EXPIRES_IN
    return next(new AppError("JWT configuration is missing", 500));
  }

  // Generate Token
  const token = jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Ensure COOKIE_EXPIRE is defined
  console.log("COOKIE_EXPIRE:", COOKIE_EXPIRES); // Debug log for COOKIE_EXPIRE

  // Set Cookie
  const cookieExpireTime = parseInt(COOKIE_EXPIRES) * 24 * 60 * 60 * 1000;
  res.cookie("token", token, {
    expires: new Date(Date.now() + cookieExpireTime),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  // Success Response
  res.status(200).json({
    token,
    status: "success",
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const passwordResetRequest = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const { error } = validatePasswordReset(req.body);

  if (error) return next(new AppError(error.details[0].message, 400));

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError("No User found with this email", 404));
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const resetTokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetToken = resetTokenHash;
  user.passwordResetExpires = Date.now() + RESET_TOKEN_EXPIRY;
  await user.save();

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendEmail(
    user.email,
    "password Reset Request",
    `Click the link to reset your password : ${resetURL}`
  );

  res.status(200).json({
    status: "success",
    message: "Password reset email sent",
  });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { token, newPassword } = req.body;
  const resetTokenHash = crypto.createHash("sh256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: resetTokenHash,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("invalid orexpiredreset token", 400));
  }
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "password reset successfully",
  });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  if (name) user.name = name;
  if (email) {
    const emailExists = await User.findOne({ email });
    if (emailExists) return next(new AppError("Email is already in use", 400));
    user.email = email;
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
  }

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Profile updated successfuly",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});
