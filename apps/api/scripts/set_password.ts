import "dotenv/config";
import db from "../schemas/db";
import { userSchema } from "../schemas/user";
import { hashPassword } from "../utils/passwordHash";
import { eq } from "drizzle-orm";

async function main() {
  const email = process.env.TARGET_EMAIL || process.argv[2];
  const password = process.env.TARGET_PASSWORD || process.argv[3];

  if (!email || !password) {
    console.error("Usage: tsx ./scripts/set_password.ts <email> <newPassword> (or set TARGET_EMAIL and TARGET_PASSWORD)");
    process.exit(1);
  }

  const users = await db.select().from(userSchema).where(eq(userSchema.email, email)).limit(1);
  if (users.length === 0) {
    console.error(`User not found: ${email}`);
    process.exit(2);
  }

  const { hash, salt } = await hashPassword(password);

  await db
    .update(userSchema)
    .set({ password: hash, salt, updatedAt: new Date().toISOString() })
    .where(eq(userSchema.email, email));

  console.log(`Password updated for ${email}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

