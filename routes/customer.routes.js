import express from "express";
import { deleteCustomerById, getAllCustomers, getFilteredProvidersBasedOnCustomerLocation, addCustomerDetails, getCustomerNotifications } from "../controller/customer.controller.js";
import { addReview } from "../controller/review.controller.js";
import { authenticateToken } from "../middleWare/Authentication.js";

const router = express.Router();

router.post("/addReview", addReview);

router.post("/:id", addCustomerDetails);

router.get("/", authenticateToken ,getAllCustomers);

router.delete("/:id", deleteCustomerById);

router.get("/:id", getFilteredProvidersBasedOnCustomerLocation);

router.get("/notifications/:id", getCustomerNotifications);

export default router;