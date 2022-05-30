"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = void 0;
const yup_1 = require("yup");
exports.postSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        title: (0, yup_1.string)()
            .trim()
            .required("Title is required.")
            .min(2, "Title must be minimum 2 characters")
            .max(255, "Title must be miximum 255 characters"),
        content: (0, yup_1.string)().trim().required("Content is required."),
    }),
});
