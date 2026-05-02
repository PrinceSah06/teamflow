import { db } from "../db";
import { inviteTokens, member, organizations } from "../db/schema";
import { and, eq } from "drizzle-orm";
import crypto from "crypto";

const INVITE_EXPIRES_IN_MS = 48 * 60 * 60 * 1000;

export const createOrgsService = async (userId: string) => {
  const [organization] = await db
    .insert(organizations)
    .values({
      name: "owner",
      ownerId: userId,
    })
    .returning();

  const [membership] = await db
    .insert(member)
    .values({
      orgId: organization.id,
      userId,
      role: "owner",
    })
    .returning();

  return { organization, membership };
};

export const myOrgsService = async (userId: string) => {
  const orgs = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      createdAt: organizations.createdAt,
      role: member.role,
    })
    .from(member)
    .innerJoin(organizations, eq(member.orgId, organizations.id))
    .where(eq(member.userId, userId));

  return orgs;
};

export const generateInviteLinkService = async (
  userId: string,
  orgId: string,
  invitedEmail: string
) => {
  const membership = await db.query.member.findFirst({
    where: and(eq(member.userId, userId), eq(member.orgId, orgId)),
  });

  if (!membership || !["owner", "admin"].includes(membership.role)) {
    return null;
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + INVITE_EXPIRES_IN_MS);

  const [inviteToken] = await db
    .insert(inviteTokens)
    .values({
      token,
      orgId,
      invitedEmail,
      expiresAt,
      used: false,
    })
    .returning();

  return {
    inviteToken,
    inviteLink: `http://localhost:5173/invite/${token}`,
  };
};

export const acceptInviteService = async (userId: string, token: string) => {
  const invite = await db.query.inviteTokens.findFirst({
    where: eq(inviteTokens.token, token),
  });

  if (!invite) {
    return { success: false, status: 404, error: "Invalid token" };
  }

  if (new Date() > invite.expiresAt) {
    return { success: false, status: 400, error: "Token expired" };
  }

  if (invite.used) {
    return { success: false, status: 400, error: "Already used" };
  }

  const existingMembership = await db.query.member.findFirst({
    where: and(eq(member.userId, userId), eq(member.orgId, invite.orgId)),
  });

  if (existingMembership) {
    return { success: false, status: 400, error: "Already member" };
  }

  await db.transaction(async (tx) => {
    await tx.insert(member).values({
      userId,
      orgId: invite.orgId,
      role: "member",
    });

    await tx
      .update(inviteTokens)
      .set({ used: true })
      .where(eq(inviteTokens.id, invite.id));
  });

  return { success: true, status: 200, message: "Joined organization" };
};
