import { Document, Types } from "mongoose";

export default interface IPost extends Document {
    title: string;
    body: string;
    author: Types.ObjectId;
    votes: [ Types.ObjectId ];
    downVotes: [ Types.ObjectId ],
    tags: [ string ];
    comments: [{ author: Types.ObjectId, message: string, votes: number, createdAt: Date }];
    createdAt: Date;
    updatedAt: Date;
}