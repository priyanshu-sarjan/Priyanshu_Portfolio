import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "super-secret-jwt-key-priyanshu-portfolio-2026";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401).json({ error: "Unauthorized: Missing authentication token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    return;
  }
}
