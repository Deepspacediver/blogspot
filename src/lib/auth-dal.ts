"use server";

import { decryptJWT, encryptJWT, JWTPayload } from "./session";
import { cookies } from "next/headers";
import { EXPIRATION_15_MINUTES, EXPIRATION_7_DAYS, JWT_ACCESS_SIGNING_KEY, JWT_REFRESH_SIGNING_KEY } from "@/constants/jwt";
import { findUserByEmail } from "@/db/queries/user.queries";
import { errors as JoseErrors } from "jose";
import { CustomError } from "@/errors/custom-error";

export const getAppSessionData = async () => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const decryptedToken = sessionCookie
      ? await decryptJWT({
          cookie: sessionCookie,
          signingSecret: JWT_ACCESS_SIGNING_KEY,
        })
      : undefined;
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

export const validateAppToken = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;

  const decryptedAccessToken = sessionCookie
    ? await decryptJWT({
        cookie: sessionCookie,
        signingSecret: JWT_ACCESS_SIGNING_KEY,
      })
    : undefined;

  if (decryptedAccessToken?.payload) {
    return { payload: decryptedAccessToken.payload, error: null, details: "" };
  }

  const isExpiredAccessError =
    !!decryptedAccessToken && !!decryptedAccessToken.error && decryptedAccessToken.error instanceof JoseErrors.JWTExpired;
  if (!isExpiredAccessError) {
    cookieStore.delete("sesion").delete("refresh");
    return { payload: null, error: null, details: "" };
  }

  const refreshCookie = cookieStore.get("refresh")?.value;
  if (!refreshCookie) {
    cookieStore.delete("sesion").delete("refresh");
    return { payload: null, error: new CustomError("Missing refresh token", 401), details: "Missing refresh token" };
  }

  const decryptedRefreshToken = await decryptJWT({
    cookie: refreshCookie,
    signingSecret: JWT_REFRESH_SIGNING_KEY,
  });

  if (!!decryptedRefreshToken.error || !decryptedRefreshToken.payload) {
    cookieStore.delete("sesion").delete("refresh");
    return {
      payload: null,
      error: decryptedRefreshToken.error || new CustomError("Invalid refresh token", 401),
      details: decryptedRefreshToken.details,
    };
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

    return { payload, error: null, details: "null" };
  } catch (error) {
    cookieStore.delete("sesion").delete("refresh");
    return {
      payload: null,
      error,
      details: "Failed to authenticate via JWT",
    };
  }
};
