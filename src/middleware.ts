import { EXPIRATION_15_MINUTES, EXPIRATION_7_DAYS, JWT_ACCESS_SIGNING_KEY, JWT_REFRESH_SIGNING_KEY } from "@/constants/jwt";
import { errors as JoseErrors, JWTPayload } from "jose";
import { decryptJWT, encryptJWT } from "@/lib/session";
import { NextResponse, type NextRequest } from "next/server";
import { findUserByEmail } from "@/db/queries/user.queries";
import { CustomError } from "@/errors/custom-error";
import { JWT_APP_ACCESS_NAME, JWT_APP_REFRESH_NAME } from "@/constants/jwt";

export async function middleware(request: NextRequest) {
  const headers = new Headers();
  headers.set("x-current-path", request.nextUrl.pathname);
  const sessionCookie = request.cookies.get(JWT_APP_ACCESS_NAME)?.value;
  const refreshCookie = request.cookies.get(JWT_APP_REFRESH_NAME)?.value;
  const response = NextResponse.next({ headers });

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
    response.cookies.delete(JWT_APP_ACCESS_NAME).delete(JWT_APP_REFRESH_NAME);
    return response;
  }

  if (!refreshCookie) {
    response.cookies.delete(JWT_APP_ACCESS_NAME);
    return response;
  }
  const decryptedRefreshToken = await decryptJWT({
    cookie: refreshCookie,
    signingSecret: JWT_REFRESH_SIGNING_KEY,
  });

  if (!!decryptedRefreshToken.error || !decryptedRefreshToken.payload) {
    response.cookies.delete(JWT_APP_ACCESS_NAME).delete(JWT_APP_REFRESH_NAME);
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
      .delete(JWT_APP_ACCESS_NAME)
      .delete(JWT_APP_REFRESH_NAME)
      .set({
        name: JWT_APP_ACCESS_NAME,
        value: newSessionToken,
      })
      .set({
        name: JWT_APP_REFRESH_NAME,
        value: newRefreshToken,
      });
    return response;
  } catch {
    response.cookies.delete(JWT_APP_ACCESS_NAME).delete(JWT_APP_REFRESH_NAME);
    return response;
  }
}

export const config = {
  matcher: "/((?!api|auth|_next/static|_next/image).*)",
  runtime: "nodejs",
};
