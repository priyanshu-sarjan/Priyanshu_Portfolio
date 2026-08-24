import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db, assetsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// Ensure upload directory exists
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Storage engine configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, WEBP, SVG, and PDF files are allowed."));
    }
  },
});

// GET /api/assets
router.get("/", async (req, res) => {
  try {
    const list = await db.select().from(assetsTable).orderBy(desc(assetsTable.createdAt));
    return res.json(list);
  } catch (error) {
    console.error("Fetch assets error:", error);
    return res.status(500).json({ error: "Failed to fetch assets" });
  }
});

// POST /api/assets/upload (Protected)
router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = req.file;
    const category = req.body.category || (file.mimetype === "application/pdf" ? "certificate" : "image");
    const fileUrl = `/uploads/${file.filename}`;

    const [newAsset] = await db
      .insert(assetsTable)
      .values({
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: fileUrl,
        thumbnailUrl: file.mimetype.startsWith("image/") ? fileUrl : undefined,
        category,
      })
      .returning();

    return res.status(201).json(newAsset);
  } catch (error: any) {
    console.error("File upload error:", error);
    return res.status(500).json({ error: error.message || "Failed to upload file" });
  }
});

// DELETE /api/assets/:id (Protected)
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const paramId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(paramId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid asset ID" });
    }

    const [asset] = await db.select().from(assetsTable).where(eq(assetsTable.id, id));
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // Remove file from storage
    const filePath = path.join(UPLOAD_DIR, asset.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove DB record
    await db.delete(assetsTable).where(eq(assetsTable.id, id));

    return res.json({ message: "Asset deleted successfully", id });
  } catch (error) {
    console.error("Delete asset error:", error);
    return res.status(500).json({ error: "Failed to delete asset" });
  }
});

export default router;
