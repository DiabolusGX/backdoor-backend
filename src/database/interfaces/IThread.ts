import { Document, Types } from "mongoose";

export default interface IThread extends Document {
    title: string;
    body: string;
    posts: [Types.ObjectId];
    numberOfPosts: number;
    user: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}