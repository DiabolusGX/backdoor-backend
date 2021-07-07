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
exports.searchComment = exports.deleteComment = exports.updateComment = exports.commentReaction = exports.createComment = exports.getComment = void 0;
var mongoose_1 = require("mongoose");
var Comment_1 = __importDefault(require("../database/models/Comment"));
var Post_1 = __importDefault(require("../database/models/Post"));
var User_1 = __importDefault(require("../database/models/User"));
// get comment by id
var getComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                if (!mongoose_1.Types.ObjectId.isValid(id))
                    return [2 /*return*/, res.status(404).json({ message: "No comment found with id : " + id })];
                return [4 /*yield*/, Comment_1.default
                        .findOne({ _id: id })
                        .then(function (comment) { return res.status(200).json(comment); })
                        .catch(function (err) {
                        res.status(404).json({ message: "There was an error." });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.getComment = getComment;
// create new comment and return comment data
var createComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var comment, postId, user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                comment = req.body;
                postId = req.query.postId;
                user = req.user;
                if (!mongoose_1.Types.ObjectId.isValid(postId))
                    return [2 /*return*/, res.status(404).json({ message: "No post found with id : " + postId })];
                return [4 /*yield*/, new Comment_1.default(__assign(__assign({}, comment), { post: postId, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }))
                        .save()
                        .then(function (newComment) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Post_1.default.updateOne({ _id: postId }, { $push: { comments: newComment._id } })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, User_1.default.updateOne({ _id: user._id }, { $push: { comments: newComment._id } })];
                                case 2:
                                    _a.sent();
                                    res.status(201).json({ message: "Comment successfully added." });
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (err) {
                        console.log(err);
                        res.status(409).json({ message: "There was an error while adding comment." });
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createComment = createComment;
// vote or downVote comment by id
var commentReaction = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, action, user, userId, downVotes, votes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentId = req.query.commentId;
                action = req.query.action;
                user = req.user;
                userId = user._id;
                if (!mongoose_1.Types.ObjectId.isValid(commentId))
                    return [2 /*return*/, res.status(404).json({ message: "No comment with id: " + commentId })];
                downVotes = [];
                votes = [];
                return [4 /*yield*/, Comment_1.default
                        .findById(commentId)
                        .then(function (comment) { return __awaiter(void 0, void 0, void 0, function () {
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    downVotes = comment === null || comment === void 0 ? void 0 : comment.downVotes;
                                    votes = comment === null || comment === void 0 ? void 0 : comment.votes;
                                    _a = action;
                                    switch (_a) {
                                        case "like": return [3 /*break*/, 1];
                                        case "dislike": return [3 /*break*/, 6];
                                    }
                                    return [3 /*break*/, 7];
                                case 1:
                                    downVotes = downVotes.filter(function (voter) { return voter.toString() != userId.toString(); });
                                    if (!(comment === null || comment === void 0 ? void 0 : comment.votes.includes(userId))) return [3 /*break*/, 3];
                                    return [4 /*yield*/, User_1.default.findOneAndUpdate({ _id: userId }, { $pull: { votedComments: commentId } })];
                                case 2:
                                    _b.sent();
                                    votes = comment === null || comment === void 0 ? void 0 : comment.votes.filter(function (voter) { return voter.toString() != userId.toString(); });
                                    return [3 /*break*/, 5];
                                case 3: return [4 /*yield*/, User_1.default.findOneAndUpdate({ _id: userId }, { $push: { votedComments: commentId } })];
                                case 4:
                                    _b.sent();
                                    votes.push(userId);
                                    _b.label = 5;
                                case 5: return [3 /*break*/, 8];
                                case 6:
                                    votes = votes.filter(function (voter) { return voter.toString() != userId.toString(); });
                                    if (comment === null || comment === void 0 ? void 0 : comment.downVotes.includes(userId))
                                        downVotes = comment === null || comment === void 0 ? void 0 : comment.downVotes.filter(function (voter) { return voter.toString() != userId.toString(); });
                                    else
                                        downVotes.push(userId);
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
                return [4 /*yield*/, Comment_1.default
                        .findOneAndUpdate({ _id: commentId }, { $set: { downVotes: downVotes, votes: votes } }, { new: true })
                        .then(function (updatedComment) { return res.status(200).json(updatedComment); })
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
exports.commentReaction = commentReaction;
// update comment using id and return new coment
var updateComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, updatedComment, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, id = _a.id, updatedComment = _a.updatedComment;
                user = req.user;
                if (!mongoose_1.Types.ObjectId.isValid(id))
                    return [2 /*return*/, res.status(404).json({ message: "No post with id: " + id })];
                if (updatedComment.user.toString() !== user._id.toString())
                    return [2 /*return*/, res.status(401).json({ message: "This post is not made by logged in user." })];
                return [4 /*yield*/, Comment_1.default
                        .findOneAndUpdate({ _id: id }, { $set: __assign(__assign({}, updatedComment), { edited: true, updatedAt: Date.now() }) }, { new: true })
                        .then(function (newComment) { return res.status(200).json(newComment); })
                        .catch(function (err) {
                        console.log(err);
                        res.status(409).json({ message: "There was an error while updating the comment." });
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.updateComment = updateComment;
// delete comment using id
var deleteComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, postId, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentId = req.query.commentId;
                postId = req.query.postId;
                user = req.user;
                if (!mongoose_1.Types.ObjectId.isValid(postId))
                    return [2 /*return*/, res.status(404).json({ message: "No post with id: " + postId })];
                if (!mongoose_1.Types.ObjectId.isValid(commentId))
                    return [2 /*return*/, res.status(404).json({ message: "No comment with id: " + commentId })];
                return [4 /*yield*/, Comment_1.default
                        .findOneAndDelete({ _id: commentId })
                        .then(function (deletedComment) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, Post_1.default.updateOne({ _id: postId }, { $pull: { comments: commentId } })];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, User_1.default.updateOne({ _id: user._id }, { $pull: { comments: commentId } })];
                                case 2:
                                    _a.sent();
                                    res.status(200).json({ message: "Comment deleted successfully" });
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .catch(function (err) {
                        console.log(err);
                        res.status(409).json({ message: "There was an error while deleting the comment." });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.deleteComment = deleteComment;
// search comments by post
var searchComment = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, userId, dbQuery;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                postId = req.query.postId;
                userId = req.query.userId;
                dbQuery = {};
                if (!postId && !userId)
                    dbQuery = {};
                else if (!userId)
                    dbQuery = { post: postId };
                else if (!postId)
                    dbQuery = { user: userId };
                else
                    dbQuery = { $and: [{ post: postId }, { user: userId }] };
                return [4 /*yield*/, Comment_1.default
                        .find(dbQuery)
                        .then(function (comments) { return comments
                        ? res.status(200).json(comments)
                        : res.status(404).json({ message: "No comments found." }); })
                        .catch(function (err) {
                        console.log(err);
                        res.status(409).json({ message: "There was an error while fetching the comments." });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.searchComment = searchComment;
