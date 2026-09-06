import * as jose from "jose";

export const EXPIRATION_15_MINUTES = "15m";
export const EXPIRATION_7_DAYS = "7d";
export const JWT_ACCESS_SIGNING_KEY = jose.base64url.decode(process.env.APP_JWT_SIGNING_SECRET!);
export const JWT_REFRESH_SIGNING_KEY = jose.base64url.decode(process.env.APP_JWT_REFRESH_SECRET!);

export const JWT_API_ACCESS_SIGNING_KEY = jose.base64url.decode(process.env.API_JWT_SIGNING_SECRET!);
export const JWT_API_REFRESH_SIGNING_KEY = jose.base64url.decode(process.env.API_JWT_REFRESH_SECRET!);

const isProd = process.env.NODE_ENV === "production";

export const JWT_API_ACCESS_NAME = isProd ? "__Host-api_access" : "api_access";
export const JWT_API_REFRESH_NAME = isProd ? "__Host-api_refresh" : "api_refresh";

export const JWT_APP_ACCESS_NAME = isProd ? "__Host-app_access" : "app_access";
export const JWT_APP_REFRESH_NAME = isProd ? "__Host-app_refresh" : "app_refresh";
