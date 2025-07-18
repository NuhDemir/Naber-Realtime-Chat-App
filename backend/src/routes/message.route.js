import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controller/message.controller.js";

const router = express.Router();

// Sabit yollar önce
router.get("/users", protectRoute, getUsersForSidebar);
router.post("/send/:id", protectRoute, sendMessage);

// En son dinamik id
router.get("/:id", protectRoute, getMessages);

export default router;
