import { Document, Types } from "mongoose";

export default interface IThread extends Document {
    title: String;
    body: String;
    posts: [Types.ObjectId];
    numberOfPosts: Number;
    author: Types.ObjectId;
    createdAt: Date;
}