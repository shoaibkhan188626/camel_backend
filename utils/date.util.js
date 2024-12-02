/**
 * Calculates an estimated delivery date based on shipping date and transit days.
 * @param {Date} shippingDate - The date the product was shipped.
 * @param {number} transitDays - Number of days for transit.
 * @returns {string} ISO string of the calculated delivery date.
 */
const calculateDeliveryDate = (shippingDate, transitDays) => {
  if (!shippingDate || !transitDays) {
    throw new Error("Shipping date and transit days are required");
  }
  const deliveryDate = new Date(shippingDate);
  deliveryDate.setDate(deliveryDate.getDate() + transitDays);
  return deliveryDate.toISOString();
};

export { calculateDeliveryDate };
