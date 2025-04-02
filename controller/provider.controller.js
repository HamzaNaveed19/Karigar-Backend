import ServiceProvider from "../model/Provider.model.js";

export const addProvider = async (req, res) => {
  try {
    const providerDetails = await ServiceProvider.create(req.body);
    res.status(200).json(providerDetails);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
};

export const getAllProviders = async (req, res) => {
  try {
    const providerDetails = await ServiceProvider.find({});
    res.status(200).json(providerDetails);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching records");
  }
};

export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const providerDetails = await ServiceProvider.findById(id);
    if (!providerDetails) {
      return res.status(404).send("Provider not found");
    }
    res.status(200).json(providerDetails);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching record");
  }
};

export const updateProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await ServiceProvider.findByIdAndUpdate(id, req.body, { new: true });
    if (!provider) {
      return res.status(404).send("Provider not found");
    }
    res.status(200).json(provider);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating record");
  }
};

export const deleteProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await ServiceProvider.findByIdAndDelete(id);
    if (!provider) {
      return res.status(404).send("Provider not found");
    }
    res.status(200).send("Provider deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
};


export const addReview = async (req, res) => {
  try {
    // customer, 
    const { serviceProvider, rating, comment } = req.body;

    // customer,
    // Create a new review document
    const newReview = new Review({  serviceProvider, rating, comment });
    await newReview.save();

    // Add the review ID to the service provider's reviews array
    await ServiceProvider.findByIdAndUpdate(serviceProvider, {
      $push: { reviews: newReview._id },
    });

    res.status(201).json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}