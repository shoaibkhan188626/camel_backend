import AppError from "./ErrorHandler.js";

/**
 * Validates if the coupon is active and not expired.
 * @param {Object} coupon - The coupon object to validate.
 * @throws Will throw an error if the coupon is inactive or expired.
 */

const validateCoupon = (coupon) => {
  if (!coupon.isActive) {
    throw new AppError("Coupon is not active", 400);
  }
  if (new Date(coupon.expiryDate < Date.now())) {
    throw new AppError("Coupon has expired", 400);
  }
};

export { validateCoupon };
