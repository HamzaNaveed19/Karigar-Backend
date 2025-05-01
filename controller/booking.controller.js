import Booking from "../model/Booking.model.js";
import { io, onlineUsers } from "../server.js"; // adjust path if needed

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

    res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking,
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
      .populate("reviews", "rating comment"); // optional: populate reviews if you want full review details too

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

export const getBookingByCustomerId = async (req, res) => {
  try {
    const { id } = req.params;

    const bookings = await Booking.find({ customer: id })
      .populate("serviceProvider", "name profession phone personalImage rating") // populate specific fields
      .populate("reviews", "rating comment"); // optional: populate reviews if you want full review details too

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
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

    console.log("Booking ID received:", id);

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("customer", "_id name");

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const customerId = updatedBooking.customer._id.toString();
    const socketId = onlineUsers.get(customerId);

    if (socketId) {
      io.to(socketId).emit("bookingStatusUpdated", updatedBooking);
    }

    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
};
