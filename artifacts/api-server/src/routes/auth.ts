import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "riyadh_metro_salt").digest("hex");
}

router.post("/auth/signup", async (req, res): Promise<void> => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    res.status(400).json({ error: "name, email and password are required" });
    return;
  }

  if (typeof password !== "string" || password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing.length > 0) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  const passwordHash = hashPassword(password);
  const [user] = await db
    .insert(usersTable)
    .values({ name, email, passwordHash, rewardPoints: 0 })
    .returning();

  res.status(201).json({
    id: String(user.id),
    name: user.name,
    email: user.email,
    rewardPoints: user.rewardPoints,
    createdAt: user.createdAt.toISOString(),
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const hash = hashPassword(password);
  if (hash !== user.passwordHash) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  res.json({
    id: String(user.id),
    name: user.name,
    email: user.email,
    rewardPoints: user.rewardPoints,
    createdAt: user.createdAt.toISOString(),
  });
});

router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.sendStatus(204);
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const userIdHeader = req.headers["x-user-id"];
  const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;

  if (!userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const uid = parseInt(userId, 10);
  if (isNaN(uid)) {
    res.status(401).json({ error: "Invalid user" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, uid));

  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json({
    id: String(user.id),
    name: user.name,
    email: user.email,
    rewardPoints: user.rewardPoints,
    createdAt: user.createdAt.toISOString(),
  });
});

export default router;
