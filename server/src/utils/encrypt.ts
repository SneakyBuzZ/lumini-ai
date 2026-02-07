import crypto from "crypto";
import { API_KEY_ENCRYPTION_KEY } from "./constants";

const ALGO = "aes-256-gcm";
const KEY = Buffer.from(API_KEY_ENCRYPTION_KEY, "hex");

export function encryptApiKey(apiKey: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);

  const encrypted = Buffer.concat([
    cipher.update(apiKey, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString(
    "hex",
  )}`;
}

export function decryptApiKey(payload: string) {
  const [ivHex, tagHex, dataHex] = payload.split(":");

  const decipher = crypto.createDecipheriv(
    ALGO,
    KEY,
    Buffer.from(ivHex, "hex"),
  );

  decipher.setAuthTag(Buffer.from(tagHex, "hex"));

  return decipher.update(dataHex, "hex", "utf8") + decipher.final("utf8");
}
