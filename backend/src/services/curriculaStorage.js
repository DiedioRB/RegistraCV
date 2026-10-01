import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const storageDirectory = path.resolve(process.cwd(), "storage");

export async function saveStoredPdf(buffer) {
  await mkdir(storageDirectory, { recursive: true });
  const fileName = `${randomUUID()}.pdf`;
  const absolutePath = path.join(storageDirectory, fileName);
  await writeFile(absolutePath, buffer, { flag: "wx" });
  return path.posix.join("storage", fileName);
}

export async function deleteStoredPdf(relativePath) {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  if (path.dirname(absolutePath) !== storageDirectory) {
    throw new Error("Caminho de arquivo fora da pasta storage.");
  }
  await rm(absolutePath, { force: true });
}
