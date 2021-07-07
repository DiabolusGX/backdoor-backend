"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var commentSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Types.ObjectId, required: true },
    body: { type: String, require: true },
    post: mongoose_1.Types.ObjectId,
    votes: [mongoose_1.Types.ObjectId],
    downVotes: [mongoose_1.Types.ObjectId],
    edited: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});
exports.default = mongoose_1.model("Comment", commentSchema);
