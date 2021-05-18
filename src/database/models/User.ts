import { Schema, model, Types } from "mongoose";
import IUser from "../interfaces/userInterface";

const UserSchema: Schema = new Schema({
    permission_level: { type: Number, required: true, default: 0 },
    email: { type: String, required: true, unique: true },
    verified: Boolean,
    username: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    bio: { type: String },
    score: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    posts: [ Types.ObjectId ],
    votedPosts: [ Types.ObjectId ],
    votedComments: [ Types.ObjectId ]
});

export default model<IUser>("User", UserSchema);