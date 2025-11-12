import express from "express";
console.log("[mod] auth.routes.js loaded");
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

// Keep-alive endpoint for preventing Render from sleeping
router.get("/ping", (req, res) => {
  res
    .status(200)
    .json({ status: "alive", timestamp: new Date().toISOString() });
});

router.get("/check", protectRoute, checkAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.put("/update-user-details", protectRoute, updateUserDetails);

export default router;
