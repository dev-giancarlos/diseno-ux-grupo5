import type { IconoNombre } from "@/components/ui";

// Menú del shell. "Sin fecha oficial" no es ítem: es ruta hija de Actividades (D1).
// Para poblar una pantalla basta con reemplazar su página en `src/pages/`.
export type ItemMenu = { id: string; etiqueta: string; icono: IconoNombre; href: string };

export const menu: ItemMenu[] = [
  { id: "inicio", etiqueta: "Inicio", icono: "inicio", href: "#/" },
  { id: "cursos", etiqueta: "Cursos", icono: "cursos", href: "#/cursos" },
  { id: "actividades", etiqueta: "Actividades", icono: "actividad", href: "#/actividades" },
  { id: "evaluaciones", etiqueta: "Evaluaciones", icono: "evaluaciones", href: "#/evaluaciones" },
  { id: "calendario", etiqueta: "Calendario", icono: "calendario", href: "#/calendario" },
  { id: "calificaciones", etiqueta: "Calificaciones", icono: "calificaciones", href: "#/calificaciones" },
  { id: "mensajes", etiqueta: "Mensajes", icono: "mensajes", href: "#/mensajes" },
];

export type Ubicacion = { segmentos: string[]; query: URLSearchParams };

export function leerHash(): Ubicacion {
  const crudo = window.location.hash.replace(/^#/, "") || "/";
  const [ruta, qs = ""] = crudo.split("?");
  return { segmentos: ruta.split("/").filter(Boolean), query: new URLSearchParams(qs) };
}

// Filtros de Sin fecha oficial en la URL: se mantienen al volver atrás y al combinar curso y "solo evaluaciones".
export function hrefSinFecha(cursoId?: string | null, soloEvaluaciones = false) {
  const q = new URLSearchParams();
  if (cursoId) q.set("curso", cursoId);
  if (soloEvaluaciones) q.set("solo", "evaluaciones");
  const qs = q.toString();
  return qs ? `#/actividades/sin-fecha?${qs}` : "#/actividades/sin-fecha";
}

// #/evaluaciones/sin-fecha era la ruta anterior: se sigue aceptando para no romper enlaces guardados.
export function esSinFecha({ segmentos: [seccion, sub] }: Ubicacion) {
  return sub === "sin-fecha" && (seccion === "actividades" || seccion === "evaluaciones");
}
