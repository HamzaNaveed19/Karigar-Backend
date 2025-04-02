import express from "express";
import { addReview } from "../controller/customer.controller.js";

const router = express.Router();

router.post("/addReview", addReview);

export default router;
