import { Document, Types } from "mongoose";

export default interface IUser extends Document {
    permission_level: number;
    email: string;
    verified: Boolean;
    username: string;
    password: string;
    bio: string;
    score: number;
    joinedAt: Date;
    posts:  [ Types.ObjectId ];
    votedPosts: [ Types.ObjectId ];
    votedComments: [ Types.ObjectId ];
}