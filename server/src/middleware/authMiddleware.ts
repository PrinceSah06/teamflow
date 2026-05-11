import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/express";
import { sendError } from "../utils/apiResponse";
import { verifyAccessToken } from "../utils/tokens";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;
  const accessToken = authorizationHeader?.split(" ")[1];

  if (!accessToken) {
    return sendError(res, 401, "Unauthorized user");
  }

  try {
    const user = verifyAccessToken(accessToken);

    req.user = {
      userId: user.userId,
    };

    return next();
  } catch {
    return sendError(res, 401, "Invalid or expired token");
  }
};
