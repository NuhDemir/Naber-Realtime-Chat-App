import express from "express";
import { login, logout, signup, updateProfile, checkAuth, updateUserDetails } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import logger from "../log/logger.js";

const router = express.Router();

router.post("/signup", (req, res, next) => {
  logger.info("📩 POST /signup çağrıldı");
  next();
}, signup);

router.post("/login", (req, res, next) => {
  logger.info("📩 POST /login çağrıldı");
  next();
}, login);

router.post("/logout", (req, res, next) => {
  logger.info("📩 POST /logout çağrıldı");
  next();
}, logout);

router.put("/update-profile", protectRoute, (req, res, next) => {
  logger.info(`🛠️ PUT /update-profile - Kullanıcı: ${req.user?.email || "Tanımsız"}`);
  next();
}, updateProfile);

router.put("/update-user-details", protectRoute, (req, res, next) => {
  logger.info(`🛠️ PUT /update-user-details - Kullanıcı: ${req.user?.email || "Tanımsız"}`);
  next();
}, updateUserDetails);

router.get("/check", protectRoute, (req, res, next) => {
  logger.info(`🔍 GET /check - Kullanıcı doğrulanıyor: ${req.user?.email || "Tanımsız"}`);
  next();
}, checkAuth);

export default router;
