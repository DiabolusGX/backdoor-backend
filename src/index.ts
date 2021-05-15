import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import config from "./configs/config";

import postRoutes from "./routes/posts";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": true }));

app.use("/posts", postRoutes);

// start database connection and server
const port = config.server.port;
mongoose
    .connect(config.mongo.url, config.mongo.options)
    .then(result => {
        app.listen(port, () => {
            console.log(`Server running on port : ${port}`);
        });
        console.log(`Connected to ${result.connections[0].name} databse.`);
    })
    .catch(err => console.error(err));