import type { IconoNombre } from "@/components/ui";

export type Curso = { id: string; nombre: string; nrc: string };

export type Actividad = {
  id: string;
  cursoId: string;
  nombre: string;
  origen: "docente" | "alumno";
  semanaOficial: number | null;
  fechaOficial: Date | null;
  fechaAlumno: Date | null;
  horaAlumno: string | null;
  semanaAlumno: number | null;
  fuenteFecha: "estimada" | "anunciada" | null;
  tipo: string;
  nota: string;
};

export type BadgeDato = {
  texto: string;
  tono: "neutral" | "accent";
  estilo: "relleno" | "contorno";
  icono: IconoNombre;
};

export const cursos: Curso[] = [
  { id: "redes", nombre: "Redes y Comunicaciones", nrc: "2892" },
  { id: "fisica1", nombre: "Física 1", nrc: "1844" },
];

export const tipos = ["Tarea", "Control", "Examen", "Evidencia", "Foro", "Prerrequisito"];
export const semanas = Array.from({ length: 16 }, (_, i) => i + 1);

export const actividadesIniciales: Actividad[] = [
  {
    id: "pc1",
    cursoId: "redes",
    nombre: "Práctica Calificada 1",
    origen: "docente",
    semanaOficial: 3,
    fechaOficial: null,
    fechaAlumno: null,
    horaAlumno: null,
    semanaAlumno: null,
    fuenteFecha: null,
    tipo: "Examen",
    nota: "",
  },
  {
    id: "control1",
    cursoId: "redes",
    nombre: "Control 1",
    origen: "docente",
    semanaOficial: null,
    fechaOficial: null,
    fechaAlumno: null,
    horaAlumno: null,
    semanaAlumno: null,
    fuenteFecha: null,
    tipo: "Control",
    nota: "",
  },
  {
    id: "tf",
    cursoId: "redes",
    nombre: "Trabajo Final (TB2 y DD1)",
    origen: "docente",
    semanaOficial: 7,
    fechaOficial: null,
    fechaAlumno: null,
    horaAlumno: null,
    semanaAlumno: null,
    fuenteFecha: null,
    tipo: "Tarea",
    nota: "",
  },
  {
    id: "lab5",
    cursoId: "fisica1",
    nombre: "Laboratorio 5",
    origen: "docente",
    semanaOficial: null,
    fechaOficial: null,
    fechaAlumno: new Date(2026, 9, 30, 23, 59),
    horaAlumno: "23:59",
    semanaAlumno: null,
    fuenteFecha: "estimada",
    tipo: "Evidencia",
    nota: "Fuente: Es una estimación mía",
  },
  {
    id: "foro",
    cursoId: "fisica1",
    nombre: "Foro obligatorio",
    origen: "alumno",
    semanaOficial: null,
    fechaOficial: null,
    fechaAlumno: null,
    horaAlumno: null,
    semanaAlumno: 10,
    fuenteFecha: null,
    tipo: "Foro",
    nota: "",
  },
];

export function badgesDe(a: Actividad): BadgeDato[] {
  if (a.origen === "alumno") {
    return [
      { texto: "Fecha agregada por ti", tono: "accent", estilo: "contorno", icono: "calendar-check" },
    ];
  }
  const lista: BadgeDato[] =
    a.semanaOficial != null
      ? [{ texto: "Solo semana", tono: "neutral", estilo: "relleno", icono: "calendario" }]
      : [{ texto: "Fecha por definir", tono: "neutral", estilo: "relleno", icono: "clock" }];
  if (a.fechaAlumno != null || a.semanaAlumno != null) {
    lista.push({ texto: "Fecha anotada por ti", tono: "accent", estilo: "contorno", icono: "clock" });
  }
  return lista;
}

export const tieneFechaPropia = (a: Actividad) => a.fechaAlumno != null || a.semanaAlumno != null;

export const semanaDe = (a: Actividad) => a.semanaOficial ?? a.semanaAlumno;

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const dos = (n: number) => String(n).padStart(2, "0");

export function formatoFecha(d: Date): string {
  return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]} · ${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

export function fechaPropiaTexto(a: Actividad): string | null {
  if (a.fechaAlumno) return `Tu fecha: ${formatoFecha(a.fechaAlumno)}`;
  if (a.semanaAlumno != null) return `Tu fecha: Semana ${a.semanaAlumno}`;
  return null;
}

export function ordenar(lista: Actividad[]): Actividad[] {
  const conSemana = lista
    .filter((a) => semanaDe(a) != null)
    .sort((x, y) => (semanaDe(x) as number) - (semanaDe(y) as number));
  const sinSemana = lista.filter((a) => semanaDe(a) == null);
  return [...conSemana, ...sinSemana];
}

export const sinFechaOficial = (lista: Actividad[]) => lista.filter((a) => a.fechaOficial == null);

export const cursoPorId = (id: string) => cursos.find((c) => c.id === id) as Curso;

export function combinarFecha(fecha: string, hora: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (!m) return null;
  const [h, min] = /^(\d{2}):(\d{2})$/.test(hora) ? hora.split(":").map(Number) : [23, 59];
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), h, min);
}

// Evaluaciones: tipos que cuentan como evaluación (el resto son actividades sin nota).
export const tiposEvaluacion = ["Examen", "Control", "Tarea"];
export const esEvaluacion = (a: Actividad) => tiposEvaluacion.includes(a.tipo);

/* =========================================================
   Pantalla de Carmen (HU-04 · Evaluaciones por realizar)
   Copiado de daniela-hu04-hu10/js/datos.js. User persona: Daniela Torres.
   ========================================================= */

// Fecha de referencia del prototipo de Carmen: lunes 05/10/2026, 15:00.
export const HU04_FECHA_HOY = new Date(2026, 9, 5, 15, 0);

export const HU04_ESTUDIANTE = { periodo: "2026-2", moduloActual: "Módulo A" };

export const HU04_MODULO_A_FIN = new Date(2026, 10, 15);

export const HU04_COMPONENTES: Record<string, { nombre: string; peso: number }> = {
  TB1: { nombre: "Trabajo 1", peso: 20 },
  PC1: { nombre: "Práctica Calificada 1", peso: 15 },
  TB2: { nombre: "Trabajo 2", peso: 15 },
  PC2: { nombre: "Práctica Calificada 2", peso: 15 },
  DD1: { nombre: "Evaluación de Desempeño 1", peso: 15 },
  EB1: { nombre: "Evaluación Final 1", peso: 20 },
};

/* Crea una fecha a partir de 'AAAA-MM-DD HH:MM' */
function f(texto: string) {
  const [d, h = "23:59"] = texto.split(" ");
  const [a, m, dia] = d.split("-").map(Number);
  const [hh, mm] = h.split(":").map(Number);
  return new Date(a, m - 1, dia, hh, mm);
}

export type Hu04Curso = {
  id: string;
  nombre: string;
  profesor: string;
  nrc: string;
  modulo: "A" | "B";
  evaluaciones: { tipo: string; fecha: Date; publicado: Date; nota: number | null }[];
  actividadesSinPeso: { titulo: string; fecha: Date; publicado: Date }[];
};

export const HU04_CURSOS: Hu04Curso[] = [
  {
    id: "ux", nombre: "Diseño y tecnologías UX", profesor: "Prof. Mariana Torres", nrc: "19608", modulo: "A",
    evaluaciones: [
      { tipo: "TB1", fecha: f("2026-10-01 23:59"), publicado: f("2026-09-21"), nota: 18 },
      { tipo: "PC1", fecha: f("2026-10-03 18:00"), publicado: f("2026-09-21"), nota: 18 },
      { tipo: "TB2", fecha: f("2026-10-19 23:59"), publicado: f("2026-10-01"), nota: null },
      { tipo: "PC2", fecha: f("2026-10-26 18:00"), publicado: f("2026-10-01"), nota: null },
      { tipo: "DD1", fecha: f("2026-11-06 23:59"), publicado: f("2026-10-01"), nota: null },
      { tipo: "EB1", fecha: f("2026-11-13 23:59"), publicado: f("2026-10-01"), nota: null },
    ],
    actividadesSinPeso: [{ titulo: "Avance de TB2 (entrega parcial)", fecha: f("2026-10-08 20:00"), publicado: f("2026-10-01") }],
  },
  {
    id: "dbd", nombre: "Diseño de Base de Datos", profesor: "Prof. Carlos Mendoza", nrc: "20741", modulo: "A",
    evaluaciones: [
      { tipo: "PC1", fecha: f("2026-10-03 11:00"), publicado: f("2026-09-21"), nota: 20 },
      { tipo: "TB1", fecha: f("2026-10-05 23:59"), publicado: f("2026-09-21"), nota: null },
      { tipo: "TB2", fecha: f("2026-10-20 23:59"), publicado: f("2026-10-02"), nota: null },
      { tipo: "PC2", fecha: f("2026-10-27 11:00"), publicado: f("2026-10-02"), nota: null },
      { tipo: "DD1", fecha: f("2026-11-06 23:59"), publicado: f("2026-10-02"), nota: null },
      { tipo: "EB1", fecha: f("2026-11-12 23:59"), publicado: f("2026-10-02"), nota: null },
    ],
    actividadesSinPeso: [],
  },
  {
    id: "md", nombre: "Matemática Discreta", profesor: "Prof. Andrés Salazar", nrc: "18432", modulo: "A",
    evaluaciones: [
      { tipo: "TB1", fecha: f("2026-10-02 23:59"), publicado: f("2026-09-21"), nota: 18 },
      { tipo: "PC1", fecha: f("2026-10-05 18:00"), publicado: f("2026-09-28"), nota: null },
      { tipo: "TB2", fecha: f("2026-10-21 23:59"), publicado: f("2026-10-02"), nota: null },
      { tipo: "PC2", fecha: f("2026-10-28 18:00"), publicado: f("2026-10-02"), nota: null },
      { tipo: "DD1", fecha: f("2026-11-05 23:59"), publicado: f("2026-10-02"), nota: null },
      { tipo: "EB1", fecha: f("2026-11-13 18:00"), publicado: f("2026-10-02"), nota: null },
    ],
    actividadesSinPeso: [],
  },
];

/* =========================================================
   Pantalla de Giancarlos (HU-01 · Actividades), datos de ejemplo de Figma.
   Estáticos: la lista no tiene lógica.
   ========================================================= */

export type Hu01Curso = { nombre: string; fondo: string; texto: string };
const HU01_CURSOS = {
  md: { nombre: "Matemática Discreta", fondo: "#eef2ff", texto: "#4338ca" },
  ux: { nombre: "Diseño UX", fondo: "#fbeff5", texto: "#9d3b72" },
  bd: { nombre: "Base de Datos", fondo: "#e8f7f8", texto: "#087f8c" },
  p2: { nombre: "Programación II", fondo: "#eaf5ef", texto: "#267052" },
  mi: { nombre: "Metodología de la Investigación", fondo: "#fbf3e4", texto: "#916018" },
} satisfies Record<string, Hu01Curso>;

export type Hu01Actividad = { plazo: string; urgente: boolean; fecha: string; titulo: string; curso: Hu01Curso; peso: string };

export const HU01_GRUPOS: { titulo: string; rango: string; actividades: Hu01Actividad[] }[] = [
  {
    titulo: "Hoy",
    rango: "Jueves, 8 de octubre",
    actividades: [
      { plazo: "Vence hoy a las 18:00", urgente: true, fecha: "8 oct · 18:00", titulo: "PC1 - Práctica Calificada 1", curso: HU01_CURSOS.md, peso: "15%" },
      { plazo: "Vence hoy a las 23:59", urgente: true, fecha: "8 oct · 23:59", titulo: "TB1 - Trabajo 1", curso: HU01_CURSOS.ux, peso: "20%" },
    ],
  },
  {
    titulo: "Esta semana",
    rango: "Del 9 al 11 de octubre",
    actividades: [
      { plazo: "Vence mañana", urgente: false, fecha: "9 oct · 20:00", titulo: "Laboratorio 3 - Modelo relacional", curso: HU01_CURSOS.bd, peso: "10%" },
      { plazo: "Vence en 2 días", urgente: false, fecha: "10 oct · 18:00", titulo: "PC1 - Estructuras de datos", curso: HU01_CURSOS.p2, peso: "15%" },
      { plazo: "Vence en 3 días", urgente: false, fecha: "11 oct · 23:59", titulo: "TB1 - Planteamiento del problema", curso: HU01_CURSOS.mi, peso: "15%" },
    ],
  },
  {
    titulo: "Próximas semanas",
    rango: "Desde el 12 de octubre",
    actividades: [
      { plazo: "Vence en 5 días", urgente: false, fecha: "13 oct · 23:59", titulo: "Tarea 4 - Relaciones y funciones", curso: HU01_CURSOS.md, peso: "5%" },
      { plazo: "Vence en 7 días", urgente: false, fecha: "15 oct · 23:59", titulo: "TB2 - Prototipo de alta fidelidad", curso: HU01_CURSOS.ux, peso: "25%" },
      { plazo: "Vence en 12 días", urgente: false, fecha: "20 oct · 18:00", titulo: "PC2 - Consultas SQL", curso: HU01_CURSOS.bd, peso: "20%" },
      { plazo: "Vence en 15 días", urgente: false, fecha: "23 oct · 23:59", titulo: "Proyecto - Avance de implementación", curso: HU01_CURSOS.p2, peso: "20%" },
    ],
  },
];
