import * as jose from "jose";

export const EXPIRATION_15_MINUTES = "15m";
export const EXPIRATION_7_DAYS = "7d";
export const JWT_ACCESS_SIGNING_KEY = jose.base64url.decode(process.env.APP_JWT_SIGNING_SECRET!);
export const JWT_REFRESH_SIGNING_KEY = jose.base64url.decode(process.env.APP_JWT_REFRESH_SECRET!);

export const JWT_API_ACCESS_SIGNING_KEY = jose.base64url.decode(process.env.API_JWT_SIGNING_SECRET!);
export const JWT_API_REFRESH_SIGNING_KEY = jose.base64url.decode(process.env.API_JWT_REFRESH_SECRET!);
