import mongoose from "mongoose";
import validator from "validator";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
      unique: true,
      default: () =>
        `INV-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order refrence is required"],
    },

    customer: {
      name: {
        type: String,
        required: [true, "Customer name is required"],
        trime: true,
      },
      email: {
        type: String,
        required: [true, "Customer email is required"],
        validate: [validator.isEmail, "PLease provide a valid email address"],
        lowercase: true,
      },
      bilingAddress: {
        street: { type: String, required: [true, "street is required"] },
        city: { type: String, required: [true, "city is required"] },
        state: { type: String, required: [true, "state is required"] },
        zipCode: { type: String, required: [true, "zip-code is required"] },
        country: { type: String, required: [true, "country is required"] },
      },
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product refrence is required"],
        },
        name: {
          type: String,
          required: [true, "Product Name is required"],
        },
        quantity: {
          type: String,
          required: [true, "Product quantity is required"],
          min: [1, "Quantitymust be at least 1"],
        },
        price: {
          type: Number,
          required: [true, "Produt priceis required"],
          min: [0, "Price msut be greater than or equal to 0"],
        },
      },
    ],
    subTotal: {
      type: Number,
      required: [true, "subtotal is required"],
      min: [0, "Subtotal must be greater than or equal to 0"],
    },
    tax: {
      type: Number,
      required: [true, "Tax amount is required"],
      min: [0, "Tax must be greater than or equal to 0"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount can not be negative"],
    },
    total: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total must be greater than or equal to 0"],
    },
    paymentMethod: {
      type: String,
      enum: ["Credit Card", "PayPal", "Bank Transfer", "Cash", "STC_PAY"],
      required: [true, "payment method is required"],
    },
    status: {
      type: String,
      enum: ["paid", "unpaid", "pending", "refund"],
      default: "unpaid",
    },

    dateIssued: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
    },
    generatedPDFUrl: {
      type: String,
      validate: [validator.isURL, "please provide a valid URL"],
    },
  },
  { timestamps: true }
);

invoiceSchema.index({ invoiceId: 1 });
invoiceSchema.index({ order: 1 });
invoiceSchema.index({ customer: 1 });

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
