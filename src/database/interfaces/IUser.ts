import { Document, Types } from "mongoose";

export default interface IUser extends Document {
    permission_level: Number;
    email: String;
    verified: Boolean;
    username: String;
    password: String;
    bio: String;
    score: Number;
    joinedAt: Date;
    posts:  [ Types.ObjectId ];
    votedPosts: [ Types.ObjectId ];
    votedComments: [ Types.ObjectId ];
}