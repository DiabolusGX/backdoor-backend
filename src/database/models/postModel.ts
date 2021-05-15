import { Schema, model, Types } from "mongoose";
import IPost from "../interfaces/postInterface";

const PostSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
    author: { type: Types.ObjectId, required: true, unique: true },
    votes: { type: Number, required: true, unique: true },
    tags: { type: Array },
    comments: [{ author: Types.ObjectId, message: String, votes: Number, createdAt: Date }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

export default model<IPost>("Post", PostSchema);