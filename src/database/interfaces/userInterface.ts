import { Document, Types } from "mongoose";

export default interface IUser extends Document {
    permission: String;
    email: String;
    username: String;
    verified: Boolean;
    score: Number;
    bio: String;
    joinedAt: Date;
    posts:  [ Types.ObjectId ];
    votedPosts: [ Types.ObjectId ];
    votedComments: [ Types.ObjectId ];
}