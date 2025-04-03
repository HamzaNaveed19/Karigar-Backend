import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    verificationDocuments: {
      frontPic: { type: String, required: true }, // URLs of front image of ID
      backPic: { type: String, required: true }, // URLs of back image of ID
    },
    personalImage: { type: String, required: false },

    location: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
      address: { type: String, required: true },
    },

    profession: { type: String, required: true }, // Service provider's profession
    about: { type: String, required: false },

    services: [
      {
        name: { type: String, required: true }, // Service name
        price: { type: Number, required: true }, // Service price
        duration: { type: Number, required: true }, // Service duration
      },
    ], // Array of services offered by the provider

    skills: [{ type: String, required: true }], // Array of skills
    experience: { type: Number, required: true }, // Years of experience
    languages: [{ type: String, required: true }], // Languages spoken
    education: { type: String, required: false },
    rating: { type: Number, default: 0 }, // Average rating
    totalReviews: { type: Number, default: 0 }, // Total number of reviews
    completedJobs: { type: Number, default: 0 }, // Total number of completed jobs
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const ServiceProvider = mongoose.model(
  "ServiceProvider",
  serviceProviderSchema
);
export default ServiceProvider;
