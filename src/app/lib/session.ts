import * as jose from "jose";

const JWT_SIGNING_KEY = jose.base64url.decode(process.env.BLOGSPOT_JWT_SECRET!);
const ISSUER = "blogspot";
const SIGN_ALG = "HS256";

type JWTPayload = {
  userId: string;
};

type JWT = JWTPayload & { expiresAt: Date };

export const encryptJWT = async (jwtPayload: JWTPayload) => {
  const authCookie = await new jose.SignJWT(jwtPayload)
    .setProtectedHeader({ alg: SIGN_ALG })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime("15m")
    .sign(JWT_SIGNING_KEY);

  return authCookie;
};

export const decryptJWT = async (cookie: string) => {
  try {
    return await jose.jwtVerify<JWT>(cookie, JWT_SIGNING_KEY, {
      issuer: ISSUER,
    });
  } catch (err) {
    console.error(err);
  }
};
