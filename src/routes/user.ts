import express from "express";

import { signup, login, logout, googleSignup, googleLogin, getUser, updateUser } from "../controllers/user";
import { isLoggedIn, loginMiddleware } from "../middleware/auth";

const router = express.Router();

// auth paths
router.post("/signup", signup);
router.post("/login", loginMiddleware, login);
router.post("/logout", isLoggedIn, logout);

// google oauth paths
router.post("/google/signup", googleSignup);
router.post("/google/login", googleLogin);

// user paths
router.patch("/update", isLoggedIn, updateUser);
router.get("/:username", isLoggedIn, getUser);

export default router;