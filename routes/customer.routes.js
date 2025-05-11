import express from "express";
import {
  deleteCustomerById,
  getCustomerByID,
  getFilteredProvidersBasedOnCustomerLocation,
  addCustomerDetails,
  getCustomerNotifications,
  updateCustomerById,
  markAllNotificationsAsRead,
} from "../controller/customer.controller.js";
import { addReview } from "../controller/review.controller.js";
import { authenticateToken } from "../middleWare/Authentication.js";

const router = express.Router();

router.get("/:id", authenticateToken, getCustomerByID);

router.get("/providers/:id", getFilteredProvidersBasedOnCustomerLocation);

router.get("/notifications/:id", authenticateToken, getCustomerNotifications);

router.post("/addReview", authenticateToken, addReview);

router.post("/:id", authenticateToken, addCustomerDetails);

router.put("/:id", authenticateToken, updateCustomerById);

router.delete("/:id", deleteCustomerById);

router.put("/updateNotification/:id", markAllNotificationsAsRead);


export default router;
