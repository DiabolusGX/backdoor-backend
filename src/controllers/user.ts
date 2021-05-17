import { Request, Response } from "express";
import userModel from "../database/models/userModel";

// create new user and return user data
export const googleSignup = async (req: Request, res: Response) => {
    const { username, bio, profile } = req.body;

    // await userModel
    //     .findOne({ $or:[ {email:profile.email}, {username: username} ] })
    //     .then(user => user
    //             ? res.status(409).json({ message: "User already exists with that email or username." })
    //             : null)
    //     .catch(err => res.status(409).json({ message: err.message, error: err }));

    const user = {
        email: profile.email,
        verified: profile.email_verified,
        username,
        bio,
        picture: profile.picture
    }

    await new userModel(user)
        .save()
        .then(newUser => res.status(201).json(newUser))
        .catch(err => res.status(409).json({ message: err.message, error: err }));
}

// login user with given email id and return user data
export const googleLogin = async (req: Request, res: Response) => {
    const { email } = req.body;

    await userModel.findOne({ email: email })
        .then(user => res.status(200).json(user))
        .catch(err => res.status(409).json({ message: err.message, error: err }));
}

// get user data with valied query like email, username or document id
export const getUser = async (req: Request, res: Response) => {
    const query = req.query;

    await userModel.findOne( query )
        .then(user => user 
            ? res.status(200).json(user)
            : res.status(404).json({ message: "no user found" }))
        .catch(err => res.status(404).json({ message: err.message, error: err }));
}

// update user data using document id and return new user data
export const updateUser = async (req: Request, res: Response) => {
    const { _id, user } = req.body;

    await userModel.findOneAndUpdate({ _id: _id }, { $set: user }, { new: true })
        .then(updtedUser => updtedUser
            ? res.status(200).json(updtedUser)
            : res.status(409).json({ message: "no updated user found`" }))
        .catch(err => res.status(409).json({ message: err.message, error: err }));
}