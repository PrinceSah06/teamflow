import { Request, Response } from "express";
import {
  acceptInviteService,
  createOrgsService,
  generateInviteLinkService,
  myOrgsService,
} from "../services/orgs.services";
import { sendError, sendSuccess } from "../utils/apiResponse";

export const createOrganization = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return sendError(res, 401, "Unauthorized user");
  }

  const { organization, membership } = await createOrgsService(userId);

  return sendSuccess(res, 201, {
    userId,
    organization,
    membership,
  });
};

export const getMyOrganizations = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    return sendError(res, 401, "Unauthorized user");
  }

  const organizations = await myOrgsService(userId);

  return sendSuccess(res, 200, {
    userId,
    organizations,
  });
};

export const createInvite = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const orgId = req.params.orgId;
  const { email } = req.body;

  if (!userId) {
    return sendError(res, 401, "Unauthorized user");
  }

  if (!orgId || typeof orgId !== "string") {
    return sendError(res, 400, "Organization id is required");
  }

  if (!email || typeof email !== "string") {
    return sendError(res, 400, "Email is required");
  }

  const invite = await generateInviteLinkService(userId, orgId, email);

  if (!invite) {
    return sendError(res, 403, "Not allowed");
  }

  return sendSuccess(res, 200, {
    inviteLink: invite.inviteLink,
    inviteToken: invite.inviteToken,
  });
};

export const acceptInvite = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const token = req.params.token;

  if (!userId) {
    return sendError(res, 401, "Unauthorized user");
  }

  if (!token || typeof token !== "string") {
    return sendError(res, 400, "Invite token is required");
  }

  const result = await acceptInviteService(userId, token);

  if (!result.success) {
    return sendError(res, result.status, result.error || "Unable to accept invite");
  }

  return sendSuccess(res, result.status, {
    message: result.message,
  });
};
