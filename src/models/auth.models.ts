import z from "zod";

// One capital letter, one special character, one number, 8 characters min
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const passwordSchema = z.string().regex(PASSWORD_REGEX);

export const singUpSchema = z
  .object({
    email: z.email(),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    { error: "Passwords do not match" },
  );

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});
