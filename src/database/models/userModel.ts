import { Schema, model, Types } from "mongoose";
import IUser from "../interfaces/userInterface";

const UserSchema: Schema = new Schema({
    permission: String,
    email: { type: String, required: true },
    username: { type: String, required: true },
    picture: { type: String },
    joinedAt: { type: Date, default: Date.now },
    score: { type: Number, default: 0 },
    posts: [ Types.ObjectId ],
    votedPosts: [ Types.ObjectId ],
    votedComments: [ Types.ObjectId ]
});

export default model<IUser>("User", UserSchema);