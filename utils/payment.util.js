/**
 * Generates a unique transaction ID.
 * @returns {string} A unique transaction ID.
 */
const generateTransactionId = () =>
  `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

/**
 * Formats a given amount to two decimal places.
 * @param {number|string} amount - The amount to format.
 * @returns {string} Formatted amount.
 */
const formatAmount = (amount) => {
  if (isNaN(amount)) throw new Error("Invalid amount");
  return parseFloat(amount).toFixed(2);
};

export { generateTransactionId, formatAmount };
