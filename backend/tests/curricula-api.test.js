import express from "express";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import request from "supertest";
import { jest, describe, expect, test } from "@jest/globals";

jest.unstable_mockModule("../src/db.js", () => ({
  prisma: { curricula: {} }
}));

const { createCurriculaController } = await import("../src/controllers/curriculaController.js");
const { createCurriculaRouter } = await import("../src/routes/curricula.js");

function createTestApp(dependencies) {
  const controller = createCurriculaController(dependencies);
  const app = express();
  app.use("/api/curricula", createCurriculaRouter(controller));
  app.use((error, _req, res, _next) => {
    res.status(error.status ?? 500).json({ error: error.message });
  });
  return app;
}

describe("API de currículos", () => {
  test("GET /api/curricula retorna os cadastros sem expor o caminho local do PDF", async () => {
    const curriculumRepository = {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 7,
          name: "Ana Silva",
          email: "ana@example.com",
          phone: null,
          interestRole: "Engenheira",
          resumee: "Formação acadêmica\nEngenharia",
          filePath: "storage/00000000-0000-4000-8000-000000000007.pdf",
          createdAt: "2026-10-02T12:00:00.000Z"
        }
      ])
    };
    const app = createTestApp({ curriculumRepository });

    const response = await request(app).get("/api/curricula");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      id: 7,
      name: "Ana Silva",
      email: "ana@example.com",
      hasPdf: true
    });
    expect(response.body[0]).not.toHaveProperty("filePath");
  });

  test("POST /api/curricula/extract retorna campos extraídos sem gravar no banco", async () => {
    const fields = {
      name: "Ana Silva",
      email: "ana@example.com",
      phone: "",
      interestRole: "Engenheira",
      resumee: "Formação acadêmica\nEngenharia"
    };
    const curriculumRepository = { create: jest.fn() };
    const parsePdf = jest.fn().mockResolvedValue({ text: "PDF text", numpages: 2 });
    const extractCurriculumFields = jest.fn().mockResolvedValue(fields);
    const app = createTestApp({ curriculumRepository, parsePdf, extractCurriculumFields });

    const response = await request(app)
      .post("/api/curricula/extract")
      .attach("file", Buffer.from("%PDF-1.7"), {
        filename: "curriculo.pdf",
        contentType: "application/pdf"
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ fields, pages: 2 });
    expect(parsePdf).toHaveBeenCalledTimes(1);
    expect(extractCurriculumFields).toHaveBeenCalledWith("PDF text");
    expect(curriculumRepository.create).not.toHaveBeenCalled();
  });

  test("POST /api/curricula persiste os campos e associa o PDF salvo", async () => {
    const createdCurriculum = {
      id: 12,
      name: "Ana Silva",
      email: "ana@example.com",
      filePath: "storage/00000000-0000-4000-8000-000000000012.pdf"
    };
    const curriculumRepository = {
      create: jest.fn().mockResolvedValue(createdCurriculum)
    };
    const persistPdf = jest.fn().mockResolvedValue(createdCurriculum.filePath);
    const app = createTestApp({ curriculumRepository, persistPdf });

    const response = await request(app)
      .post("/api/curricula")
      .field("name", "Ana Silva")
      .field("email", "ana@example.com")
      .field("interestRole", "Engenheira")
      .attach("file", Buffer.from("%PDF-1.7"), {
        filename: "curriculo.pdf",
        contentType: "application/pdf"
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(createdCurriculum);
    expect(persistPdf).toHaveBeenCalledTimes(1);
    expect(curriculumRepository.create).toHaveBeenCalledWith({
      data: {
        name: "Ana Silva",
        email: "ana@example.com",
        phone: null,
        interestRole: "Engenheira",
        resumee: null,
        filePath: createdCurriculum.filePath
      }
    });
  });

  test("GET /api/curricula/:id/pdf retorna PDF inline para o browser", async () => {
    const tempDirectory = await mkdtemp(path.join(tmpdir(), "registracv-pdf-"));
    const pdfPath = path.join(tempDirectory, "curriculo.pdf");
    const pdfContent = Buffer.from("%PDF-1.7\nconteudo");
    await writeFile(pdfPath, pdfContent);
    const curriculumRepository = {
      findUnique: jest.fn().mockResolvedValue({
        filePath: "storage/00000000-0000-4000-8000-000000000007.pdf"
      })
    };
    const inspectPdf = jest.fn().mockResolvedValue({ isFile: () => true });
    const resolvePdf = jest.fn().mockReturnValue(pdfPath);
    const app = createTestApp({ curriculumRepository, inspectPdf, resolvePdf });

    try {
      const response = await request(app)
        .get("/api/curricula/7/pdf")
        .buffer(true)
        .parse((res, callback) => {
          const chunks = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () => callback(null, Buffer.concat(chunks)));
        });

      expect(response.status).toBe(200);
      expect(response.headers["content-type"]).toMatch(/application\/pdf/);
      expect(response.headers["content-disposition"]).toBe('inline; filename="curriculum-7.pdf"');
      expect(response.body).toEqual(pdfContent);
      expect(resolvePdf).toHaveBeenCalledWith(
        "storage/00000000-0000-4000-8000-000000000007.pdf"
      );
    } finally {
      await rm(tempDirectory, { recursive: true, force: true });
    }
  });

  test("GET /api/curricula/:id/pdf rejeita IDs inválidos", async () => {
    const curriculumRepository = { findUnique: jest.fn() };
    const app = createTestApp({ curriculumRepository });

    const response = await request(app).get("/api/curricula/0/pdf");

    expect(response.status).toBe(400);
    expect(curriculumRepository.findUnique).not.toHaveBeenCalled();
  });
});
