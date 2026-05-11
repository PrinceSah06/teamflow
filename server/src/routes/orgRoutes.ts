import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { allowedUser } from "../middleware/authorizationMiddleware";
import {
  acceptInvite,
  createInvite,
  createOrganization,
  getOrganizationMembers,
  getMyOrganizations,
  removeMember,
} from "../controller/orgs.Controller";

const route = Router();

route.post("/api/orgs", authMiddleware, createOrganization);
route.get("/api/orgs/me", authMiddleware, getMyOrganizations);
route.get("/api/orgs/:orgId/members", authMiddleware, getOrganizationMembers);
route.delete("/api/orgs/:orgId/members/:memberId", authMiddleware, removeMember);
route.post(
  "/api/orgs/:orgId/invite-link",
  authMiddleware,
  allowedUser(["owner", "admin"]),
  createInvite
);
route.post("/api/invites/:token/accept", authMiddleware, acceptInvite);

export default route;
