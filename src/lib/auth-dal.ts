"use server";

import { decryptJWT, encryptJWT, JWT_ACCESS_SIGNING_KEY, JWT_REFRESH_SIGNING_KEY, JWTPayload } from "./session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EXPIRATION_15_MINUTES, EXPIRATION_7_DAYS } from "@/constants/jwt";
import { findUserByEmail } from "@/db/queries/user.queries";
import { errors as JoseErrors } from "jose";
import { CustomError } from "@/errors/custom-error";

export const getAppSessionData = async () => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const decryptedToken = !!sessionCookie
      ? await decryptJWT({ cookie: sessionCookie, signingSecret: JWT_REFRESH_SIGNING_KEY })
      : null;
    const payload = decryptedToken?.payload;
    return {
      user: payload
        ? {
            username: payload?.username,
            email: payload.email,
            role: payload.role,
          }
        : undefined,
      error: decryptedToken?.error,
      details: decryptedToken?.details,
    };
  } catch (error) {
    const details = error instanceof Error ? error.message : "Failed to decrypt JWT";
    return {
      user: undefined,
      error,
      details,
    };
  }
};

// Todo this could be improved by not redirecting, instead returning errors
// change if it is  necessary to reuse validateAppToken
export const validateAppToken = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    redirect("/auth/sign-in");
  }
  const decryptedAccessToken = await decryptJWT({
    cookie: sessionCookie,
    signingSecret: JWT_ACCESS_SIGNING_KEY,
  });

  if (decryptedAccessToken.payload) {
    return { payload: decryptedAccessToken.payload };
  }

  const isExpiredAccessError = !!decryptedAccessToken.error && decryptedAccessToken.error instanceof JoseErrors.JWTExpired;
  if (!isExpiredAccessError) {
    redirect("/auth/signin");
  }

  const refreshCookie = cookieStore.get("refresh")?.value;
  if (!refreshCookie) {
    redirect("/auth/sign-in");
  }

  const decryptedRefreshToken = await decryptJWT({
    cookie: refreshCookie,
    signingSecret: JWT_REFRESH_SIGNING_KEY,
  });

  if (!!decryptedRefreshToken.error || !decryptedRefreshToken.payload) {
    redirect("/auth/signin");
  }

  try {
    const user = await findUserByEmail(decryptedRefreshToken.payload.email);
    if (!user) {
      throw new CustomError("User with given email was not found", 404);
    }
    const payload = {
      username: user.username,
      email: user.email,
      userId: user.id,
      role: user.role,
    } satisfies JWTPayload;

    const [newSessionToken, newRefreshToken] = await Promise.all([
      encryptJWT({
        payload,
        signingSecret: JWT_ACCESS_SIGNING_KEY,
        expiration: EXPIRATION_15_MINUTES,
      }),
      encryptJWT({
        payload,
        signingSecret: JWT_REFRESH_SIGNING_KEY,
        expiration: EXPIRATION_7_DAYS,
      }),
    ]);
    cookieStore
      .set({
        name: "session",
        value: newSessionToken,
        httpOnly: true,
        sameSite: true,
      })
      .set({
        name: "refresh",
        value: newRefreshToken,
        httpOnly: true,
        sameSite: true,
      });

    return { payload };
  } catch {
    redirect("/auth/signin");
  }
};
