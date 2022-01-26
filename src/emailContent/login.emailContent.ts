import emailTemplate from "./../view/email/template";

export const loginEmailContent = async (name: string, secretToken: string) => {
  let emailContent = emailTemplate.replace("{{name}}", name);
  emailContent = emailContent.replace(
    "{{body}}",
    `Here, is Your 2FA OTP token ${secretToken}`
  );
  emailContent = emailContent.replace(
    "{{link}}",
    `${Object(process.env).FRONTEND}/auth/varify-otp`
  );
  emailContent = emailContent.replace("{{btnLabel}}", "Verify your email");
  emailContent = emailContent.replace(
    "{{footerText}}",
    "if you didn't create the account then ignore this email."
  );

  return emailContent;
};
