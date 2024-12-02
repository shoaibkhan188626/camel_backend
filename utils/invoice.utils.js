/**
 * Generates a unique invoice number.
 * @returns {string} A unique invoice number.
 */
const generateInvoiceNumber = () =>
  `INV-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export { generateInvoiceNumber };
