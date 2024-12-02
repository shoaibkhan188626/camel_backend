import AppError from "../utils/ErrorHandler.js";
import { isValidStatusTransition } from "../utils/order.util.js";

export const validateOrderStatus = (req, res, next) => {
  try {
    const { currentStatus, newStatus } = req.body;
    if (!currentStatus || !newStatus) {
      throw new AppError("Order Status detils are missing", 400);
    }
    if (!isValidStatusTransition(currentStatus, newStatus)) {
      throw new AppError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        400
      );
    }
    next();
  } catch (error) {
    next(error);
  }
};
