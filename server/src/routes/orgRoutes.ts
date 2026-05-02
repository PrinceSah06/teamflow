import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { allowedUser } from "../middleware/authorizationMiddleware";
import {
  acceptInvite,
  createInvite,
  createOrganization,
  getMyOrganizations,
} from "../controller/orgs.Controller";

const route = Router();

route.post("/api/orgs", authMiddleware, createOrganization);
route.get("/api/orgs/me", authMiddleware, getMyOrganizations);
route.post(
  "/api/orgs/:orgId/invite-link",
  authMiddleware,
  allowedUser(["owner", "admin"]),
  createInvite
);
route.post("/api/invites/:token/accept", authMiddleware, acceptInvite);

export default route;
