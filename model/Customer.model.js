import mongoose from "mongoose";
import User from "./User.model.js";

const CustomerSchema = new mongoose.Schema(
  {
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String, required: true },
  },
  profileImage: { type: String, required: false },

  notifications: [
    {
      description: { type: String },
      type: { type: String },
      read: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    }
  ],
  }
);

const Customer = User.discriminator("Customer", CustomerSchema);
export default Customer;
