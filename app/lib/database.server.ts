import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const dialect = new PostgresDialect({ pool });

const db = new Kysely({ dialect });

export { pool, dialect, db };
