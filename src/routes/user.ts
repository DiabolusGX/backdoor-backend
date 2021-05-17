import express from "express";

import { googleSignup, googleLogin, getUser, updateUser } from "../controllers/user";

const router = express.Router();

router.post("/google/signup", googleSignup);
router.post("/google/login", googleLogin);
router.get("/validate", getUser);
router.patch("/update", updateUser);

export default router;