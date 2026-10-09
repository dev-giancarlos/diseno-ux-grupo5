import type { Actividad } from "@/data";

// Datos de la demo: la única fuente de datos de la app, como si fuera la respuesta del backend.
// Las pantallas leen de aquí; para cambiar un dato basta con editarlo en este archivo.
// Origen: la app de Giancarlos (ruben-hu01-hu09). Lo que su app no tenía (NRC, docentes,
// fechas de publicación, evaluaciones completadas, Sin fecha oficial) se completó sin contradecirla.

/* 'AAAA-MM-DD HH:MM' → Date */
function f(texto: string) {
  const [d, h = "00:00"] = texto.split(" ");
  const [a, m, dia] = d.split("-").map(Number);
  const [hh, mm] = h.split(":").map(Number);
  return new Date(a, m - 1, dia, hh, mm);
}

export type CursoBackend = {
  id: string;
  nombre: string;
  nrc: string;
  profesor: string;
  tono: "purple" | "pink" | "cyan" | "green" | "amber"; // color del badge del curso en Actividades
};

// Actividad del curso con fecha publicada. peso null: no es calificada.
export type PendienteBackend = { cursoId: string; titulo: string; vence: Date; peso: number | null; publicado: Date };
export type CompletadaBackend = PendienteBackend & { nota: number };

export const backend = {
  hoy: f("2026-10-08 15:00"),

  periodo: { nombre: "2026-2", modulo: "Módulo A", inicio: f("2026-09-21 00:00"), fin: f("2026-11-15 23:59"), semanas: 8 },

  usuario: { nombre: "Rubén Vargas", nombreCorto: "Rubén", rol: "Estudiante", iniciales: "RV" },

  cursos: [
    { id: "md", nombre: "Matemática Discreta", nrc: "18432", profesor: "Prof. Andrés Salazar", tono: "purple" },
    { id: "ux", nombre: "Diseño UX", nrc: "19608", profesor: "Prof. Mariana Torres", tono: "pink" },
    { id: "bd", nombre: "Base de Datos", nrc: "20741", profesor: "Prof. Carlos Mendoza", tono: "cyan" },
    { id: "p2", nombre: "Programación II", nrc: "21356", profesor: "Prof. Lucía Paredes", tono: "green" },
    { id: "mi", nombre: "Metodología de la Investigación", nrc: "17289", profesor: "Prof. Jorge Castillo", tono: "amber" },
  ] satisfies CursoBackend[],

  // Pendientes del módulo con fecha: Actividades muestra todos; Evaluaciones, solo los calificados.
  pendientes: [
    { cursoId: "md", titulo: "PC1 - Práctica Calificada 1", vence: f("2026-10-08 18:00"), peso: 15, publicado: f("2026-09-21") },
    { cursoId: "ux", titulo: "TB1 - Trabajo 1", vence: f("2026-10-08 23:59"), peso: 20, publicado: f("2026-09-21") },
    { cursoId: "bd", titulo: "Laboratorio 3 - Modelo relacional", vence: f("2026-10-09 20:00"), peso: 10, publicado: f("2026-09-28") },
    { cursoId: "p2", titulo: "Adjuntar foto de DNI para la PC1 en línea", vence: f("2026-10-09 23:59"), peso: null, publicado: f("2026-10-01") },
    { cursoId: "p2", titulo: "PC1 - Estructuras de datos", vence: f("2026-10-10 18:00"), peso: 15, publicado: f("2026-09-21") },
    { cursoId: "mi", titulo: "TB1 - Planteamiento del problema", vence: f("2026-10-11 23:59"), peso: 15, publicado: f("2026-09-21") },
    { cursoId: "md", titulo: "Tarea 4 - Relaciones y funciones", vence: f("2026-10-13 23:59"), peso: 5, publicado: f("2026-10-01") },
    { cursoId: "ux", titulo: "Adjuntar video de presentación del proyecto", vence: f("2026-10-14 23:59"), peso: null, publicado: f("2026-10-02") },
    { cursoId: "ux", titulo: "Avance de proyecto - Prototipo", vence: f("2026-10-15 23:59"), peso: 25, publicado: f("2026-10-01") },
    { cursoId: "bd", titulo: "Control de lectura 2", vence: f("2026-10-18 20:00"), peso: 10, publicado: f("2026-10-02") },
    { cursoId: "p2", titulo: "Evaluación continua 2", vence: f("2026-10-20 18:00"), peso: 15, publicado: f("2026-10-02") },
  ] satisfies PendienteBackend[],

  completadas: [
    { cursoId: "md", titulo: "Tarea 3 - Lógica proposicional", vence: f("2026-10-01 23:59"), peso: 5, nota: 17, publicado: f("2026-09-21") },
    { cursoId: "bd", titulo: "Laboratorio 2 - Diagrama entidad-relación", vence: f("2026-10-02 20:00"), peso: 10, nota: 18, publicado: f("2026-09-21") },
    { cursoId: "ux", titulo: "Tarea 1 - Investigación de usuarios", vence: f("2026-10-03 23:59"), peso: 10, nota: 19, publicado: f("2026-09-21") },
    { cursoId: "p2", titulo: "Laboratorio 1 - Clases y objetos", vence: f("2026-10-05 18:00"), peso: 10, nota: 16, publicado: f("2026-09-21") },
  ] satisfies CompletadaBackend[],

  // Sin fecha oficial: "curso" la listó el curso sin fecha; "alumno" la registró el alumno.
  sinFechaOficial: [
    { id: "md-parcial", cursoId: "md", nombre: "Examen parcial", origen: "curso", fechaOficial: null, fechaAlumno: null, horaAlumno: null, semanaAlumno: null, fuenteFecha: null, calificada: true, peso: null, nota: "" },
    { id: "md-pc2", cursoId: "md", nombre: "Práctica Calificada 2", origen: "curso", fechaOficial: null, fechaAlumno: null, horaAlumno: null, semanaAlumno: null, fuenteFecha: null, calificada: true, peso: 15, nota: "" },
    { id: "md-encuesta", cursoId: "md", nombre: "Encuesta de medio ciclo", origen: "curso", fechaOficial: null, fechaAlumno: null, horaAlumno: null, semanaAlumno: null, fuenteFecha: null, calificada: false, peso: null, nota: "" },
    { id: "bd-lab4", cursoId: "bd", nombre: "Laboratorio 4 - Normalización", origen: "curso", fechaOficial: null, fechaAlumno: null, horaAlumno: null, semanaAlumno: 3, fuenteFecha: "anunciada", calificada: true, peso: 10, nota: "" },
    { id: "bd-charla", cursoId: "bd", nombre: "Charla de seguridad de datos (asistencia)", origen: "curso", fechaOficial: null, fechaAlumno: null, horaAlumno: null, semanaAlumno: null, fuenteFecha: null, calificada: false, peso: null, nota: "" },
    { id: "ux-tf", cursoId: "ux", nombre: "Trabajo Final - Prototipo funcional", origen: "alumno", fechaOficial: null, fechaAlumno: null, horaAlumno: null, semanaAlumno: 7, fuenteFecha: "anunciada", calificada: true, peso: 20, nota: "" },
    { id: "p2-control2", cursoId: "p2", nombre: "Control 2", origen: "alumno", fechaOficial: null, fechaAlumno: null, horaAlumno: null, semanaAlumno: 6, fuenteFecha: "estimada", calificada: true, peso: null, nota: "" },
    { id: "mi-exposicion", cursoId: "mi", nombre: "Exposición de avance", origen: "alumno", fechaOficial: null, fechaAlumno: f("2026-10-30 23:59"), horaAlumno: "23:59", semanaAlumno: null, fuenteFecha: "estimada", calificada: false, peso: null, nota: "" },
    { id: "mi-foro", cursoId: "mi", nombre: "Foro de discusión", origen: "alumno", fechaOficial: null, fechaAlumno: null, horaAlumno: null, semanaAlumno: 8, fuenteFecha: "anunciada", calificada: false, peso: null, nota: "" },
  ] satisfies Actividad[],

  calendario: {
    cuentas: {
      google: "ruben.vargas@gmail.com",
      apple: { correo: "ruben.vargas@icloud.com", contrasena: "123456789012" },
    },
    ultimaSincronizacion: f("2026-10-08 14:30"),
    // Evento de la vista previa semanal: un pendiente de la lista.
    eventoDestacado: { cursoId: "ux", titulo: "TB1 - Trabajo 1" },
  },
};
