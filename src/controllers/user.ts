import { Request, Response } from "express";
import User from "../database/models/User";
import bcrypt from "bcryptjs";

import { userExists } from '../middleware/auth';
import IUser from "../database/interfaces/IUser";

export const signup = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    const hash = bcrypt.hashSync(password, 14);

    if (await userExists(username, email)) {
        return res.status(409).json({ message: "Username or email already taken" });
    }

    const user = {
        email,
        username,
        password: hash
    }

    await new User(user)
        .save()
        .then(newUser => res.status(201).json({ message: "Registration Successful" }))
        .catch(err => res.status(409).json({ message: err.message }));
}

export const login = async (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.status(200).json({
            message: "Login Successful",
            username: (req.user as IUser).username,
            permissionLevel: (req.user as IUser).permissionLevel
        });
    }
}

export const logout = async (req: Request, res: Response) => {
    req.logOut();
    res.status(200).json({ message: "Logout Successful" });
}

export const checkAuthenticated = async (req: Request, res: Response) => {
    if (req.isAuthenticated()) {
        res.status(200).json({
            message: "User is authenticated",
            username: (req.user as IUser).username,
            permissionLevel: (req.user as IUser).permissionLevel
        });
    } else {
        res.status(401).json({
            message: "User is not authenticated",
        })
    }
}

// create new user and return user data
export const googleSignup = async (req: Request, res: Response) => {
    const { username, bio, profile } = req.body;

    const user = {
        email: profile.email,
        verified: profile.email_verified,
        username,
        bio,
        picture: profile.picture
    }

    await new User(user)
        .save()
        .then(newUser => res.status(201).json(newUser))
        .catch(err => res.status(409).json({ message: err.message }));
}

// login user with given email id and return user data
export const googleLogin = async (req: Request, res: Response) => {
    const { email } = req.body;

    await User
        .findOne({ email: email })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(409).json({ message: err.message }));
}

// get user data with username
export const getUser = async (req: Request, res: Response) => {
    const username = req.params.username;
    const id = (req.user as IUser)?._id;

    await User
        .findOne({ username })
        .then(user => {
            if (id.toString() != user?._id.toString()) return res.status(401).json({ message: `You're not authorized to access to do that.` });
            const sendUser: any = user;
            delete sendUser?.password;
            return res.status(200).json(sendUser);
        })
        .catch(err => res.status(404).json({ message: err.message }));
}

// update user data using user document id and return new user data
export const updateUser = async (req: Request, res: Response) => {
    const { newUserData } = req.body;
    const id = (req.user as IUser)?._id;

    await User.findById(id)
        .then(async user => {
            if (id != user?._id) return res.status(401).json({ message: `You're not authorized to access to do that.` });
            await User
                .findOneAndUpdate({ _id: id }, { $set: newUserData }, { new: true })
                .then(updatedUser => {
                    const sendUser: any = updatedUser;
                    delete sendUser?.password;
                    res.status(200).json(updatedUser)
                })
        })
        .catch(err => res.status(404).json({ message: err.message }));
}