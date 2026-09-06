import { APIResponse, clearJWTCookies } from "@/lib/utils";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  clearJWTCookies({ cookieStore, isAPI: true });

  return APIResponse({
    data: { message: "ok" },
  });
}
