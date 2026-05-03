import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable } from "@workspace/db";
import { CreateEventBody, UpdateEventBody, UpdateEventParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

const toJSON = (row: typeof eventsTable.$inferSelect) => ({
  id: row.id,
  title: row.title,
  description: row.description ?? null,
  date: row.date,
  type: row.type,
  completed: row.completed,
  createdAt: row.createdAt.toISOString(),
});

router.get("/events", async (req, res) => {
  const rows = await db.select().from(eventsTable).orderBy(eventsTable.date);
  res.json(rows.map(toJSON));
});

router.post("/events", async (req, res) => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const inserted = await db.insert(eventsTable).values(parsed.data).returning();
  res.status(201).json(toJSON(inserted[0]));
});

router.put("/events/:id", async (req, res) => {
  const params = UpdateEventParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const updated = await db.update(eventsTable)
    .set(parsed.data)
    .where(eq(eventsTable.id, params.data.id))
    .returning();
  if (updated.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(toJSON(updated[0]));
});

router.delete("/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(eventsTable).where(eq(eventsTable.id, id));
  res.status(204).send();
});

export default router;
