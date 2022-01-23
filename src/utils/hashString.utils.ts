import crypto from "crypto";

export const hashString = () => crypto.randomBytes(32).toString("hex");

export const encryptedRandomString = (verificationToken: string) =>
  crypto.createHash("sha256").update(verificationToken).digest("hex");
