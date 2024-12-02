import mongoose from "mongoose";

const supportTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },

  desscription: { type: String, required: true },
  status: {
    type: String,
    enum: ["open", "inProgress", "resolved", "closed"],
    default: "open",
  },

  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);
export default SupportTicket;
