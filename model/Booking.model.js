import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    bookingTitle: { type: String, required: true },
    serviceProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    address: { type: String, required: true },
    price: { type: String, required: true },
    bookingDate: { type: Date, required: true },
    bookingTime: { type: String, required: true },

    status: {
        type: String,
        enum: ["pending", "confirmed", "completed", "cancelled"],
        default: "pending",
    },

    reviews: { type: mongoose.Schema.Types.ObjectId, ref: "Review" }, // Customer's reviews
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;