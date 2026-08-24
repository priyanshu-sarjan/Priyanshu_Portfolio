import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { JWT_SECRET, requireAuth, type AuthRequest } from "../middlewares/auth";

const router = Router();

const DEFAULT_ADMIN_USER = process.env.ADMIN_USER || "admin";
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || "admin123456";

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    let user: typeof usersTable.$inferSelect | undefined;
    
    try {
      const users = await db.select().from(usersTable).where(eq(usersTable.username, username)).limit(1);
      user = users[0];
    } catch (dbErr) {
      // Database might not have users table created yet or initialized
      console.warn("DB user query warning, attempting fallback admin authentication", dbErr);
    }

    let isValid = false;

    if (user) {
      isValid = await bcrypt.compare(password, user.passwordHash);
    } else {
      // Fallback check against default admin environment/fallback config
      if (username === DEFAULT_ADMIN_USER && password === DEFAULT_ADMIN_PASS) {
        isValid = true;
        user = {
          id: 1,
          username: DEFAULT_ADMIN_USER,
          passwordHash: "",
          role: "admin",
          createdAt: new Date(),
        };
      }
    }

    if (!isValid || !user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "lax",
    });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error during login" });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, (req: AuthRequest, res) => {
  return res.json({
    user: req.user,
  });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out successfully" });
});

export default router;
