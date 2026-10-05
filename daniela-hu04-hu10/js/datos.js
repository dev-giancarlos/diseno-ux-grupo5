/* =========================================================
   datos.js — Fuente única de datos del prototipo
   User persona: Daniela Torres (HU-04 y HU-10)
   Todas las pantallas leen de aquí, así la HU-04 y la HU-10
   siempre muestran la misma información.
   ========================================================= */

/* Fecha de referencia del prototipo: lunes 05/10/2026, 15:00.
   En un sistema real se usaría: const FECHA_HOY = new Date(); */
const FECHA_HOY = new Date(2026, 9, 5, 15, 0);

const ESTUDIANTE = {
  nombre: 'Daniela Torres',
  iniciales: 'DT',
  codigo: 'U202312345',
  correo: 'u202312345@upc.edu.pe',
  rol: 'Estudiante',
  periodo: '2026-2',
  moduloActual: 'Módulo A',
  cursosAprobados: 15
};

const MODULOS = {
  A: { nombre: 'Módulo A', estado: 'En curso', inicio: new Date(2026, 8, 21), fin: new Date(2026, 10, 15) },
  B: { nombre: 'Módulo B', estado: 'Próximo', inicio: new Date(2026, 10, 16), fin: new Date(2027, 0, 10) }
};

/* Estructura oficial de evaluación (sílabo):
   NOTA FINAL = 15% (PC2) + 15% (DD1) + 20% (TB1) + 15% (PC1) + 15% (TB2) + 20% (EB1) */
const COMPONENTES = {
  TB1: { nombre: 'Trabajo 1', peso: 20 },
  PC1: { nombre: 'Práctica Calificada 1', peso: 15 },
  TB2: { nombre: 'Trabajo 2', peso: 15 },
  PC2: { nombre: 'Práctica Calificada 2', peso: 15 },
  DD1: { nombre: 'Evaluación de Desempeño 1', peso: 15 },
  EB1: { nombre: 'Evaluación Final 1', peso: 20 }
};
const FORMULA_ORDEN = ['PC2', 'DD1', 'TB1', 'PC1', 'TB2', 'EB1'];

/* Crea una fecha a partir de 'AAAA-MM-DD HH:MM' */
function f(texto) {
  const [d, h = '23:59'] = texto.split(' ');
  const [a, m, dia] = d.split('-').map(Number);
  const [hh, mm] = h.split(':').map(Number);
  return new Date(a, m - 1, dia, hh, mm);
}

/* Cada evaluación: tipo (componente), fecha de entrega, fecha de publicación y nota (null si está pendiente) */
const CURSOS = [
  {
    id: 'ux', nombre: 'Diseño y tecnologías UX', profesor: 'Prof. Mariana Torres',
    modalidad: 'Virtual', nrc: '19608', modulo: 'A',
    evaluaciones: [
      { tipo: 'TB1', fecha: f('2026-10-01 23:59'), publicado: f('2026-09-21'), nota: 18 },
      { tipo: 'PC1', fecha: f('2026-10-03 18:00'), publicado: f('2026-09-21'), nota: 18 },
      { tipo: 'TB2', fecha: f('2026-10-19 23:59'), publicado: f('2026-10-01'), nota: null },
      { tipo: 'PC2', fecha: f('2026-10-26 18:00'), publicado: f('2026-10-01'), nota: null },
      { tipo: 'DD1', fecha: f('2026-11-06 23:59'), publicado: f('2026-10-01'), nota: null },
      { tipo: 'EB1', fecha: f('2026-11-13 23:59'), publicado: f('2026-10-01'), nota: null }
    ],
    /* Actividades que no suman nota, pero sí aparecen como pendientes */
    actividadesSinPeso: [
      { titulo: 'Avance de TB2 (entrega parcial)', fecha: f('2026-10-08 20:00'), publicado: f('2026-10-01') }
    ]
  },
  {
    id: 'dbd', nombre: 'Diseño de Base de Datos', profesor: 'Prof. Carlos Mendoza',
    modalidad: 'Semipresencial', nrc: '20741', modulo: 'A',
    evaluaciones: [
      { tipo: 'PC1', fecha: f('2026-10-03 11:00'), publicado: f('2026-09-21'), nota: 20 },
      { tipo: 'TB1', fecha: f('2026-10-05 23:59'), publicado: f('2026-09-21'), nota: null },
      { tipo: 'TB2', fecha: f('2026-10-20 23:59'), publicado: f('2026-10-02'), nota: null },
      { tipo: 'PC2', fecha: f('2026-10-27 11:00'), publicado: f('2026-10-02'), nota: null },
      { tipo: 'DD1', fecha: f('2026-11-06 23:59'), publicado: f('2026-10-02'), nota: null },
      { tipo: 'EB1', fecha: f('2026-11-12 23:59'), publicado: f('2026-10-02'), nota: null }
    ],
    actividadesSinPeso: []
  },
  {
    id: 'md', nombre: 'Matemática Discreta', profesor: 'Prof. Andrés Salazar',
    modalidad: 'Virtual', nrc: '18432', modulo: 'A',
    evaluaciones: [
      { tipo: 'TB1', fecha: f('2026-10-02 23:59'), publicado: f('2026-09-21'), nota: 18 },
      { tipo: 'PC1', fecha: f('2026-10-05 18:00'), publicado: f('2026-09-28'), nota: null },
      { tipo: 'TB2', fecha: f('2026-10-21 23:59'), publicado: f('2026-10-02'), nota: null },
      { tipo: 'PC2', fecha: f('2026-10-28 18:00'), publicado: f('2026-10-02'), nota: null },
      { tipo: 'DD1', fecha: f('2026-11-05 23:59'), publicado: f('2026-10-02'), nota: null },
      { tipo: 'EB1', fecha: f('2026-11-13 18:00'), publicado: f('2026-10-02'), nota: null }
    ],
    actividadesSinPeso: []
  },
  /* Módulo B: aún no inicia, por eso no tiene evaluaciones */
  { id: 'ir',  nombre: 'Ingeniería de Requerimientos',    profesor: 'Prof. Ricardo Salas', modalidad: 'Virtual',        nrc: '21310', modulo: 'B', evaluaciones: [], actividadesSinPeso: [] },
  { id: 'ibd', nombre: 'Implementación de Base de Datos', profesor: 'Prof. Carmen Vidal',  modalidad: 'Semipresencial', nrc: '21455', modulo: 'B', evaluaciones: [], actividadesSinPeso: [] },
  { id: 'c2',  nombre: 'Cálculo II',                      profesor: 'Prof. Jorge Quispe',  modalidad: 'Virtual',        nrc: '21502', modulo: 'B', evaluaciones: [], actividadesSinPeso: [] }
];

/* Preferencias de recordatorio (se pueden cambiar en "Configurar") */
const RECORDATORIOS = { diaAntes: true, horaAntes: true };
