import nodemailer from "nodemailer";

const sendEmail = async (options: object) => {
  console.log(Object(process.env).NODEMAILER_HOST);

  const transporter = nodemailer.createTransport({
    host: Object(process.env).NODEMAILER_HOST,
    port: Object(process.env).NODEMAILER_PORT,
    auth: {
      user: Object(process.env).NODEMAILER_USER,
      pass: Object(process.env).NODEMAILER_PASS,
    },
  });
  const emailOptions = {
    from: `"${Object(process.env).NODEMAILER_FROM}"< ${
      Object(process.env).NODEMAILER_EMAIL
    }>`,
    to: Object(options).email,
    subject: Object(options).subject,
    html: `${Object(options).body}`,
  };

  return transporter.sendMail(emailOptions);
};

export default { sendEmail };
