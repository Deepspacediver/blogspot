"use server";

import * as userQueries from "@/db/queries/user.queries";
import * as passwordUtils from "@/lib/credentials/hash";
import * as authModels from "@/models/auth.models";
import * as JWTHelpers from "@/lib/session";
import { cookies } from "next/headers";

type SignUpProps = {
  email: string;
  password: string;
};

export const signUp = async ({ email, password }: SignUpProps) => {
  const hashedPassword = await passwordUtils.hash(password);
  return await userQueries.createUser({ email, password: hashedPassword });
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

  const user = await signUp({
    password,
    email,
  });

  if (!user) {
    throw new Error();
  }

  const { id: userId } = user;
  const payload = { userId };
  const [accessToken, refreshToken] = await Promise.all([
    JWTHelpers.encryptJWT({
      payload,
    }),
    JWTHelpers.encryptJWT({
      payload,
      signingSecret: JWTHelpers.JWT_REFRESH_SIGNING_KEY,
      expiration: JWTHelpers.EXPIRATION_7_DAYS,
    }),
  ]);

  const cookieStore = await cookies();
  cookieStore.set({
    name: "access",
    value: accessToken,
  });
  cookieStore.set({
    name: "refresh",
    value: refreshToken,
    httpOnly: true,
  });
};
