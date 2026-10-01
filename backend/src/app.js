import express from "express";
import cors from "cors";
import CurriculaRoutes from "./routes/curricula.js";
import healthRoutes from "./routes/health.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/curricula", CurriculaRoutes);
app.use("/api/health", healthRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status ?? 500).json({ error: error.message ?? "Erro interno." });
});

export default app;
