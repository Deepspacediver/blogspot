"use server";

import { decryptJWT, encryptJWT, JWT_REFRESH_SIGNING_KEY } from "./session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EXPIRATION_15_MINUTES } from "@/constants/jwt";
import { isExpired } from "./utils";

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
    };
  } catch (e) {
    return {
      user: undefined,
    };
  }
};

export const validateAppToken = async () => {
  const cookieStore = await cookies();
  try {
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) {
      redirect("/auth/sign-in");
    }
    const decryptedToken = await decryptJWT({
      cookie: sessionCookie,
      signingSecret: JWT_REFRESH_SIGNING_KEY,
    });
    if (!decryptedToken.payload) {
      redirect("/auth/sign-in");
    }
    const isJWTExpired = isExpired(decryptedToken?.payload?.exp);
    if (!isJWTExpired) {
      return { payload: decryptedToken.payload };
    }
    const newSessionToken = await encryptJWT({
      payload: {
        userId: decryptedToken.payload.userId,
        role: decryptedToken.payload.role,
        username: decryptedToken.payload.username,
        email: decryptedToken.payload.email,
      },
      signingSecret: JWT_REFRESH_SIGNING_KEY,
      expiration: EXPIRATION_15_MINUTES,
    });

    cookieStore.set({
      name: "session",
      value: newSessionToken,
      httpOnly: true,
    });

    return { payload: decryptedToken.payload };
  } catch {
    cookieStore.delete("session");
    redirect("/auth/sign-in");
  }
};
