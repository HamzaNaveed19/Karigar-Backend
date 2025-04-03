import ServiceProvider from "../model/Provider.model.js";

export const addReview = async (req, res) => {
  try {
    const { customer, serviceProvider, rating, comment } = req.body;

    const newReview = new Review({
      customer,
      serviceProvider,
      rating,
      comment,
    });
    await newReview.save();

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
