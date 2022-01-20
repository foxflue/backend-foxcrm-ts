import { Request } from "express";
import jwt from "jsonwebtoken";

type extractTokenTypeDetails = (req: Request) => string | false;
type verifyTokenTypeDetails = (token: string) => object | string;
type SignTokenTypeDetails = (id: string, rememberme: boolean) => string;

const extractToken: extractTokenTypeDetails = (req) => {
  let token = req.header("authorization") as string;

  if (!token) {
    return false;
  }

  token = token.split(" ")[1];
  return token;
};

const verifyToken: verifyTokenTypeDetails = (token) =>
  jwt.verify(token, Object(process.env).JWT_SECRET_KEY);

const signToken: SignTokenTypeDetails = (id, rememberme) => {
  return jwt.sign({ id }, Object(process.env).JWT_SECRET_KEY, {
    expiresIn: rememberme ? "7d" : "1d",
  });
};

export default { extractToken, verifyToken, signToken };
