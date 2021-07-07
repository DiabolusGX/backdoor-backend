"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var mongoose_1 = __importDefault(require("mongoose"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
// import config from "./configs/config";
var posts_1 = __importDefault(require("./routes/posts"));
var comments_1 = __importDefault(require("./routes/comments"));
var user_1 = __importDefault(require("./routes/user"));
var threads_1 = __importDefault(require("./routes/threads"));
var User_1 = __importDefault(require("./database/models/User"));
var passport_1 = __importDefault(require("passport"));
var LocalStrategy = require("passport-local").Strategy;
var client_sessions_1 = __importDefault(require("client-sessions"));
var helmet_1 = __importDefault(require("helmet"));
var path_1 = __importDefault(require("path"));
var app = express_1.default();
app.use(helmet_1.default());
app.use(express_1.default.json());
// app.use(
//     cors({
//         origin: `http://${
//             process.env.CLIENT_HOSTNAME || config.client.hostname
//         }:${process.env.CLIENT_PORT || config.client.port}`,
//         credentials: true,
//     })
// );
app.use(client_sessions_1.default({
    cookieName: "session",
    secret: process.env.CLIENT_SECRET || "",
    duration: 24 * 60 * 60 * 1000,
    activeDuration: 1000 * 60 * 5,
    cookie: {
        httpOnly: true,
        ephemeral: true,
        secureProxy: true
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Configure passport sessions
passport_1.default.serializeUser(function (user, done) { return done(null, user.id); });
passport_1.default.deserializeUser(function (id, done) {
    User_1.default.findById(id, function (err, user) { return done(err, user); });
});
// Routes
app.use("/posts", posts_1.default);
app.use("/comments", comments_1.default);
app.use("/user", user_1.default);
app.use("/threads", threads_1.default);
// Serve static files
app.use(express_1.default.static(__dirname + "/../build"));
app.get("*", function (request, response) {
    response.sendFile(path_1.default.resolve(__dirname, "../build", "index.html"));
});
// Configure the passport LocalStrategy
passport_1.default.use(new LocalStrategy(function (username, password, done) {
    User_1.default.findOne({ $or: [{ email: username }, { username: username }] }, function (err, user) {
        if (err)
            return done(err);
        if (!user)
            return done(null, false, {
                message: "Either the username or the passport is incorrect.",
            });
        if (!bcryptjs_1.default.compareSync(password, user.password))
            return done(null, false, {
                message: "Either the username or the passport is incorrect.",
            });
        return done(null, user);
    });
}));
// start database connection and server
var port = process.env.PORT || "4000";
mongoose_1.default
    .connect(process.env.MONGO_URL || "", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    useFindAndModify: false,
})
    .then(function (result) {
    app.listen(port, function () {
        console.log("Server running on port : " + port);
    });
    console.log("Connected to " + result.connections[0].name + " database.");
})
    .catch(function (err) { return console.error(err); });
