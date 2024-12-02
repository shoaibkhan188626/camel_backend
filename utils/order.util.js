/**
 * Checks if the status transition for an order is valid.
 * @param {string} currentStatus - Current status of the order.
 * @param {string} newStatus - New status to transition to.
 * @returns {boolean} True if the transition is valid, otherwise false.
 */
const isValidStatusTransition = (currentStatus, newStatus) => {
  const validTransitions = {
    Pending: ["Processing", "Cancelled"],
    Processing: ["Shipped", "Cancelled"],
    Shipped: ["Delivered"],
  };
  return validTransitions[currentStatus]?.includes(newStatus) || false;
};

export { isValidStatusTransition };
