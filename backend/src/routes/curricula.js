import { Router } from "express";
import { curriculaController } from "../controllers/curriculaController.js";
import uploadPdf from "../middleware/uploadPdf.js";

export function createCurriculaRouter(controller = curriculaController) {
  const router = Router();

  router.get("/", controller.list);
  router.get("/:id/pdf", controller.downloadPdf);
  router.post("/extract", uploadPdf.single("file"), controller.extract);
  router.post("/", uploadPdf.single("file"), controller.create);

  return router;
}

export default createCurriculaRouter();
