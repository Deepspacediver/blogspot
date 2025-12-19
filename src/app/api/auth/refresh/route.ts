import { EXPIRATION_7_DAYS, JWT_API_ACCESS_SIGNING_KEY, JWT_API_REFRESH_SIGNING_KEY } from "@/constants/jwt";
import * as userQueries from "@/db/queries/user.queries";
import * as JWTHelpers from "@/lib/session";
import { JWTPayload } from "@/lib/session";
import { APIResponse, clearJWTCookies } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  const refreshCookie = cookieStore.get("refresh")?.value;

  if (!refreshCookie) {
    clearJWTCookies({ cookieStore, isAPI: true });
    return APIResponse({ data: { message: "Missing refresh token" }, status: 401 });
  }

  try {
    const { payload } = await JWTHelpers.decryptJWT({
      cookie: refreshCookie,
      signingSecret: JWT_API_REFRESH_SIGNING_KEY,
    });

    if (!payload) {
      clearJWTCookies({ cookieStore, isAPI: true });
      return APIResponse({ res: Response, data: { message: "Invalid refresh token" }, status: 401 });
    }

    const user = await userQueries.findUserById(payload.userId);

    if (!user) {
      clearJWTCookies({ cookieStore, isAPI: true });
      return APIResponse({ data: { message: "Invlalid refresh token" }, status: 401 });
    }
    const newPayload = { userId: user.id, email: user.email, username: user.username, role: user.role } satisfies JWTPayload;
    const [newAccessJWT, newRefreshJWT] = await Promise.all([
      JWTHelpers.encryptJWT({
        payload: newPayload,
        signingSecret: JWT_API_ACCESS_SIGNING_KEY,
      }),
      JWTHelpers.encryptJWT({
        payload: newPayload,
        signingSecret: JWT_API_REFRESH_SIGNING_KEY,
        expiration: EXPIRATION_7_DAYS,
      }),
    ]);

    cookieStore
      .set({
        name: "access",
        value: newAccessJWT,
      })
      .set({
        name: "refresh",
        value: newRefreshJWT,
        httpOnly: true,
      });

    return APIResponse({ data: { message: "ok" }, status: 200 });
  } catch {
    clearJWTCookies({ cookieStore, isAPI: true });
    return APIResponse({ data: { message: "Unexpected error" }, status: 500 });
  }
}
