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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateThread = exports.createThread = exports.getThread = exports.getAllThreads = void 0;
var Post_1 = __importDefault(require("../database/models/Post"));
var Thread_1 = __importDefault(require("../database/models/Thread"));
// get all threads details
var getAllThreads = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Thread_1.default
                    .find()
                    .then(function (threads) { return res.status(200).json(threads); })
                    .catch(function (err) {
                    console.log(err);
                    res.status(404).json({ message: "There was an error while fetching threads." });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.getAllThreads = getAllThreads;
// get thread details
var getThread = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var title;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = req.params.title.toLocaleLowerCase();
                return [4 /*yield*/, Thread_1.default
                        .findOne({ title: title })
                        .then(function (thread) { return res.status(200).json(thread); })
                        .catch(function (err) {
                        console.log(err);
                        res.status(404).json({ message: "There was an error." });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.getThread = getThread;
// create new thread
var createThread = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var thread;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                thread = req.body;
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.permissionLevel) < 3)
                    return [2 /*return*/, res.status(401).json({ message: "You do not have the permission to create a thread." })];
                return [4 /*yield*/, new Thread_1.default(__assign(__assign({}, thread), { title: thread.title.toLocaleLowerCase().replace(/\s/g, '-'), user: (_b = req.user) === null || _b === void 0 ? void 0 : _b._id }))
                        .save()
                        .then(function (thread) { return res.status(200).json({ message: "Thread created successfully" }); })
                        .catch(function (err) {
                        console.log(err);
                        res.status(404).json({ message: "There was an error while creating the thread." });
                    })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createThread = createThread;
// update thread all posts that are in that thread
var updateThread = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, threadData;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.body, title = _a.title, threadData = _a.threadData;
                if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.permissionLevel) < 3)
                    return [2 /*return*/, res.status(401).json({ message: "You do not have the permission to create a thread." })];
                return [4 /*yield*/, Thread_1.default
                        .findOne({ title: title })
                        .then(function (currThread) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (title.toLowerCase() !== threadData.title.toLowerCase())
                                        currThread === null || currThread === void 0 ? void 0 : currThread.posts.forEach(function (postId) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, Post_1.default.findOneAndUpdate({ _id: postId }, { $pull: { tags: title } })];
                                                    case 1:
                                                        _a.sent();
                                                        return [4 /*yield*/, Post_1.default.findOneAndUpdate({ _id: postId }, { $push: { tags: threadData.title.toLowerCase() } })];
                                                    case 2:
                                                        _a.sent();
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                    return [4 /*yield*/, Thread_1.default
                                            .findOneAndUpdate({ title: title }, { $set: __assign(__assign({}, threadData), { title: threadData.title.toLocaleLowerCase(), updatedAt: Date.now() }) }, { new: true })
                                            .then(function (newThread) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                            return [2 /*return*/, res.status(200).json(newThread)];
                                        }); }); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (err) {
                        console.log(err);
                        res.status(409).json({ message: "There was an error while updating the post." });
                    })];
            case 1:
                _c.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.updateThread = updateThread;
