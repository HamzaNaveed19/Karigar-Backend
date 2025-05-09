import express from "express";
import {
  getAllProviders,
  getProviderById,
  updateProviderById,
  deleteProviderById,
  addProviderDetails,
  addMoreServices,
  deleteService,
  getProviderNotifications
} from "../controller/provider.controller.js";
import { authenticateToken } from "../middleWare/Authentication.js";
import { getAllReviewsByID } from "../controller/review.controller.js";

const router = express.Router();



router.post("/:id", addProviderDetails);

router.get("/", getAllProviders);

router.get("/:id",  getProviderById);

router.put("/:id", updateProviderById);

router.delete("/:id", deleteProviderById);

router.post("/addServices/:id", addMoreServices);

router.delete("/deleteService/:id", deleteService);

router.get("/notifications/:id", getProviderNotifications);

router.get("/reviews/:id", authenticateToken,  getAllReviewsByID);

export default router;
