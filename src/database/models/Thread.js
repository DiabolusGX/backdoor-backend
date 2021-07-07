"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ThreadSchema = new mongoose_1.Schema({
    title: { type: String, required: true, unique: true },
    body: { type: String, required: true },
    posts: [mongoose_1.Types.ObjectId],
    numberOfPosts: { type: Number, default: 0 },
    user: { type: mongoose_1.Types.ObjectId, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});
exports.default = mongoose_1.model("Thread", ThreadSchema);
