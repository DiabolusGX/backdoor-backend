import { Document, Types } from "mongoose";

export default interface IUser extends Document {
    permissionLevel: number;
    email: string;
    verified: Boolean;
    username: string;
    password: string;
    bio: string;
    score: number;
    joinedAt: Date;
    posts:  [ Types.ObjectId ];
    comments: [ Types.ObjectId ];
    votedPosts: [ Types.ObjectId ];
    votedComments: [ Types.ObjectId ];
}