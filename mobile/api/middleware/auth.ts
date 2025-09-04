import { Request, Response, NextFunction } from "express";
export function apiKeyAuth(req: Request & { apiPrincipal?: any }, res: Response, next: NextFunction) {
  const key = req.header("X-Api-Key") || "";
  if (key !== (process.env.API_DEV_KEY || "dev-12345")) return res.status(401).json({ error: "unauthorized" });
  req.apiPrincipal = { subj: "dev", scopes: ["read"] };
  next();
}
