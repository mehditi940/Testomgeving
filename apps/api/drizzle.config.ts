import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import path from "node:path";

function resolveDbUrl(raw: string): string {
  if (!raw) throw new Error("DB_FILE_NAME is not set");
  // Drizzle-kit resolves relative to the monorepo root (apps/), not this folder.
  // When we get a typical value like 'file:./uploads/dev.sqlite', rewrite it
  // to be relative to apps/ so CLI resolves to apps/api/uploads/dev.sqlite.
  if (raw.startsWith("file:./uploads")) {
    // Point to apps/uploads to match drizzle-kit path resolution in monorepos
    const appsRoot = path.resolve(__dirname, "../");
    const abs = path.resolve(appsRoot, "uploads", raw.split("/").pop() || "dev.sqlite");
    return "file:" + abs.replace(/\\/g, "/");
  }
  if (raw.startsWith("file:")) {
    const rel = raw.slice("file:".length);
    const abs = path.resolve(__dirname, rel);
    return `file:${abs}`;
  }
  return raw;
}

export default defineConfig({
  out: "./drizzle",
  schema: "./schemas",
  dialect: "sqlite",
  dbCredentials: {
    url: resolveDbUrl(process.env.DB_FILE_NAME!),
  },
});
