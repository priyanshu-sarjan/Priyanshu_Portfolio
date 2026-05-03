import { Router } from "express";
import { db } from "@workspace/db";
import { certificationsTable } from "@workspace/db";
import { CreateCertificationBody, UpdateCertificationBody, UpdateCertificationParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

const toJSON = (row: typeof certificationsTable.$inferSelect) => ({
  id: row.id,
  title: row.title,
  issuer: row.issuer,
  issueDate: row.issueDate,
  credentialUrl: row.credentialUrl ?? null,
  createdAt: row.createdAt.toISOString(),
});

router.get("/certifications", async (req, res) => {
  const rows = await db.select().from(certificationsTable).orderBy(certificationsTable.createdAt);
  res.json(rows.map(toJSON));
});

router.post("/certifications", async (req, res) => {
  const parsed = CreateCertificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const inserted = await db.insert(certificationsTable).values(parsed.data).returning();
  res.status(201).json(toJSON(inserted[0]));
});

router.put("/certifications/:id", async (req, res) => {
  const params = UpdateCertificationParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateCertificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const updated = await db.update(certificationsTable)
    .set(parsed.data)
    .where(eq(certificationsTable.id, params.data.id))
    .returning();
  if (updated.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(toJSON(updated[0]));
});

router.delete("/certifications/:id", async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(certificationsTable).where(eq(certificationsTable.id, id));
  res.status(204).send();
});

export default router;
