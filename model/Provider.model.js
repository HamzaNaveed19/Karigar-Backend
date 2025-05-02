import mongoose from "mongoose";
import User from "./User.model.js";

const ServiceProviderSchema = new mongoose.Schema({
  verificationDocuments: {
    frontPic: { type: String, required: true },
    backPic: { type: String, required: true },
  },
  verified: { type: Boolean, default: false },

  personalImage: { type: String },
  location: {
    latitude: { type: Number },
    longitude: { type: Number },
    address: { type: String, required: true },
  },
  profession: { type: String, required: true },
  about: { type: String },
  services: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      duration: { type: Number, required: true },
    },
  ],

  workingHours: {
    MF: { type: String, required: true},
    Sat: { type: String, required: true },
    Sun: { type: String, required: true },
  },

  skills: [{ type: String, required: true }],
  experience: { type: Number, required: true },
  languages: [{ type: String, required: true }],
  education: { type: String },

  notifications: [
    {
      description: { type: String },
      type: { type: String },
      read: { type: Boolean, default: false },
      date: { type: Date, default: Date.now },
    },
  ],

  rating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});

const ServiceProvider = User.discriminator(
  "ServiceProvider",
  ServiceProviderSchema
);
export default ServiceProvider;
