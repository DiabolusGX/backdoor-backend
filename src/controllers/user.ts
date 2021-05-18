import { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../database/models/User";
import bcrypt from "bcryptjs";
import passport from "passport";

import { userExists } from '../middleware/auth';

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

    // TODO: Send a different response on success. One that doesn't have the hash.
    await new User(user)
        .save()
        .then(newUser => {
            res.status(200).json(newUser)
        })
        .catch(err => {
            console.log(err);
        });
}

export const login = async (req: Request, res: Response) => {
    if(req.isAuthenticated()) res.status(200).json({ message: "login successful" });
    else res.status(401).json({ message: "login un-successful" });
}

export const logout = async (req: Request, res: Response) => {
    console.log(req.headers);
    req.logOut();
    res.status(200).json({ message: "logout successful" });
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
        .catch(err => res.status(409).json({ message: err.message, error: err }));
}

// login user with given email id and return user data
export const googleLogin = async (req: Request, res: Response) => {
    const { email } = req.body;

    await User
        .findOne({ email: email })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(409).json({ message: err.message, error: err }));
}

// get user data with valied query like email, username or document id
export const getUser = async (req: Request, res: Response) => {
    const query = req.query;

    await User
        .findOne(query)
        .then(user => user
            ? res.status(200).json(user)
            : res.status(404).json({ message: "no user found" }))
        .catch(err => res.status(404).json({ message: err.message, error: err }));
}

// update user data using user document id and return new user data
export const updateUser = async (req: Request, res: Response) => {
    const { _id, user } = req.body;
    if (!Types.ObjectId.isValid(_id)) return res.status(404).json({ message: `No user with id: ${_id}` });

    await User
        .findOneAndUpdate({ _id }, { $set: user }, { new: true })
        .then(updtedUser => updtedUser
            ? res.status(200).json(updtedUser)
            : res.status(409).json({ message: "no updated user found" }))
        .catch(err => res.status(409).json({ message: err.message, error: err }));
}