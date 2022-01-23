import emailTemplate from "./../view/email/template";

export const forgotPasswordEmailContent = async (
  name: string,
  verificationToken: string
) => {
  let emailContent = emailTemplate.replace("{{name}}", name);
  emailContent = emailContent.replace(
    "{{body}}",
    "You have requested to reset your password. Please click on the link below to reset your password"
  );
  emailContent = emailContent.replace(
    "{{link}}",
    `${process.env.FRONTEND}/auth/reset-password/${verificationToken}`
  );
  emailContent = emailContent.replace("{{btnLabel}}", "Reset Password");
  emailContent = emailContent.replace(
    "{{footerText}}",
    "if you didn't request to reset your password then ignore this email."
  );

  return emailContent;
};
