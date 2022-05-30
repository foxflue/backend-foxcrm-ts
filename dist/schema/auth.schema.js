"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPasswordSchema = exports.userDetailsSchema = void 0;
const yup_1 = require("yup");
exports.userDetailsSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        name: (0, yup_1.string)()
            .required("Name is required.")
            .trim()
            .min(4, "Title must be minimum 4 characters")
            .max(24, "Title must be miximum 24 characters"),
        email: (0, yup_1.string)()
            .trim()
            .required("Email is required.")
            .email("Must be a valid Email."),
        phone: (0, yup_1.string)().required("Phone is required."),
    }),
});
exports.userPasswordSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        password: (0, yup_1.string)()
            .trim()
            .required("Password is required.")
            .matches(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/, "Password must contain at least 8 characters, one uppercase, one number and one special case character"),
        passwordConfirm: (0, yup_1.string)()
            .trim()
            .required("Password Confirm is required.")
            .oneOf([(0, yup_1.ref)("password")], "Passwords don't match."),
    }),
});
