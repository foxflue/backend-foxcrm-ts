import { object, ref, string } from "yup";

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
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 8 characters, one uppercase, one number and one special case character"
      ),
    passwordConfirm: string()
      .trim()
      .required("Password Confirm is required.")
      .oneOf([ref("password")], "Passwords don't match."),
  }),
});
