"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadSchema = void 0;
const yup_1 = require("yup");
exports.leadSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        name: (0, yup_1.string)()
            .required("Name is Required.")
            .trim()
            .min(4, "Title must be minimum 4 characters")
            .max(80, "Title must be miximum 80 characters"),
        email: (0, yup_1.string)()
            .trim()
            .required("Email is Required.")
            .email("Must be a valid email."),
        message: (0, yup_1.string)().trim().required("Message is Required."),
        purpose: (0, yup_1.string)().trim().required("Purpose is Required."),
    }),
});
