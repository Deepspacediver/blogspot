import * as jose from "jose";

const JWT_SIGNING_KEY = jose.base64url.decode(process.env.BLOGSPOT_JWT_SECRET!);
const ISSUER = "blogspot";
const SIGN_ALG = "HS256";
export const EXPIRATION_15_MINUTES = "15m";
export const EXPIRATION_7_DAYS = "7d";

type JWTPayload = {
  userId: string;
};

type JWT = JWTPayload & { exp: Date };

type EncryptJWTProps = {
  payload: JWTPayload;
  expiration?: string;
};

export const encryptJWT = async ({ payload, expiration = EXPIRATION_15_MINUTES }: EncryptJWTProps) => {
  const authCookie = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: SIGN_ALG })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime(expiration)
    .sign(JWT_SIGNING_KEY);

  return authCookie;
};

export const decryptJWT = async (cookie: string) => {
  try {
    return await jose.jwtVerify<JWT>(cookie, JWT_SIGNING_KEY, {
      issuer: ISSUER,
    });
  } catch (err) {
    // TODO add error handling, probably redirect
    console.error(err);
  }
};
