import "dotenv/config";
import db from "../schemas/db";
import { userSchema } from "../schemas/user";
import { eq } from "drizzle-orm";
import { hashPassword } from "../utils/passwordHash";

async function main() {
  const email = process.env.RESET_EMAIL || "admin@example.com";
  const newPassword = process.env.RESET_PASSWORD || "changeme";
  const { hash, salt } = await hashPassword(newPassword);

  const res = await db
    .update(userSchema)
    .set({ password: hash, salt })
    .where(eq(userSchema.email, email));

  console.log(`Password reset for ${email}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

