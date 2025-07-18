import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controller/message.controller.js";

const router = express.Router();

// Sabit yollar önce tanımlanmalı
router.get("/users", protectRoute, getUsersForSidebar);

// Dinamik ID içeren yollar en sona
router.post("/send/:id", protectRoute, sendMessage);
router.get("/:id", protectRoute, getMessages); // Bu sonda olmalı!

export default router;
