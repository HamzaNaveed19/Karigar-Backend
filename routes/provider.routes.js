import express from "express";
import {
  getAllProviders,
  getProviderById,
  updateProviderById,
  deleteProviderById,
  addProviderDetails,
  getAllReviewsByID
} from "../controller/provider.controller.js";
import {  } from "../controller/review.controller.js";

const router = express.Router();

router.get("/:id/getReviews", getAllReviewsByID);

router.post("/:id", addProviderDetails);

router.get("/", getAllProviders);

router.get("/:id", getProviderById);

router.put("/:id", updateProviderById);

router.delete("/:id", deleteProviderById);

// router.put("/", addServiceToProvider);

export default router;
