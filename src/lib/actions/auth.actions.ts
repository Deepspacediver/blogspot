"use server";

import * as userQueries from "@/db/queries/user.queries";
import * as passwordUtils from "@/lib/credentials/hash";
import * as authModels from "@/models/auth.models";

type SignUpProps = {
  email: string;
  password: string;
};

export const signUp = async ({ email, password }: SignUpProps) => {
  const hashedPassword = await passwordUtils.hash(password);
  await userQueries.createUser({ email, password: hashedPassword });
};

type HandleSignUpProps = SignUpProps & {
  confirmPassword: string;
};

export const handleSignUp = async ({ email, password, confirmPassword }: HandleSignUpProps) => {
  const parsedData = authModels.singUpSchema.safeParse({
    email,
    password,
    confirmPassword,
  });

  if (!parsedData.success) {
    // todo
    throw new Error(parsedData.error.issues.toString());
  }

  const userExists = await userQueries.findUserByEmail(email);
  if (userExists) {
    // Todo add errors with codes
    throw new Error();
  }

  await signUp({
    password,
    email,
  });
};
