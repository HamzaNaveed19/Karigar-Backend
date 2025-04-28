import Booking from "../model/Booking.model.js"; 


export const addBooking = async (req, res) => {
  try {
    const { bookingTitle, serviceProviderId, customerId, address, price } = req.body;

    const newBooking = new Booking({
      bookingTitle,
      serviceProvider : serviceProviderId,
      customer : customerId,
      address,
      price,
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