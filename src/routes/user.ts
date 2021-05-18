import express from "express";

import { signup, login, googleSignup, googleLogin, getUser, updateUser } from "../controllers/user";
import { isLoggedIn } from "../middleware/auth";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google/signup", googleSignup);
router.post("/google/login", googleLogin);
router.get("/validate", getUser);
router.patch("/update", updateUser);

export default router;