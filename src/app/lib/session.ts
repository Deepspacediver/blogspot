import * as jose from "jose";

const JWT_SIGNING_KEY = jose.base64url.decode(process.env.BLOGSPOT_JWT_SECRET!);
const ISSUER = "blogspot";
const SIGN_ALG = "HS256";

type JWTCookie = {
  userId: string;
};

export const encryptJWT = async (jwtPayload: JWTCookie) => {
  const authCookie = await new jose.SignJWT(jwtPayload)
    .setProtectedHeader({ alg: SIGN_ALG })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setExpirationTime("15m")
    .sign(JWT_SIGNING_KEY);

  return authCookie;
};

export const decryptJWT = async (cookie: string) => {
  return await jose.jwtVerify(cookie, JWT_SIGNING_KEY, {
    issuer: ISSUER,
  });
};
