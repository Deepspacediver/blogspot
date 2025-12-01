"use server";

import * as userQueries from "@/db/queries/user.queries";
import * as passwordUtils from "@/lib/credentials/hash";
import * as authModels from "@/models/auth.models";
import * as JWTHelpers from "@/lib/session";
import { cookies } from "next/headers";
import { EXPIRATION_15_MINUTES, EXPIRATION_7_DAYS, JWT_ACCESS_SIGNING_KEY, JWT_REFRESH_SIGNING_KEY } from "@/constants/jwt";
import z from "zod";
import { ActionState } from "@/db/types";
import { redirect } from "next/navigation";
import { signInSchema } from "@/models/auth.models";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
type SignUpFormFields = {
  email: string;
  password: string;
  confirmPassword: string;
};

type SignUpProps = Omit<SignUpFormFields, "confirmPassword">;

export const signUp = async ({ email, password }: SignUpProps) => {
  const hashedPassword = await passwordUtils.hash(password);
  return await userQueries.createUser({ email, password: hashedPassword });
};

export type SignUpState = ActionState<SignUpFormFields>;

export const handleSignUp = async (prevState: SignUpState, data?: FormData): Promise<SignUpState> => {
  const cookieStore = await cookies();
  const isSessionCookieSet = cookieStore.get("session");
  if (!!isSessionCookieSet) {
    redirect("/");
  }

  if (!data) {
    return {
      message: "Missing form data",
      fieldErrors: {},
      prevFormState: prevState.prevFormState,
    };
  }
  const formData = {
    email: data.get("email") as string | null,
    password: data.get("password") as string | null,
    confirmPassword: data.get("confirmPassword") as string | null,
  };

  const parsedData = authModels.singUpSchema.safeParse(formData);

  if (!parsedData.success) {
    return {
      message: "Incorrect account details",
      fieldErrors: z.flattenError(parsedData.error).fieldErrors,
      prevFormState: formData,
    };
  }

  const { email, password } = parsedData.data;

  try {
    const userExists = await userQueries.findUserByEmail(email);

    if (userExists) {
      return {
        message: "User with a given email already exists.",
        fieldErrors: {},
        prevFormState: formData,
      };
    }

    const user = await signUp({
      password,
      email,
    });

    const { id: userId, role, email: userEmail, username } = user;
    const payload = { userId, role, email: userEmail, username };

    const [appAccessToken, appRefreshToken] = await Promise.all([
      JWTHelpers.encryptJWT({
        payload,
        signingSecret: JWT_ACCESS_SIGNING_KEY,
        expiration: EXPIRATION_15_MINUTES,
      }),
      JWTHelpers.encryptJWT({
        payload,
        signingSecret: JWT_REFRESH_SIGNING_KEY,
        expiration: EXPIRATION_7_DAYS,
      }),
    ]);

    cookieStore
      .set({
        name: "session",
        value: appAccessToken,
        httpOnly: true,
        sameSite: true,
      })
      .set({
        name: "refresh",
        value: appRefreshToken,
        httpOnly: true,
        sameSite: true,
      });
  } catch {
    return {
      message: "Failed to create an account.",
      fieldErrors: {},
      prevFormState: formData,
    };
  }
  redirect("/");
};

type SignInFields = {
  email: string;
  password: string;
};

export type SignInState = ActionState<SignInFields>;

export const handleSignIn = async (_prevState: SignInState, data: FormData): Promise<SignInState> => {
  // Duplication
  const cookieStore = await cookies();
  const isSessionCookieSet = cookieStore.get("session");
  if (!!isSessionCookieSet) {
    redirect("/");
  }

  const formData = {
    email: data.get("email") as string | null,
    password: data.get("password") as string | null,
  };

  const parsedData = signInSchema.safeParse(formData);
  if (!parsedData.success) {
    return {
      message: "Incorrect form data",
      fieldErrors: z.flattenError(parsedData.error).fieldErrors,
      prevFormState: formData,
    };
  }

  const { email, password } = parsedData.data;
  try {
    const user = await userQueries.findUserByEmail(email);
    if (!user) {
      return {
        message: "User with given email address does not exists",
        fieldErrors: {},
        prevFormState: formData,
      };
    }

    const { password: hashedPassword, role, id: userId, username, email: userEmail } = user;

    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) {
      return {
        message: "Incorrect credentials",
        fieldErrors: {},
        prevFormState: formData,
      };
    }

    const payload = {
      userId,
      role,
      username,
      email: userEmail,
    };

    const [appAccessToken, appRefreshToken] = await Promise.all([
      JWTHelpers.encryptJWT({
        payload,
        signingSecret: JWT_ACCESS_SIGNING_KEY,
        expiration: EXPIRATION_15_MINUTES,
      }),
      JWTHelpers.encryptJWT({
        payload,
        signingSecret: JWT_REFRESH_SIGNING_KEY,
        expiration: EXPIRATION_7_DAYS,
      }),
    ]);

    cookieStore
      .set({
        name: "session",
        value: appAccessToken,
        httpOnly: true,
        sameSite: true,
      })
      .set({
        name: "refresh",
        value: appRefreshToken,
        httpOnly: true,
        sameSite: true,
      });
  } catch {
    return {
      message: "Failed to login",
      fieldErrors: {},
      prevFormState: formData,
    };
  }
  revalidatePath("/");
  redirect("/");
};
