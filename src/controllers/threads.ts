import { Request, Response } from "express";
import { Types } from "mongoose";
import IUser from "../database/interfaces/IUser";
import Thread from "../database/models/Thread";

// get all threads details
export const getAllThreads = async (req: Request, res: Response) => {
    await Thread
        .find()
        .then(threads => res.status(200).json(threads))
        .catch(err => res.status(404).json({ message: err.message }));
}

// get thread details
export const getThread = async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!Types.ObjectId.isValid(id)) return res.status(404).json({ message: `No thread with id: ${id}` });

    await Thread
        .findOne({ _id: id })
        .then(thread => res.status(200).json(thread))
        .catch(err => res.status(404).json({ message: err.message }));
}

// create new thread
export const createThread = async (req: Request, res: Response) => {
    const thread = req.body;
    if((req.user as IUser)?.permission_level < 3) 
        return res.status(401).json({ message: "Unauthorized to create thread" });

    await new Thread({ ...thread, user: (req.user as IUser)?._id })
        .save()
        .then(thread => res.status(200).json(thread))
        .catch(err => res.status(404).json({ message: err.message }));
}