import Booking from "../model/Booking.model.js";
import { io, onlineUsers } from "../server.js";

import { sendSMS } from "../middleWare/BookingHelper.js"; 
import ServiceProvider from "../model/Provider.model.js";
import mongoose from "mongoose";
import { addCustomerNotification } from "./customer.controller.js";
// import { addProviderNotification } from "./provider.controller.js";


export const addBooking = async (req, res) => {
  try {
    const {
      bookingTitle,
      serviceProviderId,
      customerId,
      address,
      price,
      bookingDate,
      bookingTime,
    } = req.body;

    if (serviceProviderId == customerId) {
      return res
        .status(400)
        .json({ message: "Service provider and customer cannot be the same" });
      // return res.status(404).json({ message: "Service provider not found" });
    }

    const newBooking = new Booking({
      bookingTitle,
      serviceProvider: serviceProviderId,
      customer: customerId,
      address,
      price,
      bookingDate,
      bookingTime,
      status: "pending", // Default status
    });

    const savedBooking = await newBooking.save();

    await addCustomerNotification(
      serviceProviderId,
      `New booking '${bookingTitle}' has been made.`,
      "newBooking"
    );

    const providerId = serviceProviderId.toString();
    const socketId = onlineUsers.get(providerId);

    if (socketId) {
      io.to(socketId).emit("newBooking", savedBooking );
    }

    const populatedBooking = await Booking.findById(savedBooking._id)
      .select('-__v -updatedAt -customer -reviews')
      .populate("serviceProvider", "name profession personalImage rating -roleType");

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking,
    });

  } catch (error) {
    console.error("Error adding booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("customer", "name email phone") // populate specific fields
      .populate("serviceProvider", "name profession phone personalImage rating") // populate specific fields
      .populate("reviews", "rating comment createdAt"); // optional: populate reviews if you want full review details too

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};


export const getBookingByCustomerId = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    const filter = { customer: id };

    if (status) {
      filter.status = Array.isArray(status) ? { $in: status } : status;
    }

    const bookings = await Booking.find(filter)
      .sort({ bookingDate: -1 })
      .populate("serviceProvider", "name profession phone personalImage rating")
      .populate("reviews", "rating comment");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings"});
  }
};


export const getBookingByProviderId = async (req, res) => {
  try {
    const { id } = req.params;

    const bookings = await Booking.find({ serviceProvider: id })
      .populate("customer", "name phone") // populate specific fields
      .populate("reviews", "rating comment"); // optional: populate reviews if you want full review details too

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};


export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("customer", "_id name phone");

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const customerId = updatedBooking.customer._id.toString();
    const socketId = onlineUsers.get(customerId);


    // SMS notification
    const phone = updatedBooking.customer.phone;
    const message =
      status === "confirmed" ? `Dear ${updatedBooking.customer.name}, your booking '${updatedBooking.bookingTitle}' has been confirmed.`
      : status === "cancelled" ? `Dear ${updatedBooking.customer.name}, your booking '${updatedBooking.bookingTitle}' has been cancelled.`
      : status === "completed" ? `Dear ${updatedBooking.customer.name}, your booking '${updatedBooking.bookingTitle}' has been completed. Thank you for using KARIGAR!`
      : null;

    if (status === "completed") {
       await ServiceProvider.findByIdAndUpdate(
        updatedBooking.serviceProvider,
        { $inc: { completedJobs: 1 } }
      );

      await addCustomerNotification(
        updatedBooking.customer._id,
        `Your booking '${updatedBooking.bookingTitle}' has been completed. Thank you for choosing KARIGAR!`,
        "completed"
      );
    }

    if(status === "cancelled") {
      await addCustomerNotification(
        updatedBooking.customer._id,
        `Your booking '${updatedBooking.bookingTitle}' has been cancelled.`,
        "cancelled"
      );
    }

    if(status === "confirmed") {
      await addCustomerNotification(
        updatedBooking.customer._id,
        `Your booking '${updatedBooking.bookingTitle}' has been confirmed.`,
        "confirmed"
      );
    }


    // if (message) {
    //   try {
    //     await sendSMS({ num: phone, msg: message });
    //   } catch (smsError) {
    //     console.warn("SMS failed to send:", smsError.message);
    //   }
    // }


    // Real-time update
    if (socketId) {
      io.to(socketId).emit("bookingStatusUpdated", updatedBooking);
    }



    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
};


// export const getMonthlyCompletedBookings = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const completedBookings = await Booking.aggregate([
//       {
//         $match: {
//           serviceProvider: new mongoose.Types.ObjectId(id),
//           status: "completed",
//         },
//       },
//       {
//         $group: {
//           _id: {
//             year: { $year: "$bookingDate" },
//             month: { $month: "$bookingDate" },
//           },
//           totalCompleted: { $sum: 1 },
//         },
//       },
//       {
//         $sort: {
//           "_id.year": 1,
//           "_id.month": 1,
//         },
//       },
//     ]);

//     res.status(200).json(completedBookings);
//   } catch (error) {
//     console.error("Error fetching monthly completed bookings:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


export const getBookingStatusPercentage = async (req, res) => {
  try {
    const { id } = req.params;

    const bookings = await Booking.find({ serviceProvider: id });

    const total = bookings.length;
    if (total === 0) {
      return res.status(200).json({ Completed: 0, Cancelled: 0, Upcoming: 0 });
    }

    let completed = 0;
    let cancelled = 0;
    let upcoming = 0;

    bookings.forEach((booking) => {
      if (booking.status === "completed") completed++;
      else if (booking.status === "cancelled") cancelled++;
      else if (["pending", "confirmed"].includes(booking.status)) upcoming++;
    });

    const percentage = {
      Completed: ((completed / total) * 100),
      Cancelled: ((cancelled / total) * 100),
      Upcoming: ((upcoming / total) * 100),
    };

    res.status(200).json(percentage);
  } catch (error) {
    console.error("Error calculating status percentage:", error);
    res.status(500).json({ error: "Failed to calculate booking status percentages" });
  }
};



export const getMonthlyCompletedBookings = async (req, res) => {
  try {
    const { id } = req.params; // service provider ID

    const monthlyCompleted = await Booking.aggregate([
      {
        $match: {
          serviceProvider: new mongoose.Types.ObjectId(id),
          status: "completed",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$bookingDate" },
            month: { $month: "$bookingDate" },
          },
          totalCompleted: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          totalCompleted: 1,
        },
      },
    ]);

    res.status(200).json(monthlyCompleted);
  } catch (error) {
    console.error("Error in monthly completed bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
