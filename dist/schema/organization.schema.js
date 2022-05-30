"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.organizationSchema = void 0;
const yup_1 = require("yup");
exports.organizationSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        title: (0, yup_1.string)()
            .required("Title is required.")
            .trim()
            .min(4, "Title must be minimum 4 characters")
            .max(30, "Title must be miximum 30 characters"),
        email: (0, yup_1.string)()
            .required("Email is required.")
            .trim()
            .email("Must be a valid email."),
        phone: (0, yup_1.string)().required("Contact number is required.").trim(),
        type: (0, yup_1.string)().required("Type is required.").trim(),
    }),
});
