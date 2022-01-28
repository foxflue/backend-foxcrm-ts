import emailTemplate from "../view/email/template";

export const authRegisteredEmail = async (
  name: string,
  verificationToken: string
) => {
  let emailContent = emailTemplate.replace("{{name}}", name);
  emailContent = emailContent.replace(
    "{{body}}",
    "Your Foxflue CRM account has been created. Now nothing can stop you from taking your business online"
  );
  emailContent = emailContent.replace(
    "{{link}}",
    `${Object(process.env).FRONTEND}/auth/verify-email/${verificationToken}`
  );
  emailContent = emailContent.replace("{{btnLabel}}", "Verify your email");
  emailContent = emailContent.replace(
    "{{footerText}}",
    "if you didn't create the account then ignore this email."
  );

  return emailContent;
};
