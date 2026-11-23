/**
 * Divide um texto simples em paragrafos, separando por linha em branco. Trechos vazios sao
 * descartados. O texto nunca e interpretado como HTML ou Markdown (evita XSS).
 */
export function splitParagraphs(text: string): string[] {
  return text
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}
