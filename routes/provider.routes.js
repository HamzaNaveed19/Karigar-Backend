import express from "express";
import {
  addProvider,
  getAllProviders,
  getProviderById,
  updateProviderById,
  deleteProviderById,
} from "../controller/provider.controller.js";

const router = express.Router();

router.post("/", addProvider);

router.get("/", getAllProviders);

router.get("/:id", getProviderById);

router.put("/:id", updateProviderById);

router.delete("/:id", deleteProviderById);

// router.put("/", addServiceToProvider);

export default router;
