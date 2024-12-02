import { validateCoupon } from "../utils/coupon.util.js";
import AppError from "../utils/ErrorHandler.js";

export const validateCouponMiddleware = (req, res, next) => {
  try {
    const { coupon } = req.body;
    if (!coupon) {
      return next(new AppError("Coupon is reuqired", 400));
    }
    validateCoupon(coupon);
    next();
  } catch (error) {
    next(error);
  }
};
