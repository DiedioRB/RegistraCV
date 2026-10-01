const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const phonePattern = /\((?:\+?\d[\d\s().-]{7,}\d)/;
const headingPattern = /^(curr[ií]culo|curriculum vitae|curriculum|resume|cv)$/i;

export function extractCurriculumFields(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const name = lines.find((line) => !headingPattern.test(line) && !emailPattern.test(line)) ?? "";

  return {
    name: name.trim(),
    email: text.match(emailPattern)?.[0] ?? "",
    phone: text.match(phonePattern)?.[0]?.trim() ?? "",
    interestRole: "",
    resumee: text.trim()
  };
}
