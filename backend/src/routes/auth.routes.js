import express from "express";
import  { login, logout, signup,updateProfile,checkAuth,updateUserDetails } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",signup)

router.post("/login",login)


router.post("/logout",logout)

router.put("/update-profile",protectRoute,updateProfile)

router.put("/update-user-details", protectRoute, updateUserDetails);

router.get("/check",protectRoute,checkAuth)
export default router;
