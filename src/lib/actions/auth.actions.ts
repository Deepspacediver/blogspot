"use server";

import * as userQueries from "@/db/queries/user.queries";
import * as passwordUtils from "@/lib/credentials/hash";
import * as authModels from "@/models/auth.models";
import * as JWTHelpers from "@/lib/session";
import { cookies } from "next/headers";
import { EXPIRATION_15_MINUTES } from "@/constants/jwt";

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

export const handleSignUp = async (
  prevState: unknown,
  data: FormData,
  // { email, password, confirmPassword }: HandleSignUpProps
) => {
  const formData = {
    email: data.get("email"),
    password: data.get("password"),
    confirmPassword: data.get("confirmPassword"),
  };

  const parsedData = authModels.singUpSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      message: "Incorrect account details",
      details: parsedData.error.flatten.toString(),
    };
  }

  const { email, password } = parsedData.data;
  const userExists = await userQueries.findUserByEmail(email);
  if (userExists) {
    return { message: "User with a given email already exists.", details: "" };
  }

  try {
    const user = await signUp({
      password,
      email,
    });

    console.log({ user });
    const { id: userId, role } = user;
    const payload = { userId, role };
    // Currently only for app
    const appAccessToken = await JWTHelpers.encryptJWT({
      payload,
      signingSecret: JWTHelpers.JWT_REFRESH_SIGNING_KEY,
      expiration: EXPIRATION_15_MINUTES,
    });

    const cookieStore = await cookies();
    cookieStore.set({
      name: "session",
      value: appAccessToken,
      httpOnly: true,
    });
    return {
      message: "",
      details: "",
    };
  } catch (e) {
    return {
      message: "Failed to create an account.",
      details: JSON.stringify(e),
    };
  }
};
