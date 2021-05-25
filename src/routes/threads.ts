import express from "express";

import { getAllThreads, getThread, createThread, updateThread } from "../controllers/threads";
import { isLoggedIn } from "../middleware/auth";

const router = express.Router();

router.get("/", getAllThreads);
router.post("/create", isLoggedIn, createThread);
router.patch("/update", isLoggedIn, updateThread);

router.get("/:title", getThread);

export default router;