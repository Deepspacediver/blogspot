import * as jose from "jose";

export const EXPIRATION_15_MINUTES = "15m";
export const EXPIRATION_7_DAYS = "7d";
export const JWT_ACCESS_SIGNING_KEY = jose.base64url.decode(process.env.BLOGSPOT_JWT_SECRET!);
export const JWT_REFRESH_SIGNING_KEY = jose.base64url.decode(process.env.BLOGSPOT_REFRESH_SIGNING_SECRET!);
