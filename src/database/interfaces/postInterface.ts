import { Document, Types } from "mongoose";

export default interface IPost extends Document {
    title: String;
    author: Types.ObjectId;
    votes: [Types.ObjectId];
    tags: [String];
    comments: [{ author: Types.ObjectId, message: String, votes: Number, createdAt: Date }];
    createdAt: Date;
    updatedAt: Date;
}