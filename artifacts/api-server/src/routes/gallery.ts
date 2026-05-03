import { Router } from "express";
import { db } from "@workspace/db";
import { galleryTable } from "@workspace/db";
import { CreateGalleryImageBody, DeleteGalleryImageParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

const toJSON = (row: typeof galleryTable.$inferSelect) => ({
  id: row.id,
  url: row.url,
  caption: row.caption ?? null,
  eventName: row.eventName ?? null,
  createdAt: row.createdAt.toISOString(),
});

router.get("/gallery", async (req, res) => {
  const rows = await db.select().from(galleryTable).orderBy(galleryTable.createdAt);
  res.json(rows.map(toJSON));
});

router.post("/gallery", async (req, res) => {
  const parsed = CreateGalleryImageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const inserted = await db.insert(galleryTable).values(parsed.data).returning();
  res.status(201).json(toJSON(inserted[0]));
});

router.delete("/gallery/:id", async (req, res) => {
  const params = DeleteGalleryImageParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  await db.delete(galleryTable).where(eq(galleryTable.id, params.data.id));
  res.status(204).send();
});

export default router;
