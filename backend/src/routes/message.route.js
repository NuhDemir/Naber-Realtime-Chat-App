import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controller/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, (req, res, next) => {
  console.log("👥 GET /users - Sidebar için kullanıcılar isteniyor:", req.user?.email || "Tanımsız");
  next();
}, getUsersForSidebar);

router.get("/:id", protectRoute, (req, res, next) => {
  console.log(`💬 GET /${req.params.id} - Mesajlar getiriliyor - Kullanıcı: ${req.user?.email || "Tanımsız"}`);
  next();
}, getMessages);

router.post("/send/:id", protectRoute, (req, res, next) => {
  console.log(`📨 POST /send/${req.params.id} - Mesaj gönderiliyor - Kullanıcı: ${req.user?.email || "Tanımsız"}`);
  next();
}, sendMessage);

export default router;
