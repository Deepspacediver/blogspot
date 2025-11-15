import z from "zod";

// One capital letter, one special character, one number, 8 characters min
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const passwordSchema = z.string().regex(PASSWORD_REGEX);
