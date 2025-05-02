import Customer from "../model/Customer.model.js";
import ServiceProvider from "../model/Provider.model.js";
import User from "../model/User.model.js";

// export const addCustomer = async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const customerDetails = await Customer.create({
//       ...req.body,
//       password: hashedPassword
//     });
//     res.status(200).json(customerDetails);
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

// export const getAllCustomers = async (req, res) => {
//   try {
//     const customerDetails = await Customer.find({});
//     res.status(200).json(customerDetails);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching records");
//   }
// };

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
      "location.address": { $regex: new RegExp(customerAddress, "i") },
    });

    res.status(200).json(providers);
  } catch (error) {
    console.error("Error fetching filtered providers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ roleType: "Customer" });
    res.status(200).json(customers);
  } catch (err) {
    console.error("Error fetching customers:", err);
    res.status(500).json({ error: "Server error" });
  }
};



export const addCustomerDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const customer = await Customer.findById(id) || Customer.hydrate(user.toObject());

    const { latitude, longitude, address, profileImage } = req.body;
    customer.location = { latitude, longitude, address };
    customer.profileImage = profileImage;

    if (!customer.roles.includes("Customer")) {
      customer.roles.push("Customer");
    }


    const savedCustomer = await customer.save();

    res.status(200).json({
      message: "Customer profile updated",
      customer: savedCustomer,
    });
  } catch (err) {
    console.error("Error updating customer:", err);
    res.status(500).json({ error: err.message });
  }
};



export const getCustomerNotifications = async (req, res) => {
  const { id } = req.params;

  try {
    const customer = await Customer.findById(id).select('notifications');

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.status(200).json({ notifications: customer.notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};



export const addCustomerNotification = async (customerId, description) => {
  await Customer.findByIdAndUpdate(customerId, {
    $push: {
      notifications: {
        description
      }
    }
  });
};
