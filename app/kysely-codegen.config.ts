import type { Config } from "kysely-codegen";

export default {
  dialect: "postgres",
  outFile: "lib/database.d.ts",
} satisfies Config;
