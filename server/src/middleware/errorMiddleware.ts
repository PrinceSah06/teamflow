import { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/apiResponse";

export const notFoundHandler = (req: Request, res: Response) => {
  return sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const message = error.message || "Something went wrong";

  return sendError(res, 500, message);
};
