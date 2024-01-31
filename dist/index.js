"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const dbhandle_1 = __importDefault(require("./dbhandle"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const dbhandle = new dbhandle_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors());
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield dbhandle.readData("users");
        res.json(data);
    }
    catch (e) {
        res.json({ status: 418 });
    }
}));
app.post("/users/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (data.username.length < 2 || !emailRegex.test(data.email)) {
        return res
            .json({
            message: "Bad Request",
            code: 400,
        })
            .status(400);
    }
    if (yield dbhandle.writeData({ collection: "users", data: Object.assign({}, data) })) {
        res.json({ message: "OK", code: 200 });
    }
    else
        res.json({ message: "something went wrong", code: 418 }).status(418);
}));
app.delete("/users/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = req.body;
    if (((_a = data.username) === null || _a === void 0 ? void 0 : _a.length) < 2) {
        res.json({ message: "Bad Request", code: 400 }).status(400);
    }
    if (yield dbhandle.deleteEntry({ collection: "users", query: Object.assign({}, data) })) {
        res.json({ code: 200, message: "ok" });
    }
    else
        res.json({ code: 418, message: "something went wrong" }).status(418);
}));
app.put("/users/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const data = req.body;
    if (((_b = data.username) === null || _b === void 0 ? void 0 : _b.length) < 2) {
        res.json({ message: "Bad Request", code: 400 }).status(400);
    }
    if (yield dbhandle.UpdateOne({
        collection: "users",
        query: { username: data.username },
        newData: data,
    })) {
        res.json({ code: 200, message: "ok" });
    }
    else
        res.json({ code: 418, message: "something went wrong" }).status(418);
}));
const server = app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    if (yield dbhandle.connect()) {
        console.log("Connected to Mongodb server...");
    }
    else {
        console.log("Failed to connect");
    }
}));
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    dbhandle.disconnect();
    console.log("disconnected");
    process.exit(0);
}));
