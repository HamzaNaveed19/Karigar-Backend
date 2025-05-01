import express from "express";
import { addBooking, getAllBookings, getBookingByCustomerId, getBookingByProviderId } from "../controller/booking.controller.js";

const router = express.Router();

router.post("/", addBooking);

router.get("/", getAllBookings);

router.get("/:id/customer", getBookingByCustomerId);

router.get("/:id/provider", getBookingByProviderId);

export default router;