/**
 * Calculates the total price of items in a cart.
 * @param {Array} cartItems - Array of cart items with `price` and `quantity`.
 * @returns {number} Total cart price.
 */
const calculateCartTotal = (cartItems) => {
  if (!Array.isArray(cartItems)) throw new Error("Invalid cart items");
  return cartItems.reduce((total, item) => {
    if (!item.price || !item.quantity) {
      throw new Error("Invalid cart item");
    }
    return total + item.price * item.quantity;
  }, 0);
};

export { calculateCartTotal };
