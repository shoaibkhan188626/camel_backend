import AppError from "../utils/ErrorHandler.js";
import { verifyToken } from "../utils/tokenUtil.js";

export const tokenValidationMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      throw new AppError("Atuhroization token is required", 401);
    }
    req.user = verifyToken(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    next(error);
  }
};
