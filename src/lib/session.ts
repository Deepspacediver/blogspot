"use server";

import { EXPIRATION_15_MINUTES, JWT_ACCESS_SIGNING_KEY } from "@/constants/jwt";
import { UserRole } from "@/db/types";
import * as jose from "jose";
import { validateAppToken } from "./auth-dal";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

const ISSUER = "blogspot";
const SIGN_ALG = "HS256";

export type JWTPayload = {
  userId: string;
  email: string;
  username?: string;
  role: UserRole;
};

// exp should always be present since setExpirationTime is invoked every time
export type JWT = JWTPayload & { exp: number };

type EncryptJWTProps = {
  payload: JWTPayload;
  signingSecret?: Uint8Array<ArrayBufferLike>;
  expiration?: string;
};

export const encryptJWT = async ({
  payload,
  signingSecret = JWT_ACCESS_SIGNING_KEY,
  expiration = EXPIRATION_15_MINUTES,
}: EncryptJWTProps) => {
  const authCookie = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: SIGN_ALG })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime(expiration)
    .sign(signingSecret);

  return authCookie;
};

type DecryptJWTProps = {
  cookie: string;
  signingSecret?: Uint8Array<ArrayBufferLike>;
};

export const decryptJWT = async ({ cookie, signingSecret = JWT_ACCESS_SIGNING_KEY }: DecryptJWTProps) => {
  try {
    const decryptedToken = await jose.jwtVerify<JWT>(cookie, signingSecret, {
      issuer: ISSUER,
    });

    return {
      error: null,
      errorMessage: "",
      details: "",
      payload: decryptedToken.payload,
    };
  } catch (e) {
    const details = e instanceof Error ? e.message : "";
    return {
      error: e,
      details,
      payload: undefined,
    };
  }
};

type ActionProps<T> = {
  prevState: T;
  payload: JWTPayload;
  formData?: FormData;
};

export const protectedAction = async <T>(action: ({ prevState, formData, payload }: ActionProps<T>) => Promise<T>) => {
  return async function (prevState: T, formData?: FormData) {
    const { payload, error } = await validateAppToken();
    if (!!error || !payload) {
      redirect("/auth/sign-in");
    }

    return await action({ prevState, payload, formData });
  };
};
