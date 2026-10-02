import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },

  items: {
    type: Array,
    required: true
  },

  total: {
    type: Number,
    required: true
  },

  status: {
  type: String,
  enum: ["Pending", "Processing", "Completed", "Cancelled"],
  default: "Pending"
},

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
