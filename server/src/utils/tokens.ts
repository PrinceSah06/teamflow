import jwt from "jsonwebtoken";
import { env } from "../env";

export interface TokenPayload extends jwt.JwtPayload {
  userId: string;
}

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_EXPIRES,
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_EXPIRES,
  });
};

export const veryfyAccessToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET) as TokenPayload;
};


export const veryRefereshToken = (token: string) => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as TokenPayload;
};
