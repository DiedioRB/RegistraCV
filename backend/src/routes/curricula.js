import { Router } from "express";
import { curriculaController as curriculaController } from "../controllers/curriculaController.js";
import uploadPdf from "../middleware/uploadPdf.js";

const router = Router();

router.get("/", curriculaController.list);
router.post("/extract", uploadPdf.single("file"), curriculaController.extract);
router.post("/", uploadPdf.single("file"), curriculaController.create);

export default router;
