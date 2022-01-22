import { object, string } from "yup";

export const leadSchema = object({
  body: object({
    name: string()
      .required("Name is Required.")
      .trim()
      .min(4, "Title must be minimum 4 characters")
      .max(80, "Title must be miximum 80 characters"),
    email: string()
      .trim()
      .required("Email is Required.")
      .email("Must be a valid email."),
    message: string().trim().required("Message is Required."),
    purpose: string().trim().required("Purpose is Required."),
  }),
});
