import { calculateDeliveryDate } from "../utils/date.util.js";
import AppError from "../utils/ErrorHandler.js";

export const calculateDeliveryDateMiddleware = (req, res, next) => {
  try {
    const { shippingDate, transitDays } = req.body;
    if (!shippingDate || !transitDays) {
      throw new AppError("shipping date and transit days are required", 400);
    }
    req.deliveryDate = calculateDeliveryDate(
      new Date(shippingDate),
      transitDays
    );
    next();
  } catch (error) {
    next(error);
  }
};
