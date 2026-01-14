import { APIResponse, clearJWTCookies } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  const accessCookie = cookieStore.get("access");
  const refreshCookie = cookieStore.get("refresh");
  if (!accessCookie || !refreshCookie) {
    return APIResponse({
      data: "Not logged in",
      status: 400,
    });
  }
  clearJWTCookies({ cookieStore, isAPI: true });

  return APIResponse({
    data: { message: "ok" },
  });
}
