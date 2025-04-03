import mongoose from "mongoose";
import { updateServiceProviderRating } from "../middleWare/ReviewHelper";

const ReviewSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ServiceProvider",
    required: true,
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
},
{ timestamps: true }

);


// Auto Function to update rating after Adding / Removing a review
ReviewSchema.post("save", async function () {
  await updateServiceProviderRating(this.serviceProvider);
});

ReviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await updateServiceProviderRating(doc.serviceProvider);
  }
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review;