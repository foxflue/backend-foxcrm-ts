import { object, string } from "yup";

export const postSchema = object({
  body: object({
    title: string()
      .trim()
      .required("Title is required.")
      .min(2, "Title must be minimum 2 characters")
      .max(255, "Title must be miximum 255 characters"),
    content: string().trim().required("Content is required."),
  }),
});
