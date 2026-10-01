import multer from "multer";

const uploadPdf = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      return callback(new Error("Envie um arquivo PDF."));
    }
    callback(null, true);
  }
});

export default uploadPdf;
