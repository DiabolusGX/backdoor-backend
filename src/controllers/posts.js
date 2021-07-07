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
exports.searchPost = exports.deletePost = exports.updatePost = exports.postReaction = exports.createPost = exports.getPost = exports.getAllPosts = void 0;
var mongoose_1 = require("mongoose");
var Post_1 = __importDefault(require("../database/models/Post"));
var User_1 = __importDefault(require("../database/models/User"));
var Thread_1 = __importDefault(require("../database/models/Thread"));
var Comment_1 = __importDefault(require("../database/models/Comment"));
// get all posts
var getAllPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Post_1.default
                    .find()
                    .then(function (posts) { return res.status(200).json(posts); })
                    .catch(function (err) {
                    console.log(err);
                    res.status(404).json({ message: "There was an error while fetching posts." });
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.getAllPosts = getAllPosts;
// get post by id
var getPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                if (!mongoose_1.Types.ObjectId.isValid(id))
                    return [2 /*return*/, res.status(404).json({ message: "Post not found." })];
                return [4 /*yield*/, Post_1.default
                        .findOne({ _id: id })
                        .then(function (posts) { return res.status(200).json(posts); })
                        .catch(function (err) {
                        res.status(404).json({ message: "There was an error." });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.getPost = getPost;
// create new post and return post data
var createPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var post, formattedTags;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                post = req.body;
                formattedTags = post.tags.map(function (tag) { return tag.toLowerCase(); });
                return [4 /*yield*/, new Post_1.default(__assign(__assign({}, post), { tags: formattedTags, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }))
                        .save()
                        .then(function (newPost) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, User_1.default.updateOne({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, { $push: { posts: newPost._id } })];
                                case 1:
                                    _b.sent();
                                    newPost.tags.forEach(function (tag) { return __awaiter(void 0, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, Thread_1.default.updateOne({ title: tag.toLocaleLowerCase() }, {
                                                        $push: { posts: newPost._id },
                                                        $inc: { numberOfPosts: 1 }
                                                    })];
                                                case 1:
                                                    _a.sent();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); });
                                    res.status(201).json({ message: "Post added successfully!" });
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (err) {
                        console.log(err);
                        res.status(409).json({ message: "There was an error while creating the post." });
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createPost = createPost;
// vote or downVote post by id
var postReaction = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, action, user, downVotes, votes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.query.id;
                action = req.query.action;
                user = req.user;
                if (!mongoose_1.Types.ObjectId.isValid(id))
                    return [2 /*return*/, res.status(404).json({ message: "No post with id: " + id })];
                downVotes = [];
                votes = [];
                return [4 /*yield*/, Post_1.default
                        .findById(id)
                        .then(function (post) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    downVotes = post === null || post === void 0 ? void 0 : post.downVotes;
                                    votes = post === null || post === void 0 ? void 0 : post.votes;
                                    _a = action;
                                    switch (_a) {
                                        case "like": return [3 /*break*/, 1];
                                        case "dislike": return [3 /*break*/, 6];
                                    }
                                    return [3 /*break*/, 7];
                                case 1:
                                    downVotes = downVotes.filter(function (voter) { return voter.toString() != user._id.toString(); });
                                    if (!(post === null || post === void 0 ? void 0 : post.votes.includes(user._id))) return [3 /*break*/, 3];
                                    return [4 /*yield*/, User_1.default.findOneAndUpdate({ _id: user._id }, { $pull: { votedPosts: post._id } })];
                                case 2:
                                    _b.sent();
                                    votes = post === null || post === void 0 ? void 0 : post.votes.filter(function (voter) { return voter.toString() != user._id.toString(); });
                                    return [3 /*break*/, 5];
                                case 3:
                                    if (!post) return [3 /*break*/, 5];
                                    return [4 /*yield*/, User_1.default.findOneAndUpdate({ _id: user._id }, { $push: { votedPosts: post._id } })];
                                case 4:
                                    _b.sent();
                                    votes.push(user._id);
                                    _b.label = 5;
                                case 5: return [3 /*break*/, 8];
                                case 6:
                                    votes = votes.filter(function (voter) { return voter.toString() != user._id.toString(); });
                                    if (post === null || post === void 0 ? void 0 : post.downVotes.includes(user._id))
                                        downVotes = post === null || post === void 0 ? void 0 : post.downVotes.filter(function (voter) { return voter.toString() != user._id.toString(); });
                                    else
                                        downVotes.push(user._id);
                                    return [3 /*break*/, 8];
                                case 7: return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (err) {
                        console.log(err);
                        res.status(409).json({ message: "There was an error." });
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, Post_1.default
                        .findOneAndUpdate({ _id: id }, { $set: { downVotes: downVotes, votes: votes } }, { new: true })
                        .then(function (updatedPost) { return res.status(200).json(updatedPost); })
                        .catch(function (err) {
                        console.log(err);
                        res.status(409).json({ message: "There was an error." });
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.postReaction = postReaction;
// update post using post document id and return new post data
var updatePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, updatedPost, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, updatedPost = _a.updatedPost;
                user = req.user;
                if (!mongoose_1.Types.ObjectId.isValid(id))
                    return [2 /*return*/, res.status(404).json({ message: "No post with id: " + id })];
                if (updatedPost.user.toString() !== user._id.toString())
                    return [2 /*return*/, res.status(401).json({ message: "This post is not made by logged in user." })];
                return [4 /*yield*/, Post_1.default
                        .findById(id)
                        .then(function (currPost) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Post_1.default
                                        .findOneAndUpdate({ _id: id }, { $set: __assign(__assign({}, updatedPost), { edited: true, updatedAt: Date.now() }) }, { new: true })
                                        .then(function (newPost) { return __awaiter(void 0, void 0, void 0, function () {
                                        var addThread, removeThread;
                                        return __generator(this, function (_a) {
                                            addThread = newPost === null || newPost === void 0 ? void 0 : newPost.tags.filter(function (tag) { return !(currPost === null || currPost === void 0 ? void 0 : currPost.tags.includes(tag)); });
                                            removeThread = currPost === null || currPost === void 0 ? void 0 : currPost.tags.filter(function (tag) { return !(newPost === null || newPost === void 0 ? void 0 : newPost.tags.includes(tag)); });
                                            addThread === null || addThread === void 0 ? void 0 : addThread.forEach(function (tag) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, Thread_1.default.updateOne({ title: tag }, { $push: { posts: newPost === null || newPost === void 0 ? void 0 : newPost._id }, $inc: { numberOfPosts: 1 } })];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                }
                                            }); }); });
                                            removeThread === null || removeThread === void 0 ? void 0 : removeThread.forEach(function (tag) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, Thread_1.default.updateOne({ title: tag }, { $pull: { posts: newPost === null || newPost === void 0 ? void 0 : newPost._id }, $inc: { numberOfPosts: -1 } })];
                                                    case 1: return [2 /*return*/, _a.sent()];
                                                }
                                            }); }); });
                                            res.status(200).json(newPost);
                                            return [2 /*return*/];
                                        });
                                    }); })];
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
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.updatePost = updatePost;
// delete post using post document id
var deletePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.query.id;
                user = req.user;
                if (!mongoose_1.Types.ObjectId.isValid(id))
                    return [2 /*return*/, res.status(404).json({ message: "No post with id: " + id })];
                return [4 /*yield*/, Post_1.default
                        .findOne({ _id: id })
                        .then(function (post) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if ((post === null || post === void 0 ? void 0 : post.user.toString()) !== user._id.toString() && user.permissionLevel < 2)
                                        return [2 /*return*/, res.status(401).json({ message: "You can not delete this post." })];
                                    return [4 /*yield*/, Post_1.default.findOneAndDelete({ _id: id })
                                            .then(function (deletedPost) { return __awaiter(void 0, void 0, void 0, function () {
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0: return [4 /*yield*/, User_1.default.updateOne({ _id: user._id }, {
                                                            $pull: { posts: deletedPost === null || deletedPost === void 0 ? void 0 : deletedPost._id }
                                                        })];
                                                    case 1:
                                                        _a.sent();
                                                        deletedPost === null || deletedPost === void 0 ? void 0 : deletedPost.tags.forEach(function (tag) { return __awaiter(void 0, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, Thread_1.default.updateOne({ title: tag }, {
                                                                            $pull: { posts: deletedPost === null || deletedPost === void 0 ? void 0 : deletedPost._id },
                                                                            $inc: { numberOfPosts: -1 }
                                                                        })];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); });
                                                        deletedPost === null || deletedPost === void 0 ? void 0 : deletedPost.comments.forEach(function (commentId) { return __awaiter(void 0, void 0, void 0, function () {
                                                            return __generator(this, function (_a) {
                                                                switch (_a.label) {
                                                                    case 0: return [4 /*yield*/, Comment_1.default.findOneAndDelete({ _id: commentId })];
                                                                    case 1:
                                                                        _a.sent();
                                                                        return [2 /*return*/];
                                                                }
                                                            });
                                                        }); });
                                                        res.status(200).json({ message: "Post deleted successfully" });
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); })];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (err) {
                        console.log(err);
                        res.status(409).json({ message: "There was an error while deleting the post." });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deletePost = deletePost;
// search post using title or tags or user
var searchPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var title, userId, tags, titleRegexp, dbQuery;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = req.query.title;
                userId = req.query.userId;
                tags = req.query.tags || "";
                titleRegexp = title ? new RegExp(title, "i") : "";
                dbQuery = {};
                // no search query
                if (!title && !tags && !userId)
                    dbQuery = {};
                // only title
                else if (!tags && !userId)
                    dbQuery = { title: titleRegexp };
                // only tags
                else if (!title && !userId)
                    dbQuery = { tags: { $in: tags.split(",") } };
                // only user id
                else if (!tags && !title)
                    dbQuery = { user: userId };
                // title and tags
                else if (!userId)
                    dbQuery = { $and: [{ title: titleRegexp }, { tags: { $in: tags.split(",") } }] };
                // title and user id
                else if (!tags)
                    dbQuery = { $and: [{ title: titleRegexp }, { user: userId }] };
                // tags and user id
                else if (!title)
                    dbQuery = { $and: [{ tags: { $in: tags.split(",") } }, { user: userId }] };
                // all 3 given
                else
                    dbQuery = { $and: [{ title: titleRegexp }, { tags: { $in: tags.split(",") } }, { user: userId }] };
                return [4 /*yield*/, Post_1.default
                        .find(dbQuery)
                        .then(function (posts) { return posts
                        ? res.status(200).json(posts)
                        : res.status(404).json({ message: "No updated post" }); })
                        .catch(function (err) {
                        console.error(err);
                        console.log("here is errr");
                        res.status(409).json({ message: "There was an error while fetching the post." });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.searchPost = searchPost;
