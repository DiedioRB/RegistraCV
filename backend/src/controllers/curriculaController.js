import pdf from "pdf-parse/lib/pdf-parse.js";
import { lstat } from "node:fs/promises";
import { prisma } from "../db.js";
import { extractCurriculumFields as defaultExtractor } from "../extractors/curriculumExtractor.js";
import {
  deleteStoredPdf,
  resolveStoredPdf,
  saveStoredPdf
} from "../services/curriculaStorage.js";

const curriculumFields = ["name", "email", "phone", "interestRole", "resumee"];

export function createCurriculaController({
  curriculumRepository = prisma.curricula,
  parsePdf = pdf,
  extractCurriculumFields = defaultExtractor,
  persistPdf = saveStoredPdf,
  removePdf = deleteStoredPdf,
  resolvePdf = resolveStoredPdf,
  inspectPdf = lstat
} = {}) {
  return {
    async list(_req, res, next) {
      try {
        const curricula = await curriculumRepository.findMany({
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            interestRole: true,
            resumee: true,
            filePath: true,
            createdAt: true
          }
        });
        res.json(curricula.map(({ filePath, ...curriculum }) => ({
          ...curriculum,
          hasPdf: Boolean(filePath)
        })));
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

    async downloadPdf(req, res, next) {
      const id = Number(req.params.id);
      if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).json({ error: "Identificador de currículo inválido." });
      }

      try {
        const curriculum = await curriculumRepository.findUnique({
          where: { id },
          select: { filePath: true }
        });
        if (!curriculum?.filePath) {
          return res.status(404).json({ error: "O currículo não possui PDF cadastrado." });
        }

        let absolutePath;
        try {
          absolutePath = resolvePdf(curriculum.filePath);
          const fileInfo = await inspectPdf(absolutePath);
          if (!fileInfo.isFile()) {
            return res.status(404).json({ error: "Arquivo não encontrado." });
          }
        } catch (error) {
          if (
            error.code === "ENOENT" ||
            error.code === "ENOTDIR" ||
            error.code === "EINVAL" ||
            error.code === "INVALID_PDF_REFERENCE"
          ) {
            return res.status(404).json({ error: "PDF não encontrado para este currículo." });
          }
          throw error;
        }

        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="curriculum-${id}.pdf"`,
          "X-Content-Type-Options": "nosniff"
        });
        res.sendFile(absolutePath, (error) => {
          if (!error) return;
          if (res.headersSent) return res.destroy(error);
          next(error);
        });
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
