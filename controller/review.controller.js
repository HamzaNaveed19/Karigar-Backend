import ServiceProvider from "../model/Provider.model.js";
import Review from "../model/Reviews.model.js";
import Booking from "../model/Booking.model.js";

import { calculateAverageRating } from "../middleWare/ReviewHelper.js";

export const addReview = async (req, res) => {
  try {
    const { bookingId, customerId, serviceProviderId, rating, comment } = req.body;

    const newReview = new Review({
      booking: bookingId,
      customer: customerId,
      serviceProvider: serviceProviderId,
      rating,
      comment,
    });

    const savedReview = await newReview.save();

    await Booking.findOneAndUpdate(
      { _id: bookingId },
      { $push: { reviews: savedReview._id } }
    );

    await ServiceProvider.findByIdAndUpdate(serviceProviderId, {
      $push: { reviews: savedReview._id },
      $inc: { totalReviews: 1 },
    });

    await calculateAverageRating(serviceProviderId);

    res.status(201).json({ message: "Review added successfully", review: savedReview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
};



export const getAllReviewsByID = async (req, res) => {
  const { id } = req.params;

  try {
    const provider = await ServiceProvider.findById(id).populate("reviews");
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.status(200).json(provider.reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching reviews");
  }
};