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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const redis_1 = require("redis");
// const redisPort = process.env.REDIS_PORT || 6379;
// const redisHost = process.env.REDIS_HOST;
const client = (0, redis_1.createClient)();
client.connect();
const exec = mongoose_1.Query.prototype.exec;
mongoose_1.Query.prototype.exec = function () {
    return __awaiter(this, arguments, void 0, function* () {
        // 1)Create a  key
        const key = JSON.stringify(Object.assign({}, this.getQuery(), {
            collection: this.model.collection.collectionName,
        }));
        // 2)Search the value of the key is available inside the redis
        const cacheValue = yield client.get(key);
        // 3)If found send it as a mongoose model, which can perform all the mongoose operations
        if (cacheValue) {
            const result = JSON.parse(cacheValue);
            return Array.isArray(result)
                ? result.map((doc) => new this.model(doc))
                : new this.model(result);
        }
        // 4)Otherwise send the request to the mongodb database
        const result = yield exec.apply(this, arguments);
        client.set(key, JSON.stringify(result));
        return result;
    });
};
