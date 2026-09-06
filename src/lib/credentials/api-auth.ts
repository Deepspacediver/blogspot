import { CustomError } from "@/errors/custom-error";
import { JWT_API_ACCESS_NAME } from "@/constants/jwt";
import { decryptJWT } from "../session";
import { cookies } from "next/headers";
import { isExpired } from "../utils";

export const validateAccessToken = async () => {
  const sessionAccessToken = (await cookies()).get(JWT_API_ACCESS_NAME)?.value;
  if (!sessionAccessToken) {
    throw new CustomError("Missing access token,", 401);
  }
  const jwtPayload = await decryptJWT({
    cookie: sessionAccessToken,
  });
  if (!jwtPayload) {
    throw new CustomError("Missing access token.", 401);
  }
  const isJWTExpired = jwtPayload?.payload && isExpired(jwtPayload.payload.exp);
  if (isJWTExpired) {
    throw new CustomError("Access token is expired.", 401);
  }
};
