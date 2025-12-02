import { EXPIRATION_15_MINUTES, EXPIRATION_7_DAYS, JWT_ACCESS_SIGNING_KEY, JWT_REFRESH_SIGNING_KEY } from "@/constants/jwt";
import { errors as JoseErrors, JWTPayload } from "jose";
import { decryptJWT, encryptJWT } from "@/lib/session";
import { NextResponse, type NextRequest } from "next/server";
import { findUserByEmail } from "@/db/queries/user.queries";
import { CustomError } from "@/errors/custom-error";

export async function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")?.value;
  const refreshCookie = request.cookies.get("refresh")?.value;
  const response = NextResponse.next();

  const decryptedAccessToken = sessionCookie
    ? await decryptJWT({
        cookie: sessionCookie,
        signingSecret: JWT_ACCESS_SIGNING_KEY,
      })
    : undefined;

  if (decryptedAccessToken?.payload) {
    return response;
  }

  const isExpiredAccessError =
    !!decryptedAccessToken && !!decryptedAccessToken.error && decryptedAccessToken.error instanceof JoseErrors.JWTExpired;

  if (!isExpiredAccessError) {
    response.cookies.delete("session").delete("refresh");
    return response;
  }

  if (!refreshCookie) {
    response.cookies.delete("session");
    return response;
  }
  const decryptedRefreshToken = await decryptJWT({
    cookie: refreshCookie,
    signingSecret: JWT_REFRESH_SIGNING_KEY,
  });

  if (!!decryptedRefreshToken.error || !decryptedRefreshToken.payload) {
    response.cookies.delete("session").delete("refresh");
    return response;
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

    response.cookies
      .delete("session")
      .delete("refresh")
      .set({
        name: "session",
        value: newSessionToken,
      })
      .set({
        name: "refresh",
        value: newRefreshToken,
      });
    return response;
  } catch {
    response.cookies.delete("session").delete("refresh");
    return response;
  }
}

export const config = {
  // matcher: '/about/:path*',
  runtime: "nodejs",
};
