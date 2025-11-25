"use server";

import { decryptJWT, encryptJWT, JWT_REFRESH_SIGNING_KEY } from "./session";
import { cookies } from "next/headers";
import { CustomError } from "@/errors/custom-error";
import { redirect } from "next/navigation";
import { EXPIRATION_15_MINUTES } from "@/constants/jwt";

// todo replace with datenfs
const isExpired = (date: Date | number) => {
  return new Date(date).valueOf() - new Date().valueOf() < 0;
};

// todo
// this should be moved, it will handle extenral api tokens
export const validateAccessToken = async () => {
  const sessionAccessToken = (await cookies()).get("access")?.value;
  if (!sessionAccessToken) {
    throw new CustomError("Missing access token,", 401);
  }
  const jwtPayload = await decryptJWT(sessionAccessToken);
  if (!jwtPayload) {
    throw new CustomError("Missing access token.", 401);
  }
  // todo use datefns
  const isJWTExpired = isExpired(jwtPayload.payload.exp);
  if (isJWTExpired) {
    throw new CustomError("Access token is expired.", 401);
  }
};

export const validateAppToken = async () => {
  const cookieStore = await cookies();
  try {
    const sessionAccessToken = cookieStore.get("session")?.value;
    if (!sessionAccessToken) {
      redirect("/auth/sign-in");
    }

    const decryptedToken = await decryptJWT(sessionAccessToken);
    if (!decryptedToken) {
      redirect("/auth/sign-in");
    }
    const isJWTExpired = isExpired(decryptedToken?.payload?.exp);
    if (!isJWTExpired) {
      return decryptedToken.payload;
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

    return decryptedToken.payload;
  } catch {
    cookieStore.delete("session");
    redirect("/auth/sign-in");
  }
};
