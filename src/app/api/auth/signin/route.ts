import {
  EXPIRATION_15_MINUTES,
  EXPIRATION_7_DAYS,
  JWT_API_ACCESS_SIGNING_KEY,
  JWT_API_REFRESH_SIGNING_KEY,
} from "@/constants/jwt";
import * as userQueries from "@/db/queries/user.queries";
import { UserRole } from "@/db/types";
import * as authModels from "@/models/auth.models";
import { NextRequest } from "next/server";
import * as JWTHelpers from "@/lib/session";
import { cookies } from "next/headers";
import { treeifyError } from "zod";
import bcrypt from "bcryptjs";
import { APIResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsedData = authModels.signInSchema.safeParse(body);

  const cookieStore = await cookies();
  const accessCookie = cookieStore.get("access")?.value;

  if (accessCookie) {
    return APIResponse({
      data: {
        message: "Already logged in",
      },
      status: 400,
    });
  }

  if (!parsedData.success) {
    return APIResponse({
      data: {
        message: "Invalid request data",
        errors: treeifyError(parsedData.error).properties,
      },
      status: 400,
    });
  }

  const { email, password } = parsedData.data;

  const exisitngUser = await userQueries.findUserByEmail(email);
  if (!exisitngUser) {
    return APIResponse({
      data: { message: "Invalid credentials" },
      status: 400,
    });
  }

  const passwordsMatch = await bcrypt.compare(password, exisitngUser.password);
  if (!passwordsMatch) {
    return APIResponse({
      data: {
        message: "Passwords do not match from previously created account",
      },
      status: 400,
    });
  }

  const shouldUpdateRole = exisitngUser.role === UserRole.USER;
  const user = shouldUpdateRole
    ? await userQueries.updateUser({
        id: exisitngUser.id,
        role: UserRole.ADMIN,
      })
    : {
        email: exisitngUser.email,
        id: exisitngUser.id,
        username: exisitngUser.username,
        role: exisitngUser.role,
      };

  if (!user) {
    return APIResponse({
      data: {
        message: "Failed to login",
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
      message: "Successfully logged in",
    },
    status: 200,
  });
}
