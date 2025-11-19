"use server";

import * as userQueries from "@/db/queries/user.queries";
import * as passwordUtils from "@/lib/credentials/hash";
import * as authModels from "@/models/auth.models";
import * as JWTHelpers from "@/lib/session";
import { cookies } from "next/headers";
import { EXPIRATION_15_MINUTES } from "@/constants/jwt";
import z from "zod";
import { ErrorFields, NullablePartial } from "@/db/types";

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

export type SignUpState = {
  message: string;
  fieldErrors: ErrorFields<SignUpFormFields>;
  prevFormState: NullablePartial<SignUpFormFields>;
};

export const handleSignUp = async (prevState: SignUpState, data?: FormData): Promise<SignUpState> => {
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

    const { id: userId, role } = user;
    const payload = { userId, role };

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
      fieldErrors: {},
      prevFormState: formData,
    };
  } catch {
    return {
      message: "Failed to create an account.",
      fieldErrors: {},
      prevFormState: formData,
    };
  }
};
