"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_1 = require("../controllers/user");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
// auth paths
router.post("/signup", user_1.signup);
router.post("/login", auth_1.loginMiddleware, user_1.login);
router.post("/logout", auth_1.isLoggedIn, user_1.logout);
router.post("/check", user_1.checkAuthenticated);
// google oauth paths
router.post("/google/signup", user_1.googleSignup);
router.post("/google/login", user_1.googleLogin);
// user paths
router.patch("/update", auth_1.isLoggedIn, user_1.updateUser);
router.get("/username", user_1.getUsername);
router.get("/:username", user_1.getUser);
exports.default = router;
