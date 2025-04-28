import express from "express";
import { addBooking, getAllBookings, getBookingByCustomerId } from "../controller/booking.controller.js";

const router = express.Router();

router.post("/", addBooking);

router.get("/", getAllBookings);

router.get("/:id", getBookingByCustomerId);

export default router;