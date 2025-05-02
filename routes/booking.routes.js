import express from "express";
import { addBooking, getAllBookings, getBookingByCustomerId, getBookingByProviderId , updateBookingStatus, getMonthlyCompletedBookings, getBookingStatusPercentage} from "../controller/booking.controller.js";

const router = express.Router();


router.post("/", addBooking);

router.get("/", getAllBookings);

router.get("/:id/customer", getBookingByCustomerId);

router.get("/:id/provider", getBookingByProviderId);

router.put("/updateStatus/:id", updateBookingStatus);

router.get("/monthlyReport/:id", getMonthlyCompletedBookings);

router.get("/bookingStatus/:id", getBookingStatusPercentage);


export default router;