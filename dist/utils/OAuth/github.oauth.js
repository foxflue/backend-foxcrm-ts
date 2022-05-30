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
exports.loginWithGithub = void 0;
const axios_1 = __importDefault(require("axios"));
const AppError_utils_1 = require("../AppError.utils");
const upsertUser_1 = require("./upsertUser");
const loginWithGithub = (code, client_id, redirect_uri) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://github.com/login/oauth/access_token";
    const values = {
        client_id: client_id,
        code: code,
        redirect_uri: redirect_uri,
        client_secret: Object(process.env).GITHUB_CLIENT_SECRET,
    };
    try {
        // 1) Send a request to gitub server to get a access_token
        const response = yield axios_1.default.post(url, values, {
            headers: {
                Accept: "application/json",
            },
        });
        // 2) Send the access_token to github server to get user details
        const githubUser = yield githubUserDetails(response.data.access_token);
        // 3) If there email exist on user account
        if (!githubUser.email) {
            throw new AppError_utils_1.AppError("Unable to create account: Unverified amazon account", 406);
        }
        return yield (0, upsertUser_1.upsertUser)(githubUser.id, githubUser.email, githubUser.name);
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
exports.loginWithGithub = loginWithGithub;
const githubUserDetails = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://api.github.com/user";
    try {
        const response = yield axios_1.default.get(url, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
        };
    }
    catch (err) {
        console.log(err);
        throw err;
    }
});
