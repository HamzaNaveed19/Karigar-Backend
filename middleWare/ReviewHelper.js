
import Review from "../model/Reviews.model.js";
import ServiceProvider from "..model/Provider.model.js";


const updateServiceProviderRating = async (serviceProviderId) => {
  try {
    const reviews = await Review.find({ serviceProvider: serviceProviderId });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews : 0;

    await ServiceProvider.findByIdAndUpdate(serviceProviderId, {
      totalReviews,
      rating: averageRating.toFixed(1),
    });
  } catch (error) {
    console.error("Error updating service provider rating:", error);
  }
};

export { updateServiceProviderRating };