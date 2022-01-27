import crypto from "crypto";

export const hashString = () => crypto.randomBytes(32).toString("hex");

export const encryptedRandomString = (text: string) =>
  crypto.createHash("sha256").update(text).digest("hex");
