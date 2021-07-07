"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var PostSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    user: { type: mongoose_1.Types.ObjectId, required: true },
    votes: [mongoose_1.Types.ObjectId],
    downVotes: [mongoose_1.Types.ObjectId],
    tags: [String],
    comments: [mongoose_1.Types.ObjectId],
    edited: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});
exports.default = mongoose_1.model("Post", PostSchema);
