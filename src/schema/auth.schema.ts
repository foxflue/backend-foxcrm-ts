import { object, string } from "yup";

export const authSchema = object({
  body: object({
    name: string()
      .required("Name is required.")
      .trim()
      .min(4, "Title must be minimum 4 characters")
      .max(80, "Title must be miximum 80 characters"),
    email: string()
      .trim()
      .required("Email is required.")
      .email("Must be a valid Email."),
    phone: string().required("Phone is required."),
    password: string()
      .trim()
      .required("Password is required.")
      .min(6, "Password should be 6 chars minimum.")
      .max(20, "Password should be 20 chars maximum"),
    passwordConfirm: string().trim().required("Password Confirm is required."),
  }),
});
