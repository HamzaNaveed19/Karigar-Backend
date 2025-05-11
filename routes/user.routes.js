import express from "express";
import { registerUser, loginUser, getAllUsers, getUserById, updatePassword, verifyOTP } from "../controller/user.controller.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/register/verify", verifyOTP);

router.post("/login", loginUser);

router.get("/", getAllUsers);

router.get("/:id", getUserById);

router.put("/:id", updatePassword);


export default router;
