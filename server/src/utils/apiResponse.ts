import { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  data: T
) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  error: string
) => {
  return res.status(statusCode).json({
    success: false,
    error,
  });
};
