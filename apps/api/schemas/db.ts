import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import path from "node:path";

function resolveDbUrl(raw: string): string {
  if (!raw) throw new Error("DB_FILE_NAME is not set");
  if (!raw.startsWith("file:")) return raw;

  const rel = raw.slice("file:".length); // e.g. ./uploads/dev.sqlite
  // Monorepo compatibility: use apps/ as base so CLI and runtime match
  const appsRoot = path.resolve(process.cwd(), "../" );   // from apps/api -> apps
  const abs = path.resolve(appsRoot, rel);                // -> apps/uploads/dev.sqlite
  return `file:${abs}`;
}

const client = createClient({
  url: resolveDbUrl(process.env.DB_FILE_NAME!),
});

const db = drizzle(client);
export default db;
