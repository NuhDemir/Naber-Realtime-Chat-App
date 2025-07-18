import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controller/message.controller.js";
import logger from "../log/logger.js";

const router = express.Router();

// Sabit yollar önce tanımlanmalı
router.get("/users", protectRoute, (req, res, next) => {
  logger.info(`📥 GET /users - Kullanıcı: ${req.user?.email || "Tanımsız"}`);
  next();
}, getUsersForSidebar);

// Dinamik ID içeren yollar en sona
router.post("/send/:id", protectRoute, (req, res, next) => {
  logger.info(`✉️ POST /send/${req.params.id} - Kullanıcı: ${req.user?.email || "Tanımsız"}`);
  next();
}, sendMessage);

router.get("/:id", protectRoute, (req, res, next) => {
  logger.info(`📨 GET /${req.params.id} - Kullanıcı: ${req.user?.email || "Tanımsız"}`);
  next();
}, getMessages);

export default router;
