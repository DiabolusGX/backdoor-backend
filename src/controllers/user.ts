import { Request, Response } from "express";
import User from "../database/models/User";
import bcrypt from "bcryptjs";

import { userExists } from '../middleware/auth';
import IUser from "../database/interfaces/IUser";
import { Types } from "mongoose";

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
            id: (req.user as IUser)._id,
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
            id: (req.user as IUser)._id,
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
    const userId = (req.user as IUser)?._id;

    await User
        .findOne({ username })
        .then(user => {
            if (userId?.toString() === user?._id.toString()) {
                // @ts-expect-error
                const { password, ...sendData }: any = user._doc;
                return res.status(200).json(sendData);
            }
            else {
                // @ts-expect-error
                const { password, email_verified, email, ...sendData }: any = user._doc;
                return res.status(200).json(sendData);
            }
        })
        .catch(err => {
            console.error(err);
            res.status(404).json({ message: err.message });
        });
}

// get username with user id
export const getUsername = async (req: Request, res: Response) => {
    const userId = req.query.userId as string;
    if (!Types.ObjectId.isValid(userId)) return res.status(404).json({ message: `No user found with id : ${userId}` });

    await User
        .findOne({ _id: userId })
        .then(user => res.status(200).json({ username: user?.username }))
        .catch(err => {
            console.log(err);
            res.status(404).json({ message: "Something went wrong." })
        });
}

// update user data using user document id and return new user data
export const updateUser = async (req: Request, res: Response) => {
    const { newUserData } = req.body;
    const id = (req.user as IUser)?._id;

    await User.findById(id)
        .then(async user => {
            if (id != user?._id) return res.status(401).json({ message: `You're not authorized to access to do that.` });
            await User
                .findOneAndUpdate({ _id: id }, {
                    $set: { ...newUserData, bio: newUserData.bio.substring(0, 150) }
                }, { new: true })
                .then(updatedUser => {
                    // @ts-expect-error
                    const { password, ...sendData }: any = updatedUser._doc;
                    res.status(200).json(sendData)
                })
        })
        .catch(err => res.status(404).json({ message: err.message }));
}