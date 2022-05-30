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
exports.loginWithFacebook = void 0;
const axios_1 = __importDefault(require("axios"));
const AppError_utils_1 = require("../AppError.utils");
const upsertUser_1 = require("./upsertUser");
const loginWithFacebook = (code, client_id, redirect_uri) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://graph.facebook.com/v6.0/oauth/access_token";
    const values = {
        code: code,
        client_id: client_id,
        redirect_uri: redirect_uri,
        client_secret: Object(process.env).FACEBOOK_CLIENT_SECRET,
    };
    try {
        // 1) Facebook provide a access token
        const response = yield axios_1.default.get(url, { params: values });
        // 2) Send the token to facebook server to user details
        const facebookUser = yield getFacebookUserProfile(response.data.access_token);
        // 3) Check if the user email available
        if (!facebookUser.email && !facebookUser.id) {
            throw new AppError_utils_1.AppError("Unable to create account: Facebook account does not have email", 400);
        }
        return yield (0, upsertUser_1.upsertUser)(facebookUser.id, facebookUser.email, facebookUser.name);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.loginWithFacebook = loginWithFacebook;
const getFacebookUserProfile = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://graph.facebook.com/v6.0/me";
    const headers = {
        Authorization: `Bearer ${accessToken}`,
    };
    try {
        const response = yield axios_1.default.get(url, { headers });
        return response.data;
    }
    catch (error) {
        throw error;
    }
});
