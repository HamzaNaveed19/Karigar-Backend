import ServiceProvider from "../model/Provider.model.js";
import Customer from "../model/Customer.model.js";
import bcrypt from 'bcrypt';



export const addCustomer = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const customerDetails = await Customer.create({
      ...req.body,
      password: hashedPassword
    });
    res.status(200).json(customerDetails);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customerDetails = await Customer.find({});
    res.status(200).json(customerDetails);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching records");
  }
};


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


