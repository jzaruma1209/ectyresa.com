/**
 * Quita los símbolos de Markdown (#, **, -, etc.) y devuelve texto plano en una sola línea.
 * Se usa para resúmenes cortos donde no se puede mostrar formato.
 * @param {string} texto
 * @param {number} [max] Largo máximo; si se pasa, se corta sin partir palabras.
 */
export function stripMarkdown(texto, max) {
  const limpio = String(texto || "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/\*\*?([^*]+)\*\*?/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
  if (!max || limpio.length <= max) return limpio;
  return `${limpio.slice(0, max).replace(/\s+\S*$/, "")}…`;
}
