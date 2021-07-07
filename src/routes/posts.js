"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var posts_1 = require("../controllers/posts");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
router.get("/", posts_1.getAllPosts);
router.get("/search", posts_1.searchPost);
router.post("/create", auth_1.isLoggedIn, posts_1.createPost);
router.patch("/react", auth_1.isLoggedIn, posts_1.postReaction);
router.patch("/update", auth_1.isLoggedIn, posts_1.updatePost);
router.delete("/delete", auth_1.isLoggedIn, posts_1.deletePost);
router.get("/:id", posts_1.getPost);
exports.default = router;
