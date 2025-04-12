import bcrypt from "bcryptjs";

export async function generateHash(text: string) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(text, salt);
  return hashedPassword;
}

export async function compareHash(text: string, hashedText: string) {
  const match = await bcrypt.compare(text, hashedText);
  return match;
}
