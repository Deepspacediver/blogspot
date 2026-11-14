import {
  EXPIRATION_7_DAYS,
  getJwtApiAccessSigningKey,
  getJwtApiRefreshSigningKey,
  JWT_API_ACCESS_NAME,
  JWT_API_REFRESH_NAME,
} from "@/constants/jwt";
import * as userQueries from "@/db/queries/user.queries";
import * as JWTHelpers from "@/lib/session";
import { JWTPayload } from "@/lib/session";
import { APIResponse, clearJWTCookies } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  const refreshCookie = cookieStore.get(JWT_API_REFRESH_NAME)?.value;

  if (!refreshCookie) {
    clearJWTCookies({ cookieStore, isAPI: true });
    return APIResponse({ data: { message: "Missing refresh token" }, status: 400 });
  }

  try {
    const { payload } = await JWTHelpers.decryptJWT({
      cookie: refreshCookie,
      signingSecret: getJwtApiRefreshSigningKey(),
    });

    if (!payload) {
      clearJWTCookies({ cookieStore, isAPI: true });
      return APIResponse({ res: Response, data: { message: "Invalid refresh token" }, status: 400 });
    }

    const user = await userQueries.findUserById(payload.userId);

    if (!user) {
      clearJWTCookies({ cookieStore, isAPI: true });
      return APIResponse({ data: { message: "User not found" }, status: 404 });
    }
    const newPayload = { userId: user.id, email: user.email, username: user.username, role: user.role } satisfies JWTPayload;
    const [newAccessJWT, newRefreshJWT] = await Promise.all([
      JWTHelpers.encryptJWT({
        payload: newPayload,
        signingSecret: getJwtApiAccessSigningKey(),
      }),
      JWTHelpers.encryptJWT({
        payload: newPayload,
        signingSecret: getJwtApiRefreshSigningKey(),
        expiration: EXPIRATION_7_DAYS,
      }),
    ]);

    cookieStore
      .set({
        name: JWT_API_ACCESS_NAME,
        value: newAccessJWT,
        httpOnly: true,
        secure: true,
      })
      .set({
        name: JWT_API_REFRESH_NAME,
        value: newRefreshJWT,
        httpOnly: true,
        secure: true,
      });

    return APIResponse({ data: { message: "ok" }, status: 200 });
  } catch {
    clearJWTCookies({ cookieStore, isAPI: true });
    return APIResponse({ data: { message: "Unexpected error" }, status: 500 });
  }
}
