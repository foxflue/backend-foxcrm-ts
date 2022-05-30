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
exports.loginWithGoogle = void 0;
const axios_1 = __importDefault(require("axios"));
const AppError_utils_1 = require("../AppError.utils");
const upsertUser_1 = require("./upsertUser");
const loginWithGoogle = (code, client_id, redirect_uri) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code: code,
        client_id: client_id,
        redirect_uri: redirect_uri,
        client_secret: Object(process.env).GOOGLE_CLIENT_SECRET,
        grant_type: "authorization_code",
    };
    try {
        // 1) Google provide a access_token
        const response = yield axios_1.default.post(url, values);
        // 2) Send the token to google server to get user details
        const googleUser = yield getGoogleUserProfile(response.data.access_token);
        // 3) Check email available or not
        if (!googleUser.email_verified) {
            throw new AppError_utils_1.AppError("Unable to create account: Unverified google account", 406);
        }
        return yield (0, upsertUser_1.upsertUser)(googleUser.sub, googleUser.email, googleUser.name);
    }
    catch (error) {
        throw error;
    }
});
exports.loginWithGoogle = loginWithGoogle;
const getGoogleUserProfile = (accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    const url = "https://www.googleapis.com/oauth2/v3/userinfo";
    const values = {
        access_token: accessToken,
    };
    try {
        const response = yield axios_1.default.get(url, { params: values });
        return response.data;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
