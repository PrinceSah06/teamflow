import { Request, Response } from "express";
import { createUser, loginUser, logoutUser } from "../services/user.services";

interface RegisterResponse {
  message: string;
  code?: number;
  user?: {
    id: string;
    email: string;
    createdAt: Date;
  };
}

export const registerUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Credentials are missing");
  }

  const user = await createUser({ email, password });

  const response: RegisterResponse = {
    message: "user registered successfully",
    code: 201,
    user,
  };

  res.status(201).json(response);
};

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Credentials are missing");
  }

  const loginData = await loginUser({ email, password });


  const {refreshToken,accessToken,user}= loginData

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(200).json({
    message: "user logged in successfully",
    code: 200,
    user,
    accessToken
  });
};


export const logoutController =async (req:Request,res:Response)=>{

  const refreshToken = req.cookies.refreshToken;
 
  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken is required" });
  }

  await logoutUser(refreshToken);
  res.clearCookie("refreshToken");

  return res.status(200).json({ message: "logged out successfully" });
};
