import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const storageDirectory = path.resolve(process.cwd(), "storage");

export async function saveStoredPdf(buffer) {
  await mkdir(storageDirectory, { recursive: true });
  const fileName = `${randomUUID()}.pdf`;
  const absolutePath = path.join(storageDirectory, fileName);
  await writeFile(absolutePath, buffer, { flag: "wx" });
  return fileName;
}

export function resolveStoredPdf(relativePath) {

  const absolutePath = path.resolve(storageDirectory, `${relativePath}`);
  console.log("resolveStoredPdf", { relativePath, absolutePath, storageDirectory });
  if (path.dirname(absolutePath) !== storageDirectory) {
    throw new Error("Caminho de arquivo fora da pasta storage.");
  }
  return absolutePath;
}

export async function deleteStoredPdf(relativePath) {
  const absolutePath = resolveStoredPdf(relativePath);
  await rm(absolutePath, { force: true });
}
