import bcrypt from "bcrypt";

type encryptFunc = (argument1: string) => Promise<string>;
type compareFunc = (argument1: string, argument2: string) => Promise<boolean>;

export const encryptedPassword: encryptFunc = async (password) => {
  const saltRound = Object(process.env).SALT_ROUND;
  const salt = await bcrypt.genSalt(saltRound);
  const hashPassword = await bcrypt.hash(password, salt);

  return hashPassword;
};

export const comparePassword: compareFunc = async (
  password,
  encryptedPassword
) => {
  const isMatch = await bcrypt.compare(password, encryptedPassword);

  return isMatch;
};
