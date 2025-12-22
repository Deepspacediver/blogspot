"use server";

import { EXPIRATION_15_MINUTES, JWT_ACCESS_SIGNING_KEY } from "@/constants/jwt";
import { UserRole } from "@/db/types";
import * as jose from "jose";
import { validateAPIToken, validateAppToken } from "./auth-dal";
import { redirect } from "next/navigation";
import { APIResponse, getErrorDetails } from "./utils";
import { NextRequest } from "next/server";

const ISSUER = "blogspot";
const SIGN_ALG = "HS256";

export type JWTPayload = {
  userId: number;
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
      details: "",
      payload: decryptedToken.payload,
    };
  } catch (error) {
    const details = getErrorDetails({ error });
    return {
      error,
      details,
      payload: undefined,
    };
  }
};
type ActionProps = {
  payload: JWTPayload;
  body?: unknown;
};
export async function protectedAction<T>(action: ({ payload, body }: ActionProps) => Promise<T>, req?: NextRequest): Promise<T> {
  if (!!req) {
    const { payload, error } = await validateAPIToken();
    const body = await req.json();
    if (error || !payload) {
      return APIResponse({
        data: {
          message: "Unauthorized",
        },
        status: 401,
      }) as never;
    }

    return await action({ payload, body });
  } else {
    const { payload, error } = await validateAppToken();
    if (!!error || !payload) {
      redirect("/auth/sign-in");
    }

    return await action({ payload });
  }
}
