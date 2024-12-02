import { calculateCartTotal } from "../utils/cart.util.js";
import AppError from "../utils/ErrorHandler.js";

export const validateCart = (req, res, next) => {
  try {
    const { cartItems } = req.body;
    if (!cartItems || !Array.isArray(cartItems)) {
      throw new AppError("Cart items are missing or invalid", 400);
    }
    req.cartTotal = calculateCartTotal(cartItems);
    next();
  } catch (error) {
    next(error);
  }
};
