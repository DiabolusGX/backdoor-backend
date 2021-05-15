import { Document, Types } from "mongoose";

export default interface IUser extends Document {
    permission: String;
    email: String;
    username: String;
    picture: String;
    joinedAt: Date;
    score: Number;
    posts:  [ Types.ObjectId ];
    votedPosts: [ Types.ObjectId ];
    votedComments: [ Types.ObjectId ];
}