import jwt from "jsonwebtoken";
import AppError from "../utils/ErrorHandler.js";
import User from "../models/userSchema";

export const protect = async (rqe, res, next) => {
  let token;
  if (
    req.headers.authrorization &&
    req.headers.authrorization.startsWith("Bearer")
  ) {
    token = req.header.authrorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) {
    return next(
      new AppError("you are not logged in. Please Log in to access", 401)
    );
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return next(new AppError("Invalid token. Please log in again",401))
  }
};
