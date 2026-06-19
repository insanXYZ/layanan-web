import "dotenv/config";
import * as jose from "jose";
import { NextRequest } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_KEY);
const alg = "HS256";

interface CreateToken {
  payload: jose.JWTPayload;
  exp: string;
}

export const CreateToken = (v: CreateToken): Promise<string> => {
  return new jose.SignJWT(v.payload)
    .setProtectedHeader({
      alg: alg,
    })
    .setExpirationTime(v.exp)
    .sign(secret);
};

export const VerifyJwt = async (token: string): Promise<boolean> => {
  try {
    await jose.jwtVerify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
};

export const DecodeJwt = (req: NextRequest) => {
  const token = req.cookies.get("X-ACC-TOKEN")?.value;

  if (!token) {
    throw new Error("token tidak ada");
  }

  return jose.decodeJwt(token);
};
