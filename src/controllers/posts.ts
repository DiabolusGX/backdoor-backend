import { Request, Response } from "express";
import { Types } from "mongoose";
import IUser from "../database/interfaces/IUser";
import Post from "../database/models/Post";
import User from "../database/models/User";
import Thread from "../database/models/Thread";

// get all posts
export const getAllPosts = async (req: Request, res: Response) => {
    await Post
        .find()
        .then(posts => res.status(200).json(posts))
        .catch(err => {
            console.log(err);
            res.status(404).json({ message: "There was an error while fetching posts." })
        });
}

// get post by id
export const getPost = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) return res.status(404).json({ message: `Post not found.` });

    await Post
        .findOne({ _id: id })
        .then(posts => res.status(200).json(posts))
        .catch(err => {
            res.status(404).json({ message: "There was an error." })
        });
}

// create new post and return post data
export const createPost = async (req: Request, res: Response) => {
    const post = req.body;

    await new Post({ ...post, user: (req.user as IUser)?._id })
        .save()
        .then(async newPost => {
            await User.updateOne({ _id: (req.user as IUser)?._id }, { $push: { posts: newPost._id } });
            newPost.tags.forEach(async tag => {
                await Thread.updateOne({ title: tag }, {
                    $push: { posts: newPost._id },
                    $inc: { 'numberOfPosts': 1 }
                });
            });
            res.status(201).json(newPost);
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error while creating the post." })
        });
}

// like post, get post by post document id and add user id to it's votes array
export const likePost = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    const user = req.user as IUser;
    if (!Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No post with id: ${id}` });

    let votes: any = [];
    await Post
        .findById(id)
        .then(async post => {
            // @ts-expect-error
            if (post?.votes.includes(userId)) {
                votes = post?.votes.filter((voter) => voter.toString() != user._id.toString());
            } else {
                votes = post?.votes;
                votes.push(user._id);
            }
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error." })
        });

    await Post
        .findOneAndUpdate({ _id: id }, { $set: { votes: votes } }, { new: true })
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error." })
        });
}

// update post using post document id and return new post data
export const updatePost = async (req: Request, res: Response) => {
    const { _id, post } = req.body;
    const user = req.user as IUser;

    if (!Types.ObjectId.isValid(_id)) return res.status(404).json({ message: `No post with id: ${_id}` });
    if (post.user !== user._id) return res.status(401).json({ message: "This post is not made by logged in user." });

    await Post
        .findOneAndUpdate({ _id }, { $set: { ...post, updatedAt: Date.now } }, { new: true })
        // TODO : remove post from old tags and add to new
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error while updating the post." })
        });
}

// delete post using post document id
export const deletePost = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    if (!Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No post with id: ${id}` });

    await Post
        .findOneAndDelete({ _id: id })
        .then(async deletedPost => {
            await User.updateOne({ _id: (req.user as IUser)._id }, {
                $pull: { posts: deletedPost?._id }
            });
            deletedPost?.tags.forEach(async tag => {
                await Thread.updateOne({ title: tag }, {
                    $pull: { posts: deletedPost?._id },
                    $inc: { 'numberOfPosts': -1 }
                });
            });
            res.status(200).json({ message: "Post deleted successfully" });
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error while deleting the post." })
        });
}

// search post using title or tags
export const searchPost = async (req: Request, res: Response) => {
    const title: string = req.query.title as string;
    const tags: string = req.query.tags as string || "";
    const titleRegexp = title ? new RegExp(title, "i") : "";

    let dbQuery = {};
    if (!title && !tags) dbQuery = {};
    else if (!tags) dbQuery = { title: titleRegexp };
    else if (!title) dbQuery = { tags: { $in: tags.split(",") } };
    else dbQuery = { $and: [{ title: titleRegexp }, { tags: { $in: tags.split(",") } }] };

    await Post
        .find(dbQuery)
        .then(posts => posts
            ? res.status(200).json(posts)
            : res.status(404).json({ message: "No updated post" }))
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error while fetching the post." })
        });
}