import { prisma } from "../db.js";

export function createHealthController(checkDatabase = () => prisma.$queryRaw`SELECT 1`) {
  return async function health(_req, res) {
    try {
      await checkDatabase();
      res.json({ status: "ok", database: "connected" });
    } catch {
      res.status(503).json({ status: "error", database: "unavailable" });
    }
  };
}

export const healthController = createHealthController();
