import express from "express";
import { addReview, addCustomer, getAllCustomers } from "../controller/customer.controller.js";

const router = express.Router();

router.post("/", addCustomer);

router.get("/", getAllCustomers);

router.post("/addReview", addReview);

export default router;
