import { Request, Response } from "express";
import postModel from "../database/models/postModel";

export const getPost = async (req: Request, res: Response) => {
    await postModel
        .find()
        .then(posts => res.status(200).json(posts))
        .catch(err => res.status(404).json({ message: err.message, error: err }));
}

export const createPost = async (req: Request, res: Response) => {
    const post = req.body;

    await new postModel(post)
        .save()
        .then(newPost => res.status(201).json(newPost))
        .catch(err => res.status(409).json({ message: err.message, error: err }));
}