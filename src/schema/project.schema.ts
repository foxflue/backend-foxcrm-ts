import { number, object, string } from "yup";

export const projectSchema = object({
  body: object({
    title: string()
      .required("Title is required.")
      .trim()
      .min(2, "Title must be minimum 2 characters")
      .max(255, "Title must be miximum 255 characters"),
    content: string().trim().required("Content is required."),
    price: number().required("Price is Required."),
  }),
});
