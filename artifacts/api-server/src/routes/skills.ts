import { Router } from "express";
import { db } from "@workspace/db";
import { skillsTable } from "@workspace/db";
import { CreateSkillBody, UpdateSkillBody, UpdateSkillParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

const toJSON = (row: typeof skillsTable.$inferSelect) => ({
  id: row.id,
  name: row.name,
  category: row.category,
  proficiency: row.proficiency,
  createdAt: row.createdAt.toISOString(),
});

router.get("/skills", async (req, res) => {
  const rows = await db.select().from(skillsTable).orderBy(skillsTable.category, skillsTable.name);
  res.json(rows.map(toJSON));
});

router.post("/skills", async (req, res) => {
  const parsed = CreateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const inserted = await db.insert(skillsTable).values(parsed.data).returning();
  res.status(201).json(toJSON(inserted[0]));
});

router.put("/skills/:id", async (req, res) => {
  const params = UpdateSkillParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateSkillBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const updated = await db.update(skillsTable)
    .set(parsed.data)
    .where(eq(skillsTable.id, params.data.id))
    .returning();
  if (updated.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(toJSON(updated[0]));
});

router.delete("/skills/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(skillsTable).where(eq(skillsTable.id, id));
  res.status(204).send();
});

export default router;
