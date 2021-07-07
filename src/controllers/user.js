"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUsername = exports.getUser = exports.googleLogin = exports.googleSignup = exports.checkAuthenticated = exports.logout = exports.login = exports.signup = void 0;
var User_1 = __importDefault(require("../database/models/User"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var auth_1 = require("../middleware/auth");
var mongoose_1 = require("mongoose");
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, username, password, hash, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, username = _a.username, password = _a.password;
                hash = bcryptjs_1.default.hashSync(password, 14);
                return [4 /*yield*/, auth_1.userExists(username, email)];
            case 1:
                if (_b.sent()) {
                    return [2 /*return*/, res.status(409).json({ message: "Username or email already taken" })];
                }
                user = {
                    email: email,
                    username: username,
                    password: hash
                };
                return [4 /*yield*/, new User_1.default(user)
                        .save()
                        .then(function (newUser) { return res.status(201).json({ message: "Registration Successful" }); })
                        .catch(function (err) { return res.status(409).json({ message: err.message }); })];
            case 2:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (req.isAuthenticated()) {
            res.status(200).json({
                message: "Login Successful",
                id: req.user._id,
                username: req.user.username,
                permissionLevel: req.user.permissionLevel
            });
        }
        return [2 /*return*/];
    });
}); };
exports.login = login;
var logout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        req.logOut();
        res.status(200).json({ message: "Logout Successful" });
        return [2 /*return*/];
    });
}); };
exports.logout = logout;
var checkAuthenticated = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (req.isAuthenticated()) {
            res.status(200).json({
                message: "User is authenticated",
                id: req.user._id,
                username: req.user.username,
                permissionLevel: req.user.permissionLevel
            });
        }
        else {
            res.status(401).json({
                message: "User is not authenticated",
            });
        }
        return [2 /*return*/];
    });
}); };
exports.checkAuthenticated = checkAuthenticated;
// create new user and return user data
var googleSignup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, bio, profile, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, bio = _a.bio, profile = _a.profile;
                user = {
                    email: profile.email,
                    verified: profile.email_verified,
                    username: username,
                    bio: bio,
                    picture: profile.picture
                };
                return [4 /*yield*/, new User_1.default(user)
                        .save()
                        .then(function (newUser) { return res.status(201).json(newUser); })
                        .catch(function (err) { return res.status(409).json({ message: err.message }); })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.googleSignup = googleSignup;
// login user with given email id and return user data
var googleLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                return [4 /*yield*/, User_1.default
                        .findOne({ email: email })
                        .then(function (user) { return res.status(200).json(user); })
                        .catch(function (err) { return res.status(409).json({ message: err.message }); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.googleLogin = googleLogin;
// get user data with username
var getUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, userId;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                username = req.params.username;
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                return [4 /*yield*/, User_1.default
                        .findOne({ username: username })
                        .then(function (user) {
                        if ((userId === null || userId === void 0 ? void 0 : userId.toString()) === (user === null || user === void 0 ? void 0 : user._id.toString())) {
                            // @ts-expect-error
                            var _a = user._doc, password = _a.password, sendData = __rest(_a, ["password"]);
                            return res.status(200).json(sendData);
                        }
                        else {
                            // @ts-expect-error
                            var _b = user._doc, password = _b.password, email_verified = _b.email_verified, email = _b.email, sendData = __rest(_b, ["password", "email_verified", "email"]);
                            return res.status(200).json(sendData);
                        }
                    })
                        .catch(function (err) {
                        console.error(err);
                        res.status(404).json({ message: err.message });
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.getUser = getUser;
// get username with user id
var getUsername = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = req.query.userId;
                if (!mongoose_1.Types.ObjectId.isValid(userId))
                    return [2 /*return*/, res.status(404).json({ message: "No user found with id : " + userId })];
                return [4 /*yield*/, User_1.default
                        .findOne({ _id: userId })
                        .then(function (user) { return res.status(200).json({ username: user === null || user === void 0 ? void 0 : user.username }); })
                        .catch(function (err) {
                        console.log(err);
                        res.status(404).json({ message: "Something went wrong." });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.getUsername = getUsername;
// update user data using user document id and return new user data
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newUserData, id;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                newUserData = req.body.newUserData;
                id = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
                return [4 /*yield*/, User_1.default.findById(id)
                        .then(function (user) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (id != (user === null || user === void 0 ? void 0 : user._id))
                                        return [2 /*return*/, res.status(401).json({ message: "You're not authorized to access to do that." })];
                                    return [4 /*yield*/, User_1.default
                                            .findOneAndUpdate({ _id: id }, {
                                            $set: __assign(__assign({}, newUserData), { bio: newUserData.bio.substring(0, 150) })
                                        }, { new: true })
                                            .then(function (updatedUser) {
                                            // @ts-expect-error
                                            var _a = updatedUser._doc, password = _a.password, sendData = __rest(_a, ["password"]);
                                            res.status(200).json(sendData);
                                        })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (err) { return res.status(404).json({ message: err.message }); })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.updateUser = updateUser;
