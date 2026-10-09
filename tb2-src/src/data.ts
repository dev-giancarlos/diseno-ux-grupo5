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
