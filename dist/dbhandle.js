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
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class Handler {
    constructor() {
        this.URI = process.env.URI;
        this.DB_NAME = process.env.DB_NAME;
        this.client = new mongodb_1.MongoClient(this.URI, {
            serverApi: {
                version: mongodb_1.ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
            tls: true,
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.close();
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    readData(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = this.client.db(this.DB_NAME);
                const coll = db.collection(collection);
                const res = coll.find().toArray();
                return res;
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    writeData(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = this.client.db(this.DB_NAME);
                const coll = db.collection(params.collection);
                yield coll.insertOne(params.data);
                return true;
            }
            catch (e) {
                console.log(e);
                return false;
            }
        });
    }
    deleteEntry(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = this.client.db(this.DB_NAME);
                const coll = db.collection(params.collection);
                yield coll.deleteOne(params.query);
                return true;
            }
            catch (e) {
                // console.log(e);
                return false;
            }
        });
    }
    UpdateOne(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const db = this.client.db(this.DB_NAME);
                const coll = db.collection(params.collection);
                yield coll.updateOne(params.query, {
                    $set: params.newData,
                });
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.default = Handler;
