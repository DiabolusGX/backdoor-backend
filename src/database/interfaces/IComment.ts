import { Document, Types } from "mongoose";

export default interface IPost extends Document {
    user: Types.ObjectId;
    body: string;
    post: Types.ObjectId;
    votes: [ Types.ObjectId ];
    downVotes: [ Types.ObjectId ];
    edited: boolean;
    createdAt: Date;
    updatedAt: Date;
}