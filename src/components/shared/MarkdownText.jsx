import { Fragment } from "react";

/**
 * Convierte un texto con Markdown básico en elementos React (sin HTML crudo, sin dependencias).
 * Soporta: títulos (#, ##, ###), listas (- o *), listas numeradas (1.), **negrita**, *cursiva*
 * y párrafos separados por líneas en blanco. Los saltos de línea simples se respetan.
 */

// Negrita y cursiva dentro de una línea
function renderInline(texto, clave) {
  const partes = texto.split(/(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g).filter(Boolean);
  return partes.map((parte, i) => {
    if (parte.startsWith("**") && parte.endsWith("**") && parte.length > 4) {
      return <strong key={`${clave}-${i}`}>{parte.slice(2, -2)}</strong>;
    }
    if (parte.startsWith("*") && parte.endsWith("*") && parte.length > 2) {
      return <em key={`${clave}-${i}`}>{parte.slice(1, -1)}</em>;
    }
    return <Fragment key={`${clave}-${i}`}>{parte}</Fragment>;
  });
}

// Agrupa las líneas en bloques: título, lista, lista numerada o párrafo
function parsearBloques(texto) {
  const lineas = String(texto || "").replace(/\r\n?/g, "\n").split("\n");
  const bloques = [];
  let actual = null;

  const cerrar = () => {
    if (actual) bloques.push(actual);
    actual = null;
  };

  for (const cruda of lineas) {
    const linea = cruda.trim();
    if (!linea) {
      cerrar();
      continue;
    }

    const titulo = linea.match(/^(#{1,6})\s+(.*)$/);
    if (titulo) {
      cerrar();
      bloques.push({ tipo: "titulo", nivel: titulo[1].length, texto: titulo[2] });
      continue;
    }

    const viñeta = linea.match(/^[-*•]\s+(.*)$/);
    if (viñeta) {
      if (actual?.tipo !== "ul") {
        cerrar();
        actual = { tipo: "ul", items: [] };
      }
      actual.items.push(viñeta[1]);
      continue;
    }

    const numerada = linea.match(/^\d+[.)]\s+(.*)$/);
    if (numerada) {
      if (actual?.tipo !== "ol") {
        cerrar();
        actual = { tipo: "ol", items: [] };
      }
      actual.items.push(numerada[1]);
      continue;
    }

    if (actual?.tipo !== "p") {
      cerrar();
      actual = { tipo: "p", lineas: [] };
    }
    actual.lineas.push(linea);
  }
  cerrar();
  return bloques;
}

export default function MarkdownText({ texto, className = "" }) {
  const bloques = parsearBloques(texto);

  return (
    <div className={`md-text ${className}`.trim()}>
      {bloques.map((b, i) => {
        if (b.tipo === "titulo") {
          // El h1 de la página es el nombre del producto: los títulos de la descripción empiezan en h3
          const Tag = b.nivel <= 2 ? "h3" : "h4";
          return <Tag key={i}>{renderInline(b.texto, i)}</Tag>;
        }
        if (b.tipo === "ul" || b.tipo === "ol") {
          const Tag = b.tipo;
          return (
            <Tag key={i}>
              {b.items.map((item, j) => (
                <li key={j}>{renderInline(item, `${i}-${j}`)}</li>
              ))}
            </Tag>
          );
        }
        return (
          <p key={i}>
            {b.lineas.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {renderInline(l, `${i}-${j}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
