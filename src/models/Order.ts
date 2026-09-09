import { model, Schema, Types } from "mongoose";

const orderItemSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const orderSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: {
      type: [orderItemSchema],
      required: true,
      validate: {
        // Prevent orders without purchasable items at the database layer.
        validator: (products: unknown[]) => products.length > 0,
        message: "An order must contain at least one product",
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

export const Order = model("Order", orderSchema);
