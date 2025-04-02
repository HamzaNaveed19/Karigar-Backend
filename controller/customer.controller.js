// import Customer from "../model/Customer.model.js";
import ServiceProvider from "../model/Provider.model.js";

export const addReview = async (req, res) => {
  try {
    const { customer, serviceProvider, rating, comment } = req.body;

    // Create a new review document
    const newReview = new Review({
      customer,
      serviceProvider,
      rating,
      comment,
    });
    await newReview.save();

    // Add the review ID to the service provider's reviews array
    await ServiceProvider.findByIdAndUpdate(serviceProvider, {
      $push: { reviews: newReview._id },
    });

    res
      .status(201)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
