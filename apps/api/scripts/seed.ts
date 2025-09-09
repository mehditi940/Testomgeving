import "dotenv/config";
import db from "../schemas/db";
import { userSchema } from "../schemas/user";
import { hashPassword } from "../utils/passwordHash";
import { eq } from "drizzle-orm";

async function main() {
  const email = process.env.SEED_EMAIL || "admin@example.com";
  const password = process.env.SEED_PASSWORD || "changeme";
  const firstName = process.env.SEED_FIRSTNAME || "Admin";
  const lastName = process.env.SEED_LASTNAME || "User";

  // If user already exists, skip
  const existing = await db
    .select()
    .from(userSchema)
    .where(eq(userSchema.email, email))
    .limit(1);

  if (existing.length > 0) {
    console.log(`User already exists: ${email}`);
    return;
  }

  const { hash, salt } = await hashPassword(password);

  const inserted = await db
    .insert(userSchema)
    .values({
      email,
      password: hash,
      salt,
      firstName,
      lastName,
      role: "super-admin",
    })
    .returning();

  if (inserted.length === 0) {
    throw new Error("Failed to insert seed user");
  }

  console.log("Seed user created:");
  console.log({
    email,
    password,
    role: "super-admin",
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

