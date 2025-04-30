import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Securely hashed
    phone: { type: String, required: true },
    
    location: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
      address: { type: String, required: true }
    },

    profileImage: { type: String, required: false }, // Profile picture URL
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", CustomerSchema);
export default Customer;