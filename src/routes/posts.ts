import express from "express";

import { getPost, createPost, updatePost, deletePost, searchPost, likePost } from "../controllers/posts";

const router = express.Router();

router.get("/", getPost);
router.get("/search", searchPost);
router.post("/create", createPost);
router.patch("/like", likePost);
router.patch("/update", updatePost);
router.delete("/delete", deletePost);

export default router;