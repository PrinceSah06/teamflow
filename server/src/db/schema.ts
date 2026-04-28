import { pgEnum, pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role",["owner","admin","member"]);


export const users = pgTable("users",{
    id:uuid("id").defaultRandom().primaryKey(),
    email:text("email").unique().notNull(),
    passwordHash:text("password_hash").notNull(),
    createdAt:timestamp("created_at").defaultNow().notNull()
});

export const organizations = pgTable("organizations",{
    id:uuid('id').defaultRandom().primaryKey(),
    name:text('name').notNull(),
    ownerId:uuid('owner_id').references(()=> users.id).notNull(),
    createdAt:timestamp('created_at').defaultNow().notNull(),

})

export const member = pgTable('member',{
    id:uuid('id').defaultRandom().primaryKey(),
    userId:uuid('user_id').notNull().references(()=>users.id,{onDelete:'cascade'}).notNull(),
    orgId : uuid('org_id').notNull().references(()=>organizations.id,{onDelete:"cascade"}),
    role:roleEnum('role').default("member").notNull(),
    joinedAt:timestamp('joined_at').defaultNow().notNull(),
})

export const refreshTokenTable = pgTable("refresh_tokens", {
  token: text("token").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires_at: timestamp("expires_at").notNull(),
});

