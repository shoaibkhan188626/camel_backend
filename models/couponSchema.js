import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, unique: true, required: true },
  discountPercentage: { type: Number, required: true, min: 0, max: 100 },
  maxDiscount: { type: Number, default: null },
  minPurchaseAmount: { type: Number, default: null },
  validFrom: { type: Date, required: true },
  validTill: { type: Date, required: true },
  useageLimit: { type: Number, default: null },
  usedCount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["active", "expired", "deactivated"],
    default: "active",
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
