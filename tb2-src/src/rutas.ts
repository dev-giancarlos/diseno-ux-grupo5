import type { IconoNombre } from "@/components/ui";

// Menú del shell. "Sin fecha oficial" no es ítem: es ruta hija de Evaluaciones (R1).
// Para poblar una pantalla basta con reemplazar su página en `src/pages/`.
export type ItemMenu = { id: string; etiqueta: string; icono: IconoNombre; href: string };

export const menu: ItemMenu[] = [
  { id: "inicio", etiqueta: "Inicio", icono: "inicio", href: "#/" },
  { id: "cursos", etiqueta: "Cursos", icono: "cursos", href: "#/cursos" },
  { id: "actividad", etiqueta: "Actividad", icono: "actividad", href: "#/actividad" },
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

export const hrefSinFecha = (cursoId?: string | null) =>
  cursoId ? `#/evaluaciones/sin-fecha?curso=${cursoId}` : "#/evaluaciones/sin-fecha";
