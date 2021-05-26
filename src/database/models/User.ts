import { Schema, model, Types } from "mongoose";
import IUser from "../interfaces/IUser";

const UserSchema: Schema = new Schema({
    permissionLevel: { type: Number, required: true, default: 1 },
    email: { type: String, required: true, unique: true },
    verified: Boolean,
    username: { type: String, required: true, unique: true },
    password: {type: String, required: true},
    bio: { type: String, default: "Cybersecurity enthusiast." },
    score: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    posts: [ Types.ObjectId ],
    comments: [ Types.ObjectId ],
    votedPosts: [ Types.ObjectId ],
    votedComments: [ Types.ObjectId ]
});

export default model<IUser>("User", UserSchema);