import express from "express";

import { signup, login, logout, googleSignup, googleLogin, getUser, updateUser } from "../controllers/user";
import { isLoggedIn, loginMiddleware } from "../middleware/auth";

const router = express.Router();

// auth paths
router.post("/signup", signup);
router.post("/login", loginMiddleware, login);
router.post("/logout", isLoggedIn, logout);

// user paths
router.get("/:id", getUser);
router.patch("/update", isLoggedIn, updateUser);

// google oauth paths
router.post("/google/signup", googleSignup);
router.post("/google/login", googleLogin);

export default router;