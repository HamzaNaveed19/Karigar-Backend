import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  { 
    name: { type: String, required: true },
    phone: { type: String, required: true },   
    location: { type: String, required: true }, // Service area    
    skills: [{ type: String, required: true }], // Array of skills
    experience: { type: Number, required: true }, // Years of experience
    pricing: { type: Number, required: true }, // Service pricing
    verificationDocuments: [{ type: String , required: false}], // URLs of uploaded documents
    personalImage: { type: String , required: false}, // URLs of portfolio images
    rating: { type: Number, default: 0 }, 
    reviews: [{ type: String }],
  },
  { timestamps: true }
);


const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
export default ServiceProvider;