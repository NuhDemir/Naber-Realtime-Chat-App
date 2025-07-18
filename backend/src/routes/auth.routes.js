import express from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
  updateUserDetails,
} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route bazlı log eklendi
router.post("/signup", (req, res, next) => {
  console.log("📩 POST /signup çağrıldı");
  next();
}, signup);

router.post("/login", (req, res, next) => {
  console.log("📩 POST /login çağrıldı");
  next();
}, login);

router.post("/logout", (req, res, next) => {
  console.log("📩 POST /logout çağrıldı");
  next();
}, logout);

router.put("/update-profile", protectRoute, (req, res, next) => {
  console.log("🛠️ PUT /update-profile - Kullanıcı:", req.user?.email || "Tanımsız");
  next();
}, updateProfile);

router.put("/update-user-details", protectRoute, (req, res, next) => {
  console.log("🛠️ PUT /update-user-details - Kullanıcı:", req.user?.email || "Tanımsız");
  next();
}, updateUserDetails);

router.get("/check", protectRoute, (req, res, next) => {
  console.log("🔍 GET /check - Kullanıcı doğrulanıyor:", req.user?.email || "Tanımsız");
  next();
}, checkAuth);

export default router;
