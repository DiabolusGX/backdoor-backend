"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var comments_1 = require("../controllers/comments");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
router.get("/search", comments_1.searchComment);
router.post("/create", auth_1.isLoggedIn, comments_1.createComment);
router.patch("/update", auth_1.isLoggedIn, comments_1.updateComment);
router.patch("/react", auth_1.isLoggedIn, comments_1.commentReaction);
router.delete("/delete", auth_1.isLoggedIn, comments_1.deleteComment);
router.get("/:id", comments_1.getComment);
exports.default = router;
