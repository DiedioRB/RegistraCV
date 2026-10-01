import pdf from "pdf-parse/lib/pdf-parse.js";
import { prisma } from "../db.js";
import { extractCurriculumFields as defaultExtractor } from "../extractors/curriculumExtractor.js";
import { deleteStoredPdf, saveStoredPdf } from "../services/curriculaStorage.js";

const curriculumFields = ["name", "email", "phone", "interestRole", "resumee"];

export function createCurriculaController({
  curriculumRepository = prisma.curricula,
  parsePdf = pdf,
  extractCurriculumFields = defaultExtractor,
  persistPdf = saveStoredPdf,
  removePdf = deleteStoredPdf
} = {}) {
  return {
    async list(_req, res, next) {
      try {
        const curricula = await curriculumRepository.findMany({
          orderBy: { createdAt: "desc" }
        });
        res.json(curricula);
      } catch (error) {
        next(error);
      }
    },

    async extract(req, res, next) {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "Selecione um arquivo PDF para extrair os dados." });
        }

        const parsedPdf = await parsePdf(req.file.buffer);
        const fields = await extractCurriculumFields(parsedPdf.text);
        res.json({ fields, pages: parsedPdf.numpages });
      } catch (error) {
        next(error);
      }
    },

    async create(req, res, next) {
      let storedFilePath;
      try {
        const data = Object.fromEntries(
          curriculumFields.map((field) => [field, req.body[field] || null])
        );
        data.name = data.name?.trim() ?? "";
        data.email = data.email?.trim() ?? "";
        for (const field of ["phone", "interestRole", "resumee"]) {
          data[field] = data[field]?.trim() || null;
        }

        if (!data.name || !data.email) {
          return res.status(400).json({ error: "Nome e e-mail são obrigatórios." });
        }

        if (req.file) {
          storedFilePath = await persistPdf(req.file.buffer);
        }

        const curriculum = await curriculumRepository.create({
          data: { ...data, filePath: storedFilePath ?? null }
        });
        res.status(201).json(curriculum);
      } catch (error) {
        if (storedFilePath) {
          try {
            await removePdf(storedFilePath);
          } catch (cleanupError) {
            console.error("Não foi possível remover o PDF após falha ao salvar o currículo.", cleanupError);
          }
        }
        next(error);
      }
    }
  };
}

export const curriculaController = createCurriculaController();
