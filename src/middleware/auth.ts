import { Request, Response } from "express"
import { Types } from "mongoose";
import User from "../database/models/User";

export const isLoggedIn = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

export const userExists = async (username: string | undefined, email: string | undefined): Promise<boolean> => {
    // return await User
    //     .findOne({ $or: [{ email }, { username }] })
    //     .then(user => user ? true : false)
    //     .catch(err => {
    //         console.error(err)
    //         return true;
    //     });
    return await User.exists({ $or: [{ email }, { username }] })
        .catch(err => {
            console.error(err);
            return true;
        })
}