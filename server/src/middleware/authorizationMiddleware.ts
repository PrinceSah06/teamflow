import { and, eq } from "drizzle-orm";
import { NextFunction, Response } from "express";
import { db } from "../db";
import { member } from "../db/schema";
import { AuthRequest } from "../types/express";
import { sendError } from "../utils/apiResponse";

type Role = "owner" | "admin" | "member";

export const allowedUser = (allowedRoles: Role[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const orgId = req.params.orgId;

    if (!userId) {
      return sendError(res, 401, "Unauthorized user");
    }

    if (!orgId || typeof orgId !== "string") {
      return sendError(res, 400, "Organization id is required");
    }

    const membership = await db.query.member.findFirst({
      where: and(eq(member.userId, userId), eq(member.orgId, orgId)),
    });

    if (!membership) {
      return sendError(res, 403, "You are not a member of this organization");
    }

    if (!allowedRoles.includes(membership.role)) {
      return sendError(res, 403, "You do not have permission to access this resource");
    }

    return next();
  };
};
