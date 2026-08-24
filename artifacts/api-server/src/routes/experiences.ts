import { Router } from "express";
import { db, experiencesTable, insertExperienceSchema } from "@workspace/db";
import { eq, asc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// GET /api/experiences
router.get("/", async (req, res) => {
  try {
    const list = await db.select().from(experiencesTable).orderBy(asc(experiencesTable.order));
    return res.json(list);
  } catch (error) {
    console.error("Fetch experiences error:", error);
    return res.status(500).json({ error: "Failed to fetch experiences" });
  }
});

// POST /api/experiences (Protected)
router.post("/", requireAuth, async (req, res) => {
  try {
    const parsed = insertExperienceSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.format() });
    }

    const [created] = await db.insert(experiencesTable).values(parsed.data).returning();
    return res.status(201).json(created);
  } catch (error) {
    console.error("Create experience error:", error);
    return res.status(500).json({ error: "Failed to create experience" });
  }
});

// PUT /api/experiences/:id (Protected)
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(paramId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid experience ID" });
    }

    const parsed = insertExperienceSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", details: parsed.error.format() });
    }

    const [updated] = await db
      .update(experiencesTable)
      .set(parsed.data)
      .where(eq(experiencesTable.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Experience not found" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("Update experience error:", error);
    return res.status(500).json({ error: "Failed to update experience" });
  }
});

// DELETE /api/experiences/:id (Protected)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(paramId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid experience ID" });
    }

    const [deleted] = await db
      .delete(experiencesTable)
      .where(eq(experiencesTable.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: "Experience not found" });
    }

    return res.json({ message: "Experience deleted successfully", deleted });
  } catch (error) {
    console.error("Delete experience error:", error);
    return res.status(500).json({ error: "Failed to delete experience" });
  }
});

export default router;
