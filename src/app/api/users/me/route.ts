import * as userQueries from "@/db/queries/user.queries";
import { CustomError } from "@/errors/custom-error";
import { protectedAction } from "@/lib/session";
import { APIResponse } from "@/lib/utils";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return protectedAction(async ({ payload }) => {
    const user = await userQueries.findUserById(payload.userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }

    const userData = {
      email: user.email,
      username: user.email,
      pictureUrl: user.pictureUrl,
      role: user.role,
    };

    return APIResponse({
      status: 200,
      data: {
        user: userData,
      },
    });
  }, req);
}
