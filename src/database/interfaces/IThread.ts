import { Document, Types } from "mongoose";

export default interface IThread extends Document {
    title: string;
    body: string;
    posts: [Types.ObjectId];
    numberOfPosts: number;
    author: Types.ObjectId;
    createdAt: Date;
}