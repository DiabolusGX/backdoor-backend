import express from "express";

import { getComment, createComment, updateComment, commentReaction, deleteComment } from "../controllers/comments";
import { isLoggedIn } from "../middleware/auth";

const router = express.Router();

router.post("/create", isLoggedIn, createComment);
router.patch("/update", isLoggedIn, updateComment);
router.patch("/react", isLoggedIn, commentReaction);
router.delete("/delete", isLoggedIn, deleteComment);

router.get("/:id", getComment);

export default router;