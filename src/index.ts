require("dotenv").config();
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// import config from "./configs/config";

import postRoutes from "./routes/posts";
import commentRoutes from "./routes/comments";
import userRoutes from "./routes/user";
import threadRoutes from "./routes/threads";

import User from "./database/models/User";
import IUser from "./database/interfaces/IUser";

import passport from "passport";
const LocalStrategy = require("passport-local").Strategy;
import sessions from "client-sessions";
import bodyParser from "body-parser";
import helmet from "helmet";
import path from "path";

const app = express();

app.use(bodyParser());
app.use(helmet({ contentSecurityPolicy: false }));

app.use(
    sessions({
        cookieName: "session", // cookie name dictates the key name added to the request object
        secret: process.env.CLIENT_SECRET || "", // should be a large unguessable string
        duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
        activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
        cookie: {
            httpOnly: true, // Cookie is not accessible from javascript
            ephemeral: true, // Exit session when browser closes
            secureProxy: true, // for heroku
            // secure: true, // Only allow through SSL
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Configure passport sessions
passport.serializeUser((user: any, done: any) => done(null, user.id));
passport.deserializeUser((id: any, done: any) => {
    User.findById(id, (err: any, user: IUser) => done(err, user));
});

// Configure the passport LocalStrategy
passport.use(
    new LocalStrategy((username: string, password: string, done: any) => {
        User.findOne(
            { $or: [{ email: username }, { username }] },
            (err: any, user: IUser) => {
                if (err) return done(err);
                if (!user)
                    return done(null, false, {
                        message:
                            "Either the username or the passport is incorrect.",
                    });
                if (!bcrypt.compareSync(password, user.password))
                    return done(null, false, {
                        message:
                            "Either the username or the passport is incorrect.",
                    });
                return done(null, user);
            }
        );
    })
);

// Routes
app.use("/psts", postRoutes);
app.use("/cmts", commentRoutes);
app.use("/usr", userRoutes);
app.use("/thrd", threadRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "/../build")));
app.get("/", (_request, response) => {
    console.log(path.join(__dirname, "/", "../build", "index.html"));
    response.sendFile(path.join(__dirname, "/", "../build", "index.html"));
});

// start database connection and server
const port = process.env.PORT || "4000";
mongoose
    .connect(process.env.MONGO_URL || "", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        autoIndex: true,
        useFindAndModify: false,
    })
    .then((result) => {
        app.listen(port, () => {
            console.log(`Server running on port : ${port}`);
        });
        console.log(`Connected to ${result.connections[0].name} database.`);
    })
    .catch((err) => console.error(err));
