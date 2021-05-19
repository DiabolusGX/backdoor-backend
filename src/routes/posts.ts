import express from "express";

import { getPost, createPost, updatePost, deletePost, searchPost, likePost } from "../controllers/posts";
import { isLoggedIn } from "../middleware/auth";

const router = express.Router();

router.get("/", getPost);
router.get("/search", searchPost);
router.post("/create", isLoggedIn, createPost);
router.patch("/like", isLoggedIn, likePost);
router.patch("/update", isLoggedIn, updatePost);
router.delete("/delete", isLoggedIn, deletePost);

export default router;