import Review from "../model/Reviews.model.js";
import ServiceProvider from "../model/Provider.model.js";



export const calculateAverageRating = async (serviceProviderId) => {
  try {
    const reviews = await Review.find({ serviceProvider: serviceProviderId });

    if (reviews.length === 0) {
      console.log("No reviews found for this service provider.");
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await ServiceProvider.findByIdAndUpdate(serviceProviderId, {
      rating: averageRating,
      totalReviews: reviews.length,
    });

    console.log(`✅ Average rating updated to ${averageRating.toFixed(2)} for service provider ${serviceProviderId}`);
  } catch (error) {
    console.error("❌ Error calculating average rating:", error);
  }
};