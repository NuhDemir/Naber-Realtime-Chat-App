import express from "express";
import {
  getMessages,
  sendMessage,
  getUsersForSidebar,
} from "../controller/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Kenar çubuğu için kullanıcıları getirir (parametreye gerek yok)
router.get("/users", protectRoute, getUsersForSidebar);

// Belirtilen ID'ye sahip kullanıcı ile olan mesajları getirir
// DOĞRU KULLANIM: router.get("/:id", ...)
// HATALI KULLANIMI DÜZELTİN: router.get("/:", ...) DEĞİL
router.get("/:id", protectRoute, getMessages);

// Belirtilen ID'ye sahip kullanıcıya mesaj gönderir
// DOĞRU KULLANIM: router.post("/send/:id", ...)
// HATALI KULLANIMI DÜZELTİN: router.post("/send/:", ...) DEĞİL
router.post("/send/:id", protectRoute, sendMessage);

export default router;