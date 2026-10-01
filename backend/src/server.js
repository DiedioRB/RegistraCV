import app from "./app.js";
import { prisma } from "./db.js";

const port = Number(process.env.PORT ?? 3000);
const server = app.listen(port, () => console.log(`Backend disponível na porta ${port}.`));

const shutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

