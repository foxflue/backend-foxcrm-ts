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
exports.VerifySecret = exports.SetTwoFA = exports.OAuthLogin = exports.UpdatePassword = exports.DeleteFakeAccount = exports.UserResetPassword = exports.UserForgotPassword = exports.ResendEmailForVerify = exports.UserEmailVerification = exports.LoginUser = exports.createUser = void 0;
const lodash_1 = require("lodash");
const speakeasy_1 = __importDefault(require("speakeasy"));
const AppError_utils_1 = require("../utils/AppError.utils");
const github_oauth_1 = require("../utils/OAuth/github.oauth");
const passwordEncrypt_utils_1 = require("../utils/passwordEncrypt.utils");
const user_model_1 = require("./../model/user.model");
const hashString_utils_1 = require("./../utils/hashString.utils");
const jwtHelper_utils_1 = __importDefault(require("./../utils/jwtHelper.utils"));
const facebook_oauth_1 = require("./../utils/OAuth/facebook.oauth");
const google_oauth_1 = require("./../utils/OAuth/google.oauth");
function createUser(input) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const verificationToken = yield (0, hashString_utils_1.hashString)();
            input.verification_token = yield (0, hashString_utils_1.encryptedRandomString)(verificationToken);
            input.verification_expiring_at = Date.now() + 10 * 60 * 60 * 1000;
            const user = yield user_model_1.User.create(input);
            if (!user) {
                throw new AppError_utils_1.AppError("Something goes wrong, try again.", 500);
            }
            return {
                user: (0, lodash_1.omit)(user.toJSON(), "password", "createdAt", "updatedAt", "__v"),
                verificationToken,
            };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createUser = createUser;
function LoginUser({ email, password, rememberme, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = (yield user_model_1.User.findOne({ email }).select("+password"));
            if (!user ||
                !user.password ||
                !(yield (0, passwordEncrypt_utils_1.comparePassword)(password, user.password))) {
                throw new AppError_utils_1.AppError("Invalid credentials!", 401);
            }
            if (user.verification_token || user.verification_expiring_at) {
                throw new AppError_utils_1.AppError("Please verify your email, or resend email verification request.", 400);
            }
            if (user.two_fa.mode && user.two_fa.base32) {
                const secretToken = speakeasy_1.default.totp({
                    secret: user.two_fa.base32,
                    encoding: "base32",
                });
                return {
                    user,
                    token: undefined,
                    secretToken,
                };
            }
            // Create token
            const token = yield jwtHelper_utils_1.default.signToken({
                id: user.id,
                rememberme: rememberme || false,
            });
            return {
                user: (0, lodash_1.omit)(user.toJSON(), "password", "createdAt", "updatedAt", "__v", "two_fa"),
                token,
                secretToken: undefined,
            };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.LoginUser = LoginUser;
function UserEmailVerification(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findOne({
                verification_token: yield (0, hashString_utils_1.encryptedRandomString)(token),
                verification_expiring_at: { $gt: Date.now() },
            });
            if (!user) {
                throw new AppError_utils_1.AppError("Your verification token is either expired or invalid or you are already verified.", 400);
            }
            user.verification_token = undefined;
            user.verification_expiring_at = undefined;
            yield user.save();
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.UserEmailVerification = UserEmailVerification;
function ResendEmailForVerify({ email, password, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = (yield user_model_1.User.findOne({ email }).select("+password"));
            if (!user || !(yield (0, passwordEncrypt_utils_1.comparePassword)(password, user.password))) {
                throw new AppError_utils_1.AppError("Invalid credentials!", 401);
            }
            const verificationToken = yield (0, hashString_utils_1.hashString)();
            user.verification_token = yield (0, hashString_utils_1.encryptedRandomString)(verificationToken);
            user.verification_expiring_at = Date.now() + 10 * 60 * 60 * 1000;
            yield user.save();
            return { user, verificationToken };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.ResendEmailForVerify = ResendEmailForVerify;
function UserForgotPassword(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = (yield user_model_1.User.findOne(query));
            if (!user) {
                throw new AppError_utils_1.AppError(`The user is not registered with us`, 404);
            }
            if (user.verification_token || user.verification_expiring_at) {
                throw new AppError_utils_1.AppError("Please Verify your email.", 405);
            }
            const verificationToken = yield (0, hashString_utils_1.hashString)();
            user.reset_token = yield (0, hashString_utils_1.encryptedRandomString)(verificationToken);
            user.reset_expiring_at = Date.now() + 20 * 60 * 1000; // 20 Minutes
            yield user.save();
            return { user, verificationToken };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.UserForgotPassword = UserForgotPassword;
function UserResetPassword({ token, password, passwordConfirm, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (password !== passwordConfirm) {
                throw new AppError_utils_1.AppError("Password dosen't match", 400);
            }
            const user = yield user_model_1.User.findOne({
                reset_token: yield (0, hashString_utils_1.encryptedRandomString)(token),
                reset_expiring_at: {
                    $gt: Date.now(),
                },
            });
            if (!user) {
                throw new AppError_utils_1.AppError(`The verification code is either wrong or expired. Please try again`, 403);
            }
            user.reset_token = undefined;
            user.reset_expiring_at = undefined;
            user.password = password;
            yield user.save();
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.UserResetPassword = UserResetPassword;
function DeleteFakeAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield user_model_1.User.deleteMany({
                verification_token: { $ne: undefined },
                verification_expiring_at: {
                    $gt: new Date().getTime() - 1000 * 60 * 60 * 24 * 10,
                },
            });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.DeleteFakeAccount = DeleteFakeAccount;
function UpdatePassword({ id, oldPassword, password, passwordConfirm, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (password !== passwordConfirm) {
                throw new AppError_utils_1.AppError("Password should be match.", 400);
            }
            const user = yield user_model_1.User.findById(id).select("+password");
            if (!user || !(yield (0, passwordEncrypt_utils_1.comparePassword)(oldPassword, user.password))) {
                throw new AppError_utils_1.AppError("Invalid Credentials.", 400);
            }
            user.password = password;
            yield user.save();
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.UpdatePassword = UpdatePassword;
function OAuthLogin({ id, code, client_id, redirect_uri, }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user;
            switch (id) {
                case "google":
                    user = (yield (0, google_oauth_1.loginWithGoogle)(code, client_id, redirect_uri));
                    break;
                case "facebook":
                    user = (yield (0, facebook_oauth_1.loginWithFacebook)(code, client_id, redirect_uri));
                    break;
                case "github":
                    user = (yield (0, github_oauth_1.loginWithGithub)(code, client_id, redirect_uri));
                    break;
            }
            if (!user) {
                throw new AppError_utils_1.AppError("Unable to create account", 406);
            }
            // Generate JWT Token
            const token = yield jwtHelper_utils_1.default.signToken({ id: user.id, rememberme: true });
            return token;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.OAuthLogin = OAuthLogin;
function SetTwoFA({ id, mode }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let user = (yield user_model_1.User.findById(id));
            if (mode) {
                user.two_fa.base32 = yield speakeasy_1.default.generateSecret().base32;
                user.two_fa.mode = true;
            }
            else {
                user.two_fa.base32 = undefined;
                user.two_fa.mode = false;
            }
            yield user.save();
            return;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.SetTwoFA = SetTwoFA;
function VerifySecret(id, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield user_model_1.User.findById(id);
            if (!user || !user.two_fa.base32) {
                throw new AppError_utils_1.AppError("Invalid Request.", 406);
            }
            const isValid = speakeasy_1.default.totp.verify({
                secret: user.two_fa.base32,
                encoding: "base32",
                token: otp,
                window: 6,
            });
            if (!isValid) {
                throw new AppError_utils_1.AppError("Invalid Input.", 406);
            }
            const token = jwtHelper_utils_1.default.signToken({ id: user.id, rememberme: false });
            return {
                user: (0, lodash_1.omit)(user.toJSON(), "password", "createdAt", "updatedAt", "__v", "two_fa"),
                token,
            };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.VerifySecret = VerifySecret;
