import { Request, Response } from "express";
import { createUser, loginUser, logoutUser } from "../services/user.services";
import { sendError, sendSuccess } from "../utils/apiResponse";

export const registerUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Credentials are missing");
  }

  const user = await createUser({ email, password });

  return sendSuccess(res, 201, {
    user,
  });
};

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Credentials are missing");
  }

  const loginData = await loginUser({ email, password });
  const { refreshToken, accessToken, user } = loginData;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
  });

  return sendSuccess(res, 200, {
    user,
    accessToken,
  });
};

export const logoutController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
 
  if (!refreshToken) {
    return sendError(res, 400, "refreshToken is required");
  }

  await logoutUser(refreshToken);
  res.clearCookie("refreshToken");

  return sendSuccess(res, 200, {});
};
