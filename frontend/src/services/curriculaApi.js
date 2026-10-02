const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

async function readResponse(response) {
  const result = await response.json();
  if (!response.ok) throw new Error(result.error ?? "Não foi possível concluir a operação.");
  return result;
}

export async function listCurricula({ fetchImpl = fetch, baseUrl = API_URL } = {}) {
  return readResponse(await fetchImpl(`${baseUrl}/curricula`));
}

export function curriculumPdfUrl(id, baseUrl = API_URL) {
  return `${baseUrl}/curricula/${id}/pdf`;
}

export async function extractCurriculum(formData, {
  fetchImpl = fetch,
  baseUrl = API_URL
} = {}) {
  return readResponse(await fetchImpl(`${baseUrl}/curricula/extract`, {
    method: "POST",
    body: formData
  }));
}

export async function createCurriculum(formData, {
  fetchImpl = fetch,
  baseUrl = API_URL
} = {}) {
  return readResponse(await fetchImpl(`${baseUrl}/curricula`, {
    method: "POST",
    body: formData
  }));
}
