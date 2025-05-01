import express from "express";
import { addCategory, getAllCategories } from "../controller/category.controller.js";

const router = express.Router();

router.post("/", addCategory);

router.get("/", getAllCategories);

export default router;