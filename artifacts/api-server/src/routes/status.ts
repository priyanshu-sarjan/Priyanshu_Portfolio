import { Router } from "express";
import { db } from "@workspace/db";
import { statusTable } from "@workspace/db";
import { UpdateStatusBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/status", async (req, res) => {
  let rows = await db.select().from(statusTable).limit(1);
  if (rows.length === 0) {
    const inserted = await db.insert(statusTable).values({ text: "Building something awesome..." }).returning();
    rows = inserted;
  }
  const row = rows[0];
  res.json({
    id: row.id,
    text: row.text,
    updatedAt: row.updatedAt.toISOString(),
  });
});

router.put("/status", async (req, res) => {
  const parsed = UpdateStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  let rows = await db.select().from(statusTable).limit(1);
  if (rows.length === 0) {
    const inserted = await db.insert(statusTable).values({ text: parsed.data.text }).returning();
    rows = inserted;
  } else {
    const updated = await db.update(statusTable)
      .set({ text: parsed.data.text, updatedAt: new Date() })
      .where(eq(statusTable.id, rows[0].id))
      .returning();
    rows = updated;
  }
  const row = rows[0];
  res.json({
    id: row.id,
    text: row.text,
    updatedAt: row.updatedAt.toISOString(),
  });
});

export default router;
