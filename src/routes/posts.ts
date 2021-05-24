import express from "express";

import { getAllPosts, getPost, createPost, updatePost, deletePost, searchPost, react } from "../controllers/posts";
import { isLoggedIn } from "../middleware/auth";

const router = express.Router();

router.get("/", getAllPosts);
router.get("/search", searchPost);
router.post("/create", isLoggedIn, createPost);
router.patch("/react", isLoggedIn, react);
router.patch("/update", isLoggedIn, updatePost);
router.delete("/delete", isLoggedIn, deletePost);

router.get("/:id", getPost);

export default router;