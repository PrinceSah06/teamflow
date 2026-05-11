import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { sendError } from "../utils/apiResponse";

export function validateData(schema: z.ZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const firstIssue = error.issues[0]?.message || "Invalid request data";
        return sendError(res, 400, firstIssue);
      }

      return sendError(res, 500, "Something went wrong");
    }
  };
}
