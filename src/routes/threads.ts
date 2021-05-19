import express from "express";

import { getAllThreads, getThread, createThread } from "../controllers/threads";
import { isLoggedIn } from "../middleware/auth";

const router = express.Router();

router.get("/", getAllThreads);
router.post("/create", isLoggedIn, createThread);

router.get("/:id", getThread);

export default router;