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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const passwordEncrypt_utils_1 = require("../utils/passwordEncrypt.utils");
const UserSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: [true, "Email address is already in use"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
    },
    password: {
        type: String,
        select: false,
    },
    oauth_id: {
        type: String,
    },
    two_fa: {
        mode: Boolean,
        base32: String,
    },
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Organization",
    },
    company: {
        type: String,
    },
    address: {
        address_line1: {
            type: String,
            trim: true,
        },
        address_line2: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
        },
        city: {
            type: String,
        },
        zipcode: {
            type: Number,
        },
    },
    roles: {
        type: [String],
        enum: ["user", "employee", "manager", "admin", "superadmin"],
        default: ["user"],
    },
    verification_token: {
        type: String,
    },
    verification_expiring_at: {
        type: Date,
    },
    reset_token: {
        type: String,
    },
    reset_expiring_at: {
        type: Date,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});
UserSchema.index({ email: 1 });
// Virtual populate for Projects
UserSchema.virtual("projects", {
    ref: "Project",
    localField: "_id",
    foreignField: "customer",
});
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = this;
        // only hash the password if it has been modified (or is new)
        if (!user.isModified("password"))
            return next();
        // hash password
        user.password = yield (0, passwordEncrypt_utils_1.encryptedPassword)(user.password);
        next();
    });
});
exports.User = (0, mongoose_1.model)("User", UserSchema);
