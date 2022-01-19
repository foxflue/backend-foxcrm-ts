import { Request } from "express";
import jwt from "jsonwebtoken";

const extractToken = (req: Request) => {
  let token = req.header("authorization") as string;

  if (!token) {
    return false;
  }

  token = token.split(" ")[1];
  return token;
};

const verifyToken = (token: string) =>
  jwt.verify(token, Object(process.env).JWT_SECRET_KEY);

const signToken = (id: string, rememberme: boolean) => {
  return jwt.sign({ id }, Object(process.env).JWT_SECRET_KEY, {
    expiresIn: rememberme ? "7d" : "1d",
  });
};

export default { extractToken, verifyToken, signToken };
