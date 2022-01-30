import { object, string } from "yup";

export const organizationSchema = object({
  body: object({
    title: string()
      .required("Title is required.")
      .trim()
      .min(4, "Title must be minimum 4 characters")
      .max(30, "Title must be miximum 30 characters"),
    email: string()
      .required("Email is required.")
      .trim()
      .email("Must be a valid email."),
    phone: string().required("Contact number is required.").trim(),
    type: string().required("Type is required.").trim(),
  }),
});
