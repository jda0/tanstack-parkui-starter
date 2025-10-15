import type { Kysely } from "kysely";

const INDEXES = [
  ["user", "email"],
  ["account", "userId"],
  ["session", "userId"],
  ["session", "token"],
  ["verification", "identifier"],
  ["invitation", "email"],
  ["invitation", "organizationId"],
  ["member", "organizationId"],
  ["member", "userId"],
  ["organization", "slug"],
] as const;

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.notNull().unique())
    .addColumn("emailVerified", "boolean", (col) => col.notNull())
    .addColumn("image", "text")
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo("CURRENT_TIMESTAMP")
    )
    .addColumn("updatedAt", "timestamptz", (col) =>
      col.notNull().defaultTo("CURRENT_TIMESTAMP")
    )
    .execute();

  await db.schema
    .createTable("session")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("expiresAt", "timestamptz", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo("CURRENT_TIMESTAMP")
    )
    .addColumn("updatedAt", "timestamptz", (col) =>
      col.notNull().defaultTo("CURRENT_TIMESTAMP")
    )
    .addColumn("ipAddress", "text")
    .addColumn("userAgent", "text")
    .addColumn("userId", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade")
    )
    .addColumn("activeOrganizationId", "text")
    .execute();

  await db.schema
    .createTable("account")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("accountId", "text", (col) => col.notNull())
    .addColumn("providerId", "text", (col) => col.notNull())
    .addColumn("userId", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade")
    )
    .addColumn("accessToken", "text")
    .addColumn("refreshToken", "text")
    .addColumn("idToken", "text")
    .addColumn("accessTokenExpiresAt", "timestamptz")
    .addColumn("refreshTokenExpiresAt", "timestamptz")
    .addColumn("scope", "text")
    .addColumn("password", "text")
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo("CURRENT_TIMESTAMP")
    )
    .addColumn("updatedAt", "timestamptz", (col) =>
      col.notNull().defaultTo("CURRENT_TIMESTAMP")
    )
    .execute();

  await db.schema
    .createTable("verification")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("value", "text", (col) => col.notNull())
    .addColumn("expiresAt", "timestamptz", (col) => col.notNull())
    .addColumn("createdAt", "timestamptz", (col) =>
      col.notNull().defaultTo("CURRENT_TIMESTAMP")
    )
    .addColumn("updatedAt", "timestamptz", (col) =>
      col.notNull().defaultTo("CURRENT_TIMESTAMP")
    )
    .execute();

  await db.schema
    .createTable("organization")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("slug", "text", (col) => col.notNull().unique())
    .addColumn("logo", "text")
    .addColumn("createdAt", "timestamptz", (col) => col.notNull())
    .addColumn("metadata", "text")
    .execute();

  await db.schema
    .createTable("member")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("organizationId", "text", (col) =>
      col.notNull().references("organization.id").onDelete("cascade")
    )
    .addColumn("userId", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade")
    )
    .addColumn("role", "text", (col) => col.notNull())
    .addColumn("createdAt", "timestamptz", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("invitation")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("organizationId", "text", (col) =>
      col.notNull().references("organization.id").onDelete("cascade")
    )
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("role", "text")
    .addColumn("status", "text", (col) => col.notNull())
    .addColumn("expiresAt", "timestamptz", (col) => col.notNull())
    .addColumn("inviterId", "text", (col) =>
      col.notNull().references("user.id").onDelete("cascade")
    )
    .execute();

  for (const [table, column] of INDEXES) {
    await db.schema
      .createIndex(`idx_${table}_${column}`)
      .on(table)
      .column(column)
      .execute();
  }
}

// `any` is required here since migrations should be frozen in time. alternatively, keep a "snapshot" db interface.
export async function down(db: Kysely<any>): Promise<void> {
  for (const [table, column] of INDEXES) {
    await db.schema.dropIndex(`idx_${table}_${column}`).execute();
  }

  await db.schema.dropTable("invitation").execute();
  await db.schema.dropTable("member").execute();
  await db.schema.dropTable("organization").execute();
  await db.schema.dropTable("verification").execute();
  await db.schema.dropTable("account").execute();
  await db.schema.dropTable("session").execute();
  await db.schema.dropTable("user").execute();
}
