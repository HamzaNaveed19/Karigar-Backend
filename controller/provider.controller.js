import ServiceProvider from "../model/Provider.model.js";
import User from "../model/User.model.js";

// export const addProvider = async (req, res) => {
//   try {
//     const providerDetails = await ServiceProvider.create(req.body);
//     res.status(200).json(providerDetails);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error adding record");
//   }
// };

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
    
    const providerDetails = await ServiceProvider.findById(id)
      .select('-verificationDocuments -password -roles -roleType -notifications -updatedAt -__v')
      .populate({
        path: 'reviews',
        select: 'rating comment customer',
        populate: {
          path: 'customer',
          select: 'name profileImage -roleType',
        }
      });

    if (!providerDetails) {
      return res.status(404).send("Provider not found");
    }

    res.status(200).json(providerDetails);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching record");
  }
};


// export const updateProviderById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const provider = await ServiceProvider.findByIdAndUpdate(id, req.body, { new: true });
//     if (!provider) {
//       return res.status(404).send("Provider not found");
//     }
//     res.status(200).json(provider);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating record");
//   }
// };


// export const updateProviderById = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Step 1: Check if the user exists
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Step 2: Find the ServiceProvider or hydrate a new one
//     let provider = await ServiceProvider.findById(id) || ServiceProvider.hydrate(user.toObject());

//     // Step 3: Update provider-specific fields only if provided in the request body
//     const {
//       verificationDocuments,
//       personalImage,
//       location,
//       profession,
//       about,
//       services,
//       skills,
//       experience,
//       languages,
//       education
//     } = req.body;

//     // Only update the fields that are present in the request body
//     if (verificationDocuments) provider.verificationDocuments = verificationDocuments;
//     if (personalImage) provider.personalImage = personalImage;
//     if (location) provider.location = location;
//     if (profession) provider.profession = profession;
//     if (about) provider.about = about;
//     if (services) provider.services = services;
//     if (skills) provider.skills = skills;
//     if (experience) provider.experience = experience;
//     if (languages) provider.languages = languages;
//     if (education) provider.education = education;

//     // Ensure 'ServiceProvider' role is added if not already present
//     // if (!provider.roles.includes("ServiceProvider")) {
//     //   provider.roles.push("ServiceProvider");
//     // }

//     // provider.roleType = "ServiceProvider";

//     // Step 4: Save the updated provider data
//     const updatedProvider = await provider.save();

//     res.status(200).json({
//       message: "Provider profile updated successfully",
//       provider: updatedProvider,
//     });
//   } catch (err) {
//     console.error("Error updating provider:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

export const updateProviderById = async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Find ServiceProvider instance or hydrate from base User
    let provider = await ServiceProvider.findById(id);
    if (!provider) {
      provider = ServiceProvider.hydrate(user.toObject());
    }

    // Step 3: Destructure request body
    const {
      verificationDocuments,
      personalImage,
      location,
      profession,
      about,
      services,
      skills,
      experience,
      languages,
      education,
      workingHours,
    } = req.body;

    // Step 4: Conditionally update fields
    if (verificationDocuments) provider.verificationDocuments = verificationDocuments;
    if (personalImage) provider.personalImage = personalImage;
    if (location) provider.location = location;
    if (profession) provider.profession = profession;
    if (about) provider.about = about;
    if (services) provider.services = services;
    if (skills) provider.skills = skills;
    if (experience) provider.experience = experience;
    if (languages) provider.languages = languages;
    if (education) provider.education = education;
    if (workingHours) provider.workingHours = workingHours;

    // Step 5: Save updated provider (this triggers skillCount update via pre("save") middleware)
    const updatedProvider = await provider.save();

    res.status(200).json({
      message: "Provider profile updated successfully",
      provider: updatedProvider,
    });
  } catch (err) {
    console.error("Error updating provider:", err);
    res.status(500).json({ error: err.message });
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

export const addProviderDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let provider = await ServiceProvider.findById(id) || ServiceProvider.hydrate(user.toObject());

    // Extract provider-specific fields from body
    const {
      verificationDocuments,
      personalImage,
      location,
      profession,
      about,
      workingHours,
      services,
      skills,
      experience,
      languages,
      education,
    } = req.body;

    // Assign provider-specific fields
    provider.verificationDocuments = verificationDocuments;
    provider.personalImage = personalImage;
    provider.location = location;
    provider.profession = profession;
    provider.about = about;
    provider.workingHours = workingHours;
    provider.services = services;
    provider.skills = skills;
    provider.experience = experience;
    provider.languages = languages;
    provider.education = education;

    // Add "ServiceProvider" role if not already present
    if (!provider.roles.includes("ServiceProvider")) {
      provider.roles.push("ServiceProvider");
    }

    provider.roleType = "ServiceProvider";

    const savedProvider = await provider.save();

    res.status(200).json({
      message: "Provider profile updated",
      provider: savedProvider,
    });
  } catch (err) {
    console.error("Error updating provider:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getAllReviewsByID = async (req, res) => {
  const { id } = req.params;

  try {
    const provider = await ServiceProvider.findById(id).populate("reviews", "rating comment");
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }
    res.status(200).json(provider.reviews);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching reviews");
  }
};



export const addMoreServices = async (req, res) => {
  try {
    const { id } = req.params;
    const { services } = req.body;

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "Services must be a non-empty array" });
    }

    // Validate each service object
    const isValid = services.every(service =>
      service.name && service.price && service.duration
    );

    if (!isValid) {
      return res.status(400).json({ error: "Each service must have name, price, and duration" });
    }

    const updatedProvider = await ServiceProvider.findByIdAndUpdate(
      id,
      { $push: { services: { $each: services } } },
      { new: true }
    );

    if (!updatedProvider) {
      return res.status(404).json({ error: "Service provider not found" });
    }

    res.status(200).json({
      message: "Services added successfully",
      services: updatedProvider.services,
    });
  } catch (error) {
    console.error("Error adding services:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const { serviceName } = req.body;

    if (!serviceName) {
      return res.status(400).json({ error: "Service name is required" });
    }

    const updatedProvider = await ServiceProvider.findByIdAndUpdate(
      id,
      { $pull: { services: { name: serviceName } } },
      { new: true }
    );

    if (!updatedProvider) {
      return res.status(404).json({ error: "Service provider not found" });
    }

    res.status(200).json({
      message: `Service "${serviceName}" deleted successfully`,
      services: updatedProvider.services,
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




export const getProviderNotifications = async (req, res) => {
  const { id } = req.params;

  try {
    const provider = await ServiceProvider.findById(id).select('notifications');

    if (!provider) {
      return res.status(404).json({ error: 'Provider not found' });
    }

    res.status(200).json({ notifications: provider.notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};


export const addProviderNotification = async (providerId, description, type) => {
  await ServiceProvider.findByIdAndUpdate(
    providerId,
    {
      $push: 
      {
        notifications: 
        {
          description,
          type
        }
      }
    });
};