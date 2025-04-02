import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  { 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Added for authentication
    password: { type: String, required: true }, // Securely hashed
    phone: { type: String, required: true },   

    location: {  
      latitude: { type: Number, required: false }, 
      longitude: { type: Number, required: false }, 
      address: { type: String, required: true }
    }, 

    skills: [{ type: String, required: true }], // Array of skills
    experience: { type: Number, required: true }, // Years of experience
    pricing: { type: Number, required: true }, // Service pricing
    
    verificationDocuments: [{ type: String , required: false}], // URLs of uploaded documents CNIC pics
    personalImage: { type: String , required: false}, // URLs of portfolio images 
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);


const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema);
export default ServiceProvider;