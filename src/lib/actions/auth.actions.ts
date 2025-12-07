"use server";

import * as userQueries from "@/db/queries/user.queries";
import * as passwordUtils from "@/lib/credentials/hash";
import * as authModels from "@/models/auth.models";
import * as JWTHelpers from "@/lib/session";
import { cookies, headers } from "next/headers";
import { EXPIRATION_15_MINUTES, EXPIRATION_7_DAYS, JWT_ACCESS_SIGNING_KEY, JWT_REFRESH_SIGNING_KEY } from "@/constants/jwt";
import z from "zod";
import { ActionState } from "@/db/types";
import { redirect } from "next/navigation";
import { signInSchema } from "@/models/auth.models";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { getErrorDetails } from "../utils";
import { defaultSignInState, defaultSignupState } from "@/constants/form-states";

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
  const isSessionCookieSet = cookieStore.get("session")?.value;
  if (!!isSessionCookieSet) {
    redirect("/");
  }

  if (!data) {
    return {
      ...defaultSignupState,
      message: "Missing form data",
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
      ...defaultSignupState,
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
        ...defaultSignupState,
        message: "User with a given email already exists.",
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
  } catch (error) {
    const details = getErrorDetails({ error });
    return {
      ...defaultSignupState,
      message: "Failed to create an account.",
      prevFormState: formData,
      error,
      details,
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
  const isSessionCookieSet = cookieStore.get("session")?.value;
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
      ...defaultSignInState,
      message: "Incorrect form data",
      fieldErrors: z.flattenError(parsedData.error).fieldErrors,
      prevFormState: formData,
    } satisfies SignInState;
  }

  const { email, password } = parsedData.data;
  try {
    const user = await userQueries.findUserByEmail(email);
    if (!user) {
      return {
        ...defaultSignInState,
        message: "User with given email address does not exists",
        prevFormState: formData,
      } satisfies SignInState;
    }

    const { password: hashedPassword, role, id: userId, username, email: userEmail } = user;

    const passwordMatch = await bcrypt.compare(password, hashedPassword);
    if (!passwordMatch) {
      return {
        ...defaultSignInState,
        message: "Incorrect credentials",
        prevFormState: formData,
      } satisfies SignInState;
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
  } catch (error) {
    const details = getErrorDetails({ error });
    return {
      ...defaultSignInState,
      message: "Failed to login",
      details,
      prevFormState: formData,
    };
  }
  revalidatePath("/");
  redirect("/");
};

export const handleSignOut = async () => {
  const headerList = await headers();
  const cookieStore = await cookies();
  cookieStore.delete("session").delete("refresh");
  const currentPath = headerList.get("x-current-path");
  revalidatePath(currentPath || "/");
};
