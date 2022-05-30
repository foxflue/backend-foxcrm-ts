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
exports.upsertUser = void 0;
const user_model_1 = require("../../model/user.model");
// Upsert User
const upsertUser = (oauth_id, email, name) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    user = yield user_model_1.User.findOne({ email });
    // If User dosen't exist, create new user
    if (!user) {
        user = yield user_model_1.User.create({
            name,
            email,
            oauth_id,
        });
        return user;
    }
    // If User exist, and oauthId is not set, update oauthId
    if (!user.oauth_id) {
        user.oauth_id = oauth_id;
        yield user.save();
        return user;
    }
    // If User exist, and oauthId is set, match oauthId return user
    if (user.oauth_id !== oauth_id) {
        return false;
    }
    return user;
});
exports.upsertUser = upsertUser;
