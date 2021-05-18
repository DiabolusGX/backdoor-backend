import express from "express";

import { signup, login, logout, googleSignup, googleLogin, getUser, updateUser } from "../controllers/user";
import { isLoggedIn, loginMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", loginMiddleware, login);
router.post("/logout", logout);

router.post("/google/signup", googleSignup);
router.post("/google/login", googleLogin);
router.get("/validate", getUser);
router.patch("/update", updateUser);

export default router;