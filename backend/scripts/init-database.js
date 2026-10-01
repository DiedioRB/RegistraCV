import sql from "mssql";

const config = {
  server: process.env.DB_HOST ?? "database",
  port: Number(process.env.DB_PORT ?? 1433),
  user: process.env.DB_USER ?? "sa",
  password: process.env.DB_PASSWORD,
  database: "master",
  options: { encrypt: true, trustServerCertificate: true },
  connectionTimeout: 10000,
  requestTimeout: 10000
};

if (!config.password) throw new Error("DB_PASSWORD não foi configurada.");

for (let attempt = 1; attempt <= 30; attempt += 1) {
  try {
    const pool = await sql.connect(config);
    const dbName = (process.env.DB_NAME ?? "RegistraCV").replaceAll("]", "]]");
    await pool.request().query(`IF DB_ID(N'${dbName}') IS NULL EXEC('CREATE DATABASE [${dbName}]')`);
    await pool.close();
    console.log(`Banco ${dbName} disponível.`);
    process.exit(0);
  } catch (error) {
    console.log(`Aguardando SQL Server (${attempt}/30): ${error.message}`);
    if (attempt === 30) throw error;
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}

