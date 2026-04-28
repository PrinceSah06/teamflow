import { Response, NextFunction } from "express";
import { veryfyAccessToken } from "../utils/tokens";
import { AuthRequest } from "../types/express";

export const authMiddlware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("inside auth middleware");
  const header = req.headers.authorization;
  const token = header && header.split(" ")[1];
  console.log(token);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized user",
    });
  }

  try {
    const user = veryfyAccessToken(token);
    console.log("decoded token user:", user);

    req.user = {
      userId: user.userId,
    };

    return next();
  } catch (error) {
    console.log("Something went wrong", error);
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};
