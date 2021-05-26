import { Request, Response } from "express";
import { Types } from "mongoose";
import IUser from "../database/interfaces/IUser";
import Thread from "../database/models/Thread";

// get all threads details
export const getAllThreads = async (req: Request, res: Response) => {
    await Thread
        .find()
        .then(threads => res.status(200).json(threads))
        .catch(err => {
            console.log(err);
            res.status(404).json({ message: "There was an error while fetching threads." })
        });
}

// get thread details
export const getThread = async (req: Request, res: Response) => {
    const title = req.params.title;

    await Thread
        .findOne({ title })
        .then(thread => res.status(200).json(thread))
        .catch(err => {
            console.log(err);
            res.status(404).json({ message: "There was an error." })
        });
}

// create new thread
export const createThread = async (req: Request, res: Response) => {
    const thread = req.body;
    if ((req.user as IUser)?.permissionLevel < 3)
        return res.status(401).json({ message: "You do not have the permission to create a thread." });

    await new Thread({ ...thread, user: (req.user as IUser)?._id })
        .save()
        .then(thread => res.status(200).json({ message: "Thread created successfully" }))
        .catch(err => {
            console.log(err);
            res.status(404).json({ message: "There was an error while creating the thread." })
        });
}