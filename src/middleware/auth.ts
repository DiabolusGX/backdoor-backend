import { Request, Response } from "express"
import User from "../database/models/User";
import passport from "passport";

export const isLoggedIn = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) return next();
    else res.status(401).json({ message: "Login to perform this action!" });
}

// passport login middleware
export const loginMiddleware = passport.authenticate("local");

export const userExists = async (username: string | undefined, email: string | undefined): Promise<boolean> => {
    return await User.exists({ $or: [{ email }, { username }] })
        .catch(err => {
            console.error(err);
            return true;
        });
}