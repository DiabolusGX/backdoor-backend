import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import config from "./configs/config";
import bcrypt from 'bcryptjs';

import postRoutes from "./routes/posts";
import userRoutes from "./routes/user";
import threadRoutes from "./routes/threads";

import User from "./database/models/User";

import passport from "passport";
const LocalStrategy = require("passport-local").Strategy;
import sessions from "client-sessions";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": true }));

app.use(sessions({
    cookieName: "session", // cookie name dictates the key name added to the request object
    secret: config.sessions.secret, // should be a large unguessable string
    duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
    activeDuration: 1000 * 60 * 5, // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    cookie: {
        httpOnly: true, // Cookie is not accessible from javascript
        // @ts-expect-error
        ephemeral: true, // Exit session when browser closes
        secure: config.production // Only allow through SSL
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Configure passport sessions
passport.serializeUser((user: any, done: any) => {
    done(null, user.id);
});

passport.deserializeUser((id: any, done: any) => {
    User.findById(id, (err: any, user: any) => {
        done(err, user);
    });
});

app.use("/posts", postRoutes);
app.use("/user", userRoutes);
app.use("/threads", threadRoutes);

// Configure the passport LocalStrategy
passport.use(new LocalStrategy(
    (username: string, password: string, done: any) => {
        User.findOne({ $or: [{ email: username }, { username }] }, (err: any, user: any) => {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Either the username or the passport is incorrect.' });
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return done(null, false, { message: 'Either the username or the passport is incorrect.' });
            }
            return done(null, user);
        });
    }
));

// start database connection and server
const port = config.server.port;
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then(result => {
        app.listen(port, () => {
            console.log(`Server running on port : ${port}`);
        });
        console.log(`Connected to ${result.connections[0].name} database.`);
    })
    .catch(err => console.error(err));