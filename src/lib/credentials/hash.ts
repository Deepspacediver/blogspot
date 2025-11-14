import bcrypt from "bcryptjs";

export const hash = async (password: string) => {
  return await bcrypt.hash(password, 10);
};
