import jwt from "jsonwebtoken";
import AppError from "./ErrorHandler.js";

export const signToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }
};

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
