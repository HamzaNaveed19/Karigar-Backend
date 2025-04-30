import Customer from "../model/Customer.model.js";
import ServiceProvider from "../model/Provider.model.js";
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

export const deleteCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res.status(404).send("Customer not found");
    }
    res.status(200).send("Customer deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
};


export const getFilteredProvidersBasedOnCustomerLocation = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customerAddress = customer.location?.address;

    if (!customerAddress) {
      return res.status(400).json({ message: "Customer location is missing" });
    }

    const providers = await ServiceProvider.find({
      "location.address": { $regex: new RegExp(customerAddress, "i") }
    });

    res.status(200).json(providers);

  } catch (error) {
    console.error("Error fetching filtered providers:", error);
    res.status(500).json({ message: "Server error" });
  }
}