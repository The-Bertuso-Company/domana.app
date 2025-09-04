import { Request, Response, NextFunction } from "express";
export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  const got = req.header("X-Api-Key") || "";
  const expect = process.env.API_DEV_KEY || "dev-12345";
  if (got !== expect) return res.status(401).json({ error: "unauthorized" });
  (req as any).apiPrincipal = { scopes: ["read"] };
  next();
}