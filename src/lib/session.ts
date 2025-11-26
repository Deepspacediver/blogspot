import { EXPIRATION_15_MINUTES } from "@/constants/jwt";
import { UserRole } from "@/db/types";
import * as jose from "jose";
import { validateAppToken } from "./auth-dal";

export const JWT_ACCESS_SIGNING_KEY = jose.base64url.decode(process.env.BLOGSPOT_JWT_SECRET!);
export const JWT_REFRESH_SIGNING_KEY = jose.base64url.decode(process.env.BLOGSPOT_REFRESH_SIGNING_SECRET!);
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
      error: "",
      details: "",
      payload: decryptedToken.payload,
    };
  } catch (e) {
    const details = e instanceof Error ? e.message : "";
    return {
      error: "Failed to verify user token",
      details,
      payload: undefined,
    };
  }
};

type ActionProps<T> = {
  prevState: T;
  payload: JWT;
  formData?: FormData;
};

export const protectedAction = <T>(action: ({ prevState, formData, payload }: ActionProps<T>) => Promise<T>) => {
  return async function (prevState: T, formData?: FormData) {
    const { payload } = await validateAppToken();
    return await action({ prevState, payload, formData });
  };
};
