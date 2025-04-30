import express from "express";
import { addCustomer, deleteCustomerById, getAllCustomers, getFilteredProvidersBasedOnCustomerLocation } from "../controller/customer.controller.js";
import { addReview } from "../controller/review.controller.js";

const router = express.Router();

router.post("/", addCustomer);

router.get("/", getAllCustomers);

router.delete("/:id", deleteCustomerById);

router.post("/addReview", addReview);

router.get("/:id", getFilteredProvidersBasedOnCustomerLocation);

export default router;