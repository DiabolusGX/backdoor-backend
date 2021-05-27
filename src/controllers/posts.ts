import { Request, Response } from "express";
import { Types } from "mongoose";
import IUser from "../database/interfaces/IUser";
import Post from "../database/models/Post";
import User from "../database/models/User";
import Thread from "../database/models/Thread";
import Comment from "../database/models/Comment";

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
    const formattedTags = post.tags.map((tag: string) => tag.toLowerCase());

    await new Post({ ...post, tags: formattedTags, user: (req.user as IUser)?._id })
        .save()
        .then(async newPost => {
            await User.updateOne({ _id: (req.user as IUser)?._id }, { $push: { posts: newPost._id } });
            newPost.tags.forEach(async tag => {
                await Thread.updateOne({ title: tag.toLocaleLowerCase() }, {
                    $push: { posts: newPost._id },
                    $inc: { numberOfPosts: 1 }
                });
            });
            res.status(201).json({ message: "Post added successfully!" });
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error while creating the post." })
        });
}

// vote or downVote post by id
export const postReaction = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    const action = req.query.action as string;
    const user = req.user as IUser;
    if (!Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No post with id: ${id}` });

    let downVotes: any = [];
    let votes: any = [];
    await Post
        .findById(id)
        .then(async post => {
            downVotes = post?.downVotes;
            votes = post?.votes;
            switch (action) {
                case "like":
                    downVotes = downVotes.filter((voter: IUser) => voter.toString() != user._id.toString());
                    if (post?.votes.includes(user._id)) {
                        await User.findOneAndUpdate({ _id: user._id }, { $pull: { votedPosts: post._id } });
                        votes = post?.votes.filter(voter => voter.toString() != user._id.toString());
                    }
                    else if (post) {
                        await User.findOneAndUpdate({ _id: user._id }, { $push: { votedPosts: post._id } });
                        votes.push(user._id);
                    }
                    break;

                case "dislike":
                    votes = votes.filter((voter: IUser) => voter.toString() != user._id.toString());
                    if (post?.downVotes.includes(user._id)) downVotes = post?.downVotes.filter(voter => voter.toString() != user._id.toString());
                    else downVotes.push(user._id);
                    break;

                default:
                    break;
            }
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error." })
        });

    await Post
        .findOneAndUpdate({ _id: id }, { $set: { downVotes, votes } }, { new: true })
        .then(updatedPost => res.status(200).json(updatedPost))
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error." })
        });
}

// update post using post document id and return new post data
export const updatePost = async (req: Request, res: Response) => {
    const { id, updatedPost } = req.body;
    const user = req.user as IUser;

    if (!Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No post with id: ${id}` });
    if (updatedPost.user.toString() !== user._id.toString()) return res.status(401).json({ message: "This post is not made by logged in user." });

    await Post
        .findById(id)
        .then(async currPost => {
            await Post
                .findOneAndUpdate({ _id: id }, { $set: { ...updatedPost, edited: true, updatedAt: Date.now() } }, { new: true })
                .then(async newPost => {
                    // Remove post from removed tags and add to updated tags
                    const addThread = newPost?.tags.filter(tag => !currPost?.tags.includes(tag));
                    const removeThread = currPost?.tags.filter(tag => !newPost?.tags.includes(tag));
                    addThread?.forEach(async tag => await Thread.updateOne({ title: tag }, { $push: { posts: newPost?._id }, $inc: { numberOfPosts: 1 } }));
                    removeThread?.forEach(async tag => await Thread.updateOne({ title: tag }, { $pull: { posts: newPost?._id }, $inc: { numberOfPosts: -1 } }));
                    res.status(200).json(newPost);
                })
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error while updating the post." })
        });
}

// delete post using post document id
export const deletePost = async (req: Request, res: Response) => {
    const id = req.query.id as string;
    const user = req.user as IUser;
    if (!Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No post with id: ${id}` });

    await Post
        .findOne({ _id: id })
        .then(async post => {
            if(post?.user.toString() !== user._id.toString() && user.permissionLevel < 2)
                return res.status(401).json({ message: "You can not delete this post." });
            await Post.findOneAndDelete({ _id: id })
            .then(async deletedPost => {
                await User.updateOne({ _id: user._id }, {
                    $pull: { posts: deletedPost?._id }
                });
                deletedPost?.tags.forEach(async tag => {
                    await Thread.updateOne({ title: tag }, {
                        $pull: { posts: deletedPost?._id },
                        $inc: { numberOfPosts: -1 }
                    });
                });
                deletedPost?.comments.forEach(async commentId => {
                    await Comment.findOneAndDelete({ _id: commentId });
                });
                res.status(200).json({ message: "Post deleted successfully" });
            })
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({ message: "There was an error while deleting the post." })
        });
}

// search post using title or tags or user
export const searchPost = async (req: Request, res: Response) => {
    const title: string = req.query.title as string;
    const userId: string = req.query.userId as string;
    const tags: string = req.query.tags as string || "";
    const titleRegexp = title ? new RegExp(title, "i") : "";

    let dbQuery = {};
    // no search query
    if (!title && !tags && !userId) dbQuery = {};
    // only title
    else if (!tags && !userId) dbQuery = { title: titleRegexp };
    // only tags
    else if (!title && !userId) dbQuery = { tags: { $in: tags.split(",") } };
    // only user id
    else if (!tags && !title) dbQuery = { user: userId };
    // title and tags
    else if (!userId) dbQuery = { $and: [{ title: titleRegexp }, { tags: { $in: tags.split(",") } }] };
    // title and user id
    else if (!tags) dbQuery = { $and: [{ title: titleRegexp }, { user: userId }] };
    // tags and user id
    else if (!title) dbQuery = { $and: [{ tags: { $in: tags.split(",") } }, { user: userId }] };
    // all 3 given
    else dbQuery = { $and: [{ title: titleRegexp }, { tags: { $in: tags.split(",") } }, { user: userId }] };

    await Post
        .find(dbQuery)
        .then(posts => posts
            ? res.status(200).json(posts)
            : res.status(404).json({ message: "No updated post" }))
        .catch(err => {
            console.error(err);
            console.log("here is errr");
            res.status(409).json({ message: "There was an error while fetching the post." });
        });
}