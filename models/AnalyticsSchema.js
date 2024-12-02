import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  metricType: {
    type: String,
    enum: ["userActivity", "sales", "productView", "revenue"],
    required: true,
  },
  details: { type: mongoose.Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Analytics = mongoose.model("Analytics", analyticsSchema);
export default Analytics;
