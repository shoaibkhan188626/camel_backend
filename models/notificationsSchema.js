import mongoose from "mongoose";
import Joi from "joi";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User refrence is required"],
  },

  message: {
    type: String,
    required: [true, "Notification message is required"],
    trim: true,
    maxLength: [200, "Message cannot exceed 200 cahracters"],
  },

  types: {
    type: String,
    enum: ["order", "promotion", "system", "other"],
    default: "other",
  },

  isRead: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  link: {
    type: String,
    validate: [(v) => v === null || validator.isURL(v), "Invalid URL"],
  },
});

notificationSchema.static.validateNotification = function (notification) {
  const schema = Joi.object({
    user: Joi.string().required(),
    message: Joi.string().max(200).required(),
    type: Joi.string()
      .valid("other", "promotion", "system", "order")
      .default("other"),
    isRed: Joi.boolean().default(false),
    link: Joi.string().uri().allow(null),
  });
  return schema.validate(notification);
};

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
