import express from "express";
import { deleteCustomerById, getAllCustomers, getFilteredProvidersBasedOnCustomerLocation, addCustomerDetails } from "../controller/customer.controller.js";
import { addReview } from "../controller/review.controller.js";

const router = express.Router();

router.post("/addReview", addReview);

router.post("/:id", addCustomerDetails);

router.get("/", getAllCustomers);

router.delete("/:id", deleteCustomerById);

router.get("/:id", getFilteredProvidersBasedOnCustomerLocation);

export default router;