import AppError from "../utils/ErrorHandler.js";
import { generateTransactionId, formatAmount } from "../utils/payment.util.js";

export const paymentAuthorization = (req, res, next) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      throw new AppError("payment amount is required", 400);
    }
    req.transactionId = generateTransactionId();
    req.formattedAmount = formatAmount(amount);
    next();
  } catch (error) {
    next(error);
  }
};
