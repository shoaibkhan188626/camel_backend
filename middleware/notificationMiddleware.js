import { createNotificationPayload } from "../utils/notification.util.js";
import AppError from "../utils/ErrorHandler.js";
export const notificationMiddleware = (req, res, next) => {
  try {
    const { userId, message, type } = req.body;
    if (!userId || !message) {
      throw new AppError(
        "user ID and message are required for notification",
        400
      );
    }
    req.notification = createNotificationPayload(userId, message, type);
    next();
  } catch (error) {
    next(error);
  }
};
