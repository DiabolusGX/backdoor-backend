import { Request, Response } from "express";
import userModel from "../database/models/userModel";

export const createUser = (req: Request, res: Response): void => {
    const post = req.body;
    const newPost = new userModel(post);

    try {
        newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        res.status(409).json({ message: err.message, error: err });
    }
}