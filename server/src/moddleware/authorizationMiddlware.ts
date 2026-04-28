import { and, eq } from "drizzle-orm";
import { Response, NextFunction } from "express";
import { db } from "../db";
import { member } from "../db/schema";
import { AuthRequest } from "../types/express";

type Role = "owner" | "admin" | "member";

export const allowedUser = (allowedRoles: Role[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    const orgId = req.params.orgId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized user",
      });
    }

    if (!orgId || typeof orgId !== "string") {
      return res.status(400).json({
        message: "Organization id is required",
      });
    }

    const membership = await db.query.member.findFirst({
      where: and(eq(member.userId, userId), eq(member.orgId, orgId)),
    });

    if (!membership) {
      return res.status(403).json({
        message: "You are not a member of this organization",
      });
    }

    if (!allowedRoles.includes(membership.role)) {
      return res.status(403).json({
        message: "You do not have permission to access this resource",
      });
    }

    return next();
  };
};
