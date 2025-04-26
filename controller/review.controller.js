import ServiceProvider from "../model/Provider.model.js";
import Customer from "../model/Customer.model.js";
import Review from "../model/Reviews.model.js";

import { calculateAverageRating } from "../middleWare/ReviewHelper.js";


export const addReview = async (req, res) => {
    try {
      const { customerId, serviceProviderId, rating, comment } = req.body;
  
      // Create the review
      const newReview = new Review({
        customer: customerId,
        serviceProvider: serviceProviderId,
        rating,
        comment,
      });
  
      const savedReview = await newReview.save();
  
      // Push the review ID into Customer's reviews array
      await Customer.findByIdAndUpdate(customerId, {
        $push: { reviews: savedReview._id },
      });
  
      // Push the review ID into ServiceProvider's reviews array
      await ServiceProvider.findByIdAndUpdate(serviceProviderId, {
        $push: { reviews: savedReview._id },
        $inc: { totalReviews: 1 }, // Update total reviews count
      });

      await calculateAverageRating(serviceProviderId);
  
      res.status(201).json({ message: "Review added successfully", review: savedReview });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong", error });
    }
  };