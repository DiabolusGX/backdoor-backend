"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var threads_1 = require("../controllers/threads");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
router.get("/", threads_1.getAllThreads);
router.post("/create", auth_1.isLoggedIn, threads_1.createThread);
router.patch("/update", auth_1.isLoggedIn, threads_1.updateThread);
router.get("/:title", threads_1.getThread);
exports.default = router;
