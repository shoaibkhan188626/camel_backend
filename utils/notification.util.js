/**
 * Creates a notification payload object.
 * @param {string} userId - ID of the user to notify.
 * @param {string} message - The notification message.
 * @param {string} [type='info'] - The notification type (e.g., 'info', 'error').
 * @returns {Object} Notification payload.
 */
const createNotificationPayload = (userId, message, type = "info") => {
  if (!userId || !message) throw new Error("User ID and message are required");
  return {
    userId,
    message,
    type,
    date: new Date(),
  };
};

export { createNotificationPayload };
