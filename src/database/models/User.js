"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    permissionLevel: { type: Number, required: true, default: 1 },
    email: { type: String, required: true, unique: true },
    verified: Boolean,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "Cybersecurity enthusiast." },
    score: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    posts: [mongoose_1.Types.ObjectId],
    comments: [mongoose_1.Types.ObjectId],
    votedPosts: [mongoose_1.Types.ObjectId],
    votedComments: [mongoose_1.Types.ObjectId]
});
exports.default = mongoose_1.model("User", UserSchema);
