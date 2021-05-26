import { Request, Response } from "express";
import { Types } from "mongoose";
import Comment from "../database/models/Comment";
import IUser from "../database/interfaces/IUser";
import Post from "../database/models/Post";
import User from "../database/models/User";

// get comment by id
export const getComment = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No comment found with id : ${id}` });

    await Comment
        .findOne({ _id: id })
        .then(comment => res.status(200).json(comment))
        .catch(err => {
            res.status(404).json({ message: "There was an error." })
        });
}

// create new comment and return comment data
export const createComment = async (req: Request, res: Response) => {
    const comment = req.body;
    const postId = req.query.postId as string;
    const user = req.user as IUser;
    if (!Types.ObjectId.isValid(postId)) return res.status(404).json({ message: `No post found with id : ${postId}` });

    await new Comment({ ...comment, post: postId, user: (req.user as IUser)?._id })
        .save()
        .then(async newComment => {
            await Post.updateOne({ _id: postId }, { $push: { comments: newComment._id } });
            await User.updateOne({ _id: user._id }, { $push: { comments: newComment._id } });
            res.status(201).json({message: "Comment successfully added."});
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error while adding comment." })
        });
}

// vote or downVote comment by id
export const commentReaction = async (req: Request, res: Response) => {
    const commentId = req.query.commentId as string;
    const action = req.query.action as string;
    const user = req.user as IUser;
    const userId = user._id;
    if (!Types.ObjectId.isValid(commentId)) return res.status(404).json({ message: `No comment with id: ${commentId}` });

    let downVotes: any = [];
    let votes: any = [];
    await Comment
        .findById(commentId)
        .then(async comment => {
            downVotes = comment?.downVotes;
            votes = comment?.votes;
            switch (action) {
                case "like":
                    downVotes = downVotes.filter((voter: IUser) => voter.toString() != userId.toString());
                    if (comment?.votes.includes(userId)) {
                        await User.findOneAndUpdate({ _id: userId }, { $pull: { votedComments: commentId } });
                        votes = comment?.votes.filter(voter => voter.toString() != userId.toString());
                    }
                    else {
                        await User.findOneAndUpdate({ _id: userId }, { $push: { votedComments: commentId } });
                        votes.push(userId);
                    }
                    break;

                case "dislike":
                    votes = votes.filter((voter: IUser) => voter.toString() != userId.toString());
                    if (comment?.downVotes.includes(userId)) downVotes = comment?.downVotes.filter(voter => voter.toString() != userId.toString());
                    else downVotes.push(userId);
                    break;

                default:
                    break;
            }
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error." })
        });

    await Comment
        .findOneAndUpdate({ _id: commentId }, { $set: { downVotes, votes } }, { new: true })
        .then(updatedComment => res.status(200).json(updatedComment))
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error." })
        });
}

// update comment using id and return new coment
export const updateComment = async (req: Request, res: Response) => {
    const { id, updatedComment } = req.body;
    const user = req.user as IUser;

    if (!Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No post with id: ${id}` });
    if (updatedComment.user.toString() !== user._id.toString()) return res.status(401).json({ message: "This post is not made by logged in user." });

    await Comment
        .findOneAndUpdate({ _id: id }, { $set: { ...updatedComment, edited: true, updatedAt: Date.now() } }, { new: true })
        .then(newComment => res.status(200).json(newComment))
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error while updating the comment." })
        });
}

// delete comment using id
export const deleteComment = async (req: Request, res: Response) => {
    const commentId = req.query.commentId as string;
    const postId = req.query.postId as string;
    const user = req.user as IUser;
    if (!Types.ObjectId.isValid(postId)) return res.status(404).json({ message: `No post with id: ${postId}` });
    if (!Types.ObjectId.isValid(commentId)) return res.status(404).json({ message: `No comment with id: ${commentId}` });

    await Comment
        .findOneAndDelete({ _id: commentId })
        .then(async deletedComment => {
            await Post.updateOne({ _id: postId }, { $pull: { comments: commentId } });
            await User.updateOne({ _id: user._id }, { $pull: { comments: commentId } });
            res.status(200).json({ message: "Comment deleted successfully" });
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error while deleting the comment." })
        });
}

// search comments by post
export const searchComment = async (req: Request, res: Response) => {
    const postId: string = req.query.postId as string;
    const userId: string = req.query.userId as string;

    let dbQuery = {};
    if (!postId && !userId) dbQuery = {};
    else if (!userId) dbQuery = { post: postId };
    else if (!postId) dbQuery = { user: userId };
    else dbQuery = { $and: [{ post: postId }, { user: userId }] };

    await Comment
        .find(dbQuery)
        .then(comments => comments
            ? res.status(200).json(comments)
            : res.status(404).json({ message: "No comments found." }))
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error while fetching the comments." })
        });
}