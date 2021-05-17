import { Schema, model, Types } from "mongoose";
import IUser from "../interfaces/userInterface";

const UserSchema: Schema = new Schema({
    permission: { type: String, required: true, default: "user" },
    email: { type: String, required: true, unique: true },
    verified: Boolean,
    username: { type: String, required: true, unique: true },
    bio: { type: String },
    score: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    posts: [ Types.ObjectId ],
    votedPosts: [ Types.ObjectId ],
    votedComments: [ Types.ObjectId ]
});

export default model<IUser>("User", UserSchema);