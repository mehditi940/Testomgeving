import "dotenv/config";
import db from "../schemas/db";
import { userSchema } from "../schemas/user";

async function main() {
  const users = await db.select().from(userSchema);
  console.log(users.map(u => ({ id: u.id, email: u.email, role: u.role, createdAt: u.createdAt })));
}

main().catch((e) => { console.error(e); process.exit(1); });

