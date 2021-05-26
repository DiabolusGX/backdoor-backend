import { Schema, model, Types } from "mongoose";
import IComment from "../interfaces/IComment";

const commentSchema: Schema = new Schema({
    user: { type: Types.ObjectId, required: true },
    body: { type: String, require: true },
    post: Types.ObjectId,
    votes: [ Types.ObjectId ],
    downVotes: [ Types.ObjectId ],
    edited: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export default model<IComment>("Comment", commentSchema);