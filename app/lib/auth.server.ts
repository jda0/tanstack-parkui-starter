import { createId } from "@paralleldrive/cuid2";
import { betterAuth } from "better-auth";
import { organization } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { pool } from "./database.server";

export const auth = betterAuth({
  advanced: { database: { generateId: createId } },
  database: pool,
  emailAndPassword: { enabled: true },
  plugins: [organization(), reactStartCookies()],
});

// create default user
(async function createDefaultUser() {
  if (!process.env.DEFAULT_USER) return;

  const [email, password] = process.env.DEFAULT_USER.split(":", 2);
  if (!email || !password) {
    throw new Error("DEFAULT_USER must be in the format email:password");
  }

  const ctx = await auth.$context;

  const existingUser = await ctx.internalAdapter.findUserByEmail(email);
  if (existingUser) {
    return console.info("Default user already exists");
  }

  const { id: userId } = await ctx.internalAdapter.createUser({
    email,
    emailVerified: true,
    name: "Default User",
    password,
  });

  const { accountId } = await ctx.internalAdapter.linkAccount({
    accountId: userId,
    providerId: "credential",
    password: await ctx.password.hash(password),
    userId: userId,
  });

  console.info("Default user created:", { accountId, email });
})();
