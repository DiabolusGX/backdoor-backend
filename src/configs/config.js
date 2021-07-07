"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// database configs
var MONGO_OPTIONS = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
    useFindAndModify: false
};
var MONGO_USERNAME = process.env.MONGO_USERNAME || "backdoorAdmin";
var MONGO_PASSWORD = process.env.MONGO_PASSWORD || "5%235h%40%26oe4FWd%21DM5QLJoJCquWtzoGk9PFecoS%23%26m%2A%40J%24WU7%26k%40";
var MONGO_HOST = process.env.MONGO_HOST || "backdoor-development.rfqki.mongodb.net";
var MONGO_DB_NAME = process.env.MONGO_DB_NAME || "backdoor";
var MONGO = {
    host: MONGO_HOST,
    username: MONGO_USERNAME,
    password: MONGO_PASSWORD,
    options: MONGO_OPTIONS,
    url: "mongodb+srv://" + MONGO_USERNAME + ":" + MONGO_PASSWORD + "@" + MONGO_HOST + "/" + MONGO_DB_NAME
};
// Secret used to encrypt cookies using client-sessions
var SESSIONS = {
    secret: "#b5Sf^j$Sp4LuF&&fagSa@iRLwr@qozjZYxgYE*#$&$8!TU7wc"
};
// server configs
var SERVER_PORT = process.env.SERVER_PORT || 4000;
var SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
var SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT
};
// client settings
var CLIENT_PORT = process.env.SERVER_PORT || 4000;
var CLIENT_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
var CLIENT = {
    hostname: CLIENT_HOSTNAME,
    port: CLIENT_PORT
};
// final config to export
var config = {
    mongo: MONGO,
    server: SERVER,
    client: CLIENT,
    sessions: SESSIONS,
    production: false
};
exports.default = config;
