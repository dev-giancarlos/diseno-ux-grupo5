import { backend, type CursoBackend, type PendienteBackend } from "@/backend";

export type Curso = CursoBackend;

export type Actividad = {
  id: string;
  cursoId: string;
  nombre: string;
  origen: "curso" | "alumno"; // "curso": la listó el curso (sin fecha); "alumno": la registró el alumno
  fechaOficial: Date | null;
  fechaAlumno: Date | null;
  horaAlumno: string | null;
  semanaAlumno: number | null;
  fuenteFecha: "estimada" | "anunciada" | null; // null: el curso la lista sin fecha y el alumno aún no puso una
  calificada: boolean;
  peso: number | null; // % de la nota final, si se conoce
  nota: string;
};

export const cursos: Curso[] = backend.cursos;

export const actividadesIniciales: Actividad[] = backend.sinFechaOficial;

// "Hoy" del prototipo: fijo, para que la demo muestre siempre lo mismo.
export const HOY = backend.hoy;

export const semanaDe = (a: Actividad) => a.semanaAlumno ?? (a.fechaAlumno ? semanaDeFecha(a.fechaAlumno) : null);

/* ---------- Semanas del módulo vigente ----------
   La "Semana N" de toda la app es la semana del módulo (backend.periodo). */
export const INICIO_CICLO = backend.periodo.inicio;
export const semanas = Array.from({ length: backend.periodo.semanas }, (_, i) => i + 1);
const DIA_MS = 864e5;
const soloDia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export function inicioSemana(n: number): Date {
  const d = new Date(INICIO_CICLO);
  d.setDate(d.getDate() + (n - 1) * 7);
  return d;
}

export function semanaDeFecha(d: Date): number | null {
  const n = Math.floor((soloDia(d).getTime() - INICIO_CICLO.getTime()) / (7 * DIA_MS)) + 1;
  return n >= 1 && n <= semanas.length ? n : null;
}

// "2 – 8 nov" o "26 oct – 1 nov"
export function rangoSemana(n: number): string {
  const ini = inicioSemana(n);
  const fin = new Date(ini);
  fin.setDate(ini.getDate() + 6);
  return ini.getMonth() === fin.getMonth()
    ? `${ini.getDate()} – ${fin.getDate()} ${MESES[fin.getMonth()]}`
    : `${ini.getDate()} ${MESES[ini.getMonth()]} – ${fin.getDate()} ${MESES[fin.getMonth()]}`;
}

// "mié 4 nov"
export const diaCorto = (d: Date) => `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`;

const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const dos = (n: number) => String(n).padStart(2, "0");

export function formatoFecha(d: Date): string {
  return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]} · ${dos(d.getHours())}:${dos(d.getMinutes())}`;
}

// "Semana 3" o "vie 30 oct · 23:59"
export const fechaAlumnoTexto = (a: Actividad) =>
  a.fechaAlumno ? formatoFecha(a.fechaAlumno) : a.semanaAlumno != null ? `Semana ${a.semanaAlumno}` : "Sin fecha";

// Por semana; dentro de la misma semana, primero las que solo tienen semana y luego por día.
export function ordenar(lista: Actividad[]): Actividad[] {
  const clave = (a: Actividad) => [semanaDe(a) ?? Infinity, a.fechaAlumno?.getTime() ?? -Infinity];
  return [...lista].sort((x, y) => {
    const [sx, fx] = clave(x);
    const [sy, fy] = clave(y);
    return sx - sy || fx - fy;
  });
}

export const sinFechaOficial = (lista: Actividad[]) => lista.filter((a) => a.fechaOficial == null);

export const cursoPorId = (id: string) => cursos.find((c) => c.id === id) as Curso;

export function combinarFecha(fecha: string, hora: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fecha);
  if (!m) return null;
  const [h, min] = /^(\d{2}):(\d{2})$/.test(hora) ? hora.split(":").map(Number) : [23, 59];
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), h, min);
}

// Evaluaciones: las actividades calificadas (las que suman a la nota final).
export const esEvaluacion = (a: Actividad) => a.calificada;

/* =========================================================
   Evaluaciones (diseño de Carmen) y Actividades (de Giancarlos): leen backend.pendientes
   y backend.completadas.
   ========================================================= */

export const HU04_FECHA_HOY = HOY;

export const HU04_ESTUDIANTE = { periodo: backend.periodo.nombre, moduloActual: backend.periodo.modulo };

export const HU04_MODULO_A_FIN = backend.periodo.fin;

export type Hu01Curso = { nombre: string; tono: Curso["tono"] };

export type Hu01Actividad = { id: string; plazo: string; urgente: boolean; fecha: string; titulo: string; curso: Hu01Curso; peso: string | null; calificada: boolean };

// Pendiente del módulo con fecha oficial: los del backend y los que el alumno marca como Oficial.
export type Pendiente = PendienteBackend & { id: string; calificada: boolean };

export function pendientesDelModulo(actividades: Actividad[]): Pendiente[] {
  const delCurso = backend.pendientes.map((p) => ({ ...p, id: `${p.cursoId}-${p.titulo}`, calificada: p.peso != null }));
  const oficiales = actividades
    .filter((a) => a.fechaOficial != null)
    .map((a) => ({ id: a.id, cursoId: a.cursoId, titulo: a.nombre, vence: a.fechaOficial as Date, peso: a.peso, publicado: HOY, calificada: a.calificada }));
  return [...delCurso, ...oficiales].sort((a, b) => a.vence.getTime() - b.vence.getTime());
}

const DIAS_LARGOS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const diasEntre = (a: Date, b: Date) => Math.round((soloDia(b).getTime() - soloDia(a).getTime()) / DIA_MS);

// Pendientes agrupados como en la pantalla de Giancarlos: Hoy, Esta semana (hasta el domingo) y Próximas semanas.
export function gruposPendientes(actividades: Actividad[]): { titulo: string; rango: string; actividades: Hu01Actividad[] }[] {
  const hoy = soloDia(HOY);
  const domingo = new Date(hoy);
  domingo.setDate(hoy.getDate() + ((7 - hoy.getDay()) % 7));
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);
  const lunes = new Date(domingo);
  lunes.setDate(domingo.getDate() + 1);

  const fila = (p: Pendiente): Hu01Actividad => {
    const curso = cursoPorId(p.cursoId);
    const dias = diasEntre(HOY, p.vence);
    return {
      id: p.id,
      plazo: dias === 0 ? `Vence hoy a las ${dos(p.vence.getHours())}:${dos(p.vence.getMinutes())}` : dias === 1 ? "Vence mañana" : `Vence en ${dias} días`,
      urgente: dias === 0,
      fecha: `${p.vence.getDate()} ${MESES[p.vence.getMonth()]} · ${dos(p.vence.getHours())}:${dos(p.vence.getMinutes())}`,
      titulo: p.titulo,
      curso: { nombre: curso.nombre, tono: curso.tono },
      peso: p.peso != null ? `${p.peso}%` : null,
      calificada: p.calificada,
    };
  };
  const pendientes = pendientesDelModulo(actividades);
  const deHoy = pendientes.filter((p) => diasEntre(HOY, p.vence) === 0);
  const deSemana = pendientes.filter((p) => diasEntre(HOY, p.vence) > 0 && soloDia(p.vence) <= domingo);
  const proximas = pendientes.filter((p) => soloDia(p.vence) > domingo);
  const delMes = (d: Date) => `${d.getDate()} de ${MESES_LARGOS[d.getMonth()]}`;
  const rangoSemana =
    manana.getMonth() === domingo.getMonth()
      ? `Del ${manana.getDate()} al ${delMes(domingo)}`
      : `Del ${delMes(manana)} al ${delMes(domingo)}`;
  return [
    { titulo: "Hoy", rango: `${DIAS_LARGOS[hoy.getDay()]}, ${delMes(hoy)}`, actividades: deHoy.map(fila) },
    { titulo: "Esta semana", rango: rangoSemana, actividades: deSemana.map(fila) },
    { titulo: "Próximas semanas", rango: `Desde el ${delMes(lunes)}`, actividades: proximas.map(fila) },
  ];
}
