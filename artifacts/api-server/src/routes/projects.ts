import { Router } from "express";
import { db } from "@workspace/db";
import { projectsTable } from "@workspace/db";
import { CreateProjectBody, UpdateProjectBody, GetProjectParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

const toJSON = (row: typeof projectsTable.$inferSelect) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  techStack: row.techStack,
  githubUrl: row.githubUrl ?? null,
  liveUrl: row.liveUrl ?? null,
  imageUrl: row.imageUrl ?? null,
  featured: row.featured,
  createdAt: row.createdAt.toISOString(),
});

router.get("/projects", async (req, res) => {
  const rows = await db.select().from(projectsTable).orderBy(projectsTable.createdAt);
  res.json(rows.map(toJSON));
});

router.post("/projects", requireAuth, async (req, res) => {
  const parsed = CreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const inserted = await db.insert(projectsTable).values(parsed.data).returning();
  res.status(201).json(toJSON(inserted[0]));
});

router.get("/projects/:id", async (req, res) => {
  const params = GetProjectParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const rows = await db.select().from(projectsTable).where(eq(projectsTable.id, params.data.id));
  if (rows.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(toJSON(rows[0]));
});

router.put("/projects/:id", requireAuth, async (req, res) => {
  const params = GetProjectParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const parsed = UpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const updated = await db.update(projectsTable)
    .set(parsed.data)
    .where(eq(projectsTable.id, params.data.id))
    .returning();
  if (updated.length === 0) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(toJSON(updated[0]));
});

router.delete("/projects/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  await db.delete(projectsTable).where(eq(projectsTable.id, id));
  res.status(204).send();
});

export default router;
