import {
  EXPIRATION_15_MINUTES,
  EXPIRATION_7_DAYS,
  JWT_API_ACCESS_SIGNING_KEY,
  JWT_API_REFRESH_SIGNING_KEY,
} from "@/constants/jwt";
import * as userQueries from "@/db/queries/user.queries";
import { UserRole } from "@/db/types";
import { signUp } from "@/lib/actions/auth.actions";
import * as authModels from "@/models/auth.models";
import { NextRequest } from "next/server";
import * as JWTHelpers from "@/lib/session";
import { cookies } from "next/headers";
import { treeifyError } from "zod";
import bcrypt from "bcryptjs";
import { APIResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedData = authModels.singUpSchema.safeParse(body);

  const cookieStore = await cookies();
  const accessCookie = cookieStore.get("access")?.value;

  if (accessCookie) {
    return APIResponse({ data: { message: "Already logged in" }, status: 400 });
  }

  if (!parsedData.success) {
    return APIResponse({
      data: { message: "Invalid request data", errors: treeifyError(parsedData.error).properties },
      status: 400,
    });
  }

  const { email, password } = parsedData.data;

  const exisitngUser = await userQueries.findUserByEmail(email);
  let user;

  if (exisitngUser) {
    const passwordsMatch = await bcrypt.compare(password, exisitngUser.password);
    if (!passwordsMatch) {
      return APIResponse({
        data: {
          message: "Passwords do not match from previously created account",
        },
        status: 400,
      });
    }
    user = await userQueries.updateUser({
      id: exisitngUser.id,
      role: UserRole.ADMIN,
    });
  } else {
    user = await signUp({
      email,
      password,
      role: UserRole.ADMIN,
    });
  }

  if (!user) {
    return APIResponse({
      data: {
        message: "Failed to create or find user",
      },
      status: 500,
    });
  }

  const payload = {
    userId: user.id,
    role: user.role,
    username: user.username,
    email: user.email,
  } satisfies JWTHelpers.JWTPayload;

  const [accessToken, refreshToken] = await Promise.all([
    JWTHelpers.encryptJWT({
      payload,
      signingSecret: JWT_API_ACCESS_SIGNING_KEY,
      expiration: EXPIRATION_15_MINUTES,
    }),
    JWTHelpers.encryptJWT({
      payload,
      signingSecret: JWT_API_REFRESH_SIGNING_KEY,
      expiration: EXPIRATION_7_DAYS,
    }),
  ]);

  cookieStore
    .set({
      value: accessToken,
      name: "access",
      secure: true,
    })
    .set({
      value: refreshToken,
      name: "refresh",
      httpOnly: true,
      secure: true,
    });
  return APIResponse({
    data: {
      message: "Successfully created user",
    },
    status: 200,
  });
}
