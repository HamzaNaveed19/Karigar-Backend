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