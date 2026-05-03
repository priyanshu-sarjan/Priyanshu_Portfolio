import { Router } from "express";
import { db } from "@workspace/db";
import { competitionsTable } from "@workspace/db";
import { CreateCompetitionBody, UpdateCompetitionBody, UpdateCompetitionParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

const toJSON = (row: typeof competitionsTable.$inferSelect) => ({
  id: row.id,
  title: row.title,
  organizer: row.organizer,
  type: row.type,
  date: row.date,
  result: row.result ?? null,
  createdAt: row.createdAt.toISOString(),
});

router.get("/competitions", async (req, res) => {
  const rows = await db.select().from(competitionsTable).orderBy(competitionsTable.date);
  res.json(rows.map(toJSON));
});

router.post("/competitions", async (req, res) => {
  const parsed = CreateCompetitionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const inserted = await db.insert(competitionsTable).values(parsed.data).returning();
  res.status(201).json(toJSON(inserted[0]));
});

router.put("/competitions/:id", async (req, res) => {
  const params = UpdateCompetitionParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateCompetitionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const updated = await db.update(competitionsTable)
    .set(parsed.data)
    .where(eq(competitionsTable.id, params.data.id))
    .returning();
  if (updated.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(toJSON(updated[0]));
});

router.delete("/competitions/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(competitionsTable).where(eq(competitionsTable.id, id));
  res.status(204).send();
});

export default router;
