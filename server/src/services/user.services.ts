import { eq } from "drizzle-orm";
import { db } from "../db";
import { refreshTokenTable, users } from "../db/schema";
import { compareHash, hashPassword } from "../utils/hashPassword";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";

interface CreateUserInput {
  email: string;
  password: string;
}

const getRefreshTokenExpiryDate = () => {
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

  return new Date(Date.now() + sevenDaysInMs);
};

export const createUser = async ({ email, password }: CreateUserInput) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const passwordHash = await hashPassword(password);

  const [newUser] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
    })
    .returning({
      id: users.id,
      email: users.email,
      createdAt: users.createdAt,
    });

  return newUser;
};

export const loginUser = async ({ email, password }: CreateUserInput) => {

  console.log('....................login services here ...................')
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!existingUser) {
    throw new Error("Invalid email or password");
  }

  const isPasswordCorrect = await compareHash(password, existingUser.passwordHash);

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(existingUser.id);
  const refreshToken = generateRefreshToken(existingUser.id);

  await db.insert(refreshTokenTable).values({
    token: refreshToken,
    userId: existingUser.id,
    expires_at: getRefreshTokenExpiryDate(),
  });

  return {
    user: {
      id: existingUser.id,
      email: existingUser.email,
      createdAt: existingUser.createdAt,
    },
    accessToken,
    refreshToken,
  };
};

export const logoutUser = async (refreshToken: string) => {
  await db
    .delete(refreshTokenTable)
    .where(eq(refreshTokenTable.token, refreshToken));
};
