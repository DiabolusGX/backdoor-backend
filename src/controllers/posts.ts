import { Request, Response } from "express";
import { Types } from "mongoose";
import IPost from "../database/interfaces/postInterface";
import postModel from "../database/models/postModel";

// get all posts
export const getPost = async (req: Request, res: Response) => {
    await postModel
        .find()
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(404).json({ message: err.message, error: err }));
}

// create new post and return post data
export const createPost = async (req: Request, res: Response) => {
    const post = req.body;

    await new postModel(post)
        .save()
        .then(newPost => res.status(201).json(newPost))
        .catch(err => res.status(409).json({ message: err.message, error: err }));
}

// like post, get post by post document id and add user id to it's votes array
export const likePost = async (req: Request, res: Response) => {
    const postId: string = req.query.postId as string;
    const userId: string = req.query.userId as string;
    if (!Types.ObjectId.isValid(postId)) return res.status(404).json({ message: `No post with id: ${postId}` });
    if (!Types.ObjectId.isValid(userId)) return res.status(404).json({ message: `No user with id: ${userId}` });

    let votes:any = [];
    await postModel
        .findById(postId)
        .then(async post => {
            // @ts-expect-error
            if(post?.votes.includes(userId)) {
                votes = post?.votes.filter((voter) => voter.toString() != userId.toString());
            }
            else {
                votes = post?.votes;
                votes.push(userId);
            }
        })
        .catch(err => res.status(409).json({ message: err.message, error: err }));

    await postModel
        .findOneAndUpdate({ _id: postId }, { $set: { votes: votes } }, { new: true })
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => res.status(409).json({ message: err.message, error: err }));
}

// update post using post document id and return new post data
export const updatePost = async (req: Request, res: Response) => {
    const { _id, post } = req.body;
    if (!Types.ObjectId.isValid(_id)) return res.status(404).json({ message: `No post with id: ${_id}` });

    await postModel
        .findOneAndUpdate({ _id }, { $set: post }, { new: true })
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => res.status(409).json({ message: err.message, error: err }));
}

// delete post using post document id
export const deletePost = async (req: Request, res: Response) => {
    const { _id } = req.body;
    if (!Types.ObjectId.isValid(_id)) return res.status(404).json({ message: `No post with id: ${_id}` });

    await postModel
        .findOneAndDelete({ _id: _id })
        .then(deletedPost =>  res.status(200).json(deletedPost))
        .catch(err => res.status(409).json({ message: err.message, error: err }));
}

// search post using title or tags
export const searchPost = async (req: Request, res: Response) => {
    const searchQuery: string = req.query.searchQuery as string;
    const tags: string = req.query.tags as string || "";
    const title = searchQuery ? new RegExp(searchQuery, "i") : "";

    let dbQuery = {};
    if(!searchQuery && !tags) dbQuery = {};
    else if(!tags) dbQuery = { $and:[ { title } ] };
    else if(!searchQuery) dbQuery = { $and:[ {tags: {$in: tags.split(",")}} ] };
    else dbQuery = { $and:[ { title } , {tags: {$in: tags.split(",")}} ] };

    await postModel
        .find( dbQuery )
        .then(posts => posts
            ? res.status(200).json(posts)
            : res.status(404).json({ message: "no updated post found" }))
        .catch(err => res.status(409).json({ message: err.message, error: err }));
}   