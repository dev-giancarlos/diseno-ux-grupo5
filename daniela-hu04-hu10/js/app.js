/* =========================================================
   app.js — Lógica del prototipo (HU-04 y HU-10)
   Cada página indica qué pantalla es con <body data-pagina="...">
   y este archivo dibuja su contenido a partir de datos.js
   ========================================================= */

/* ---------- Íconos (SVG en línea) ---------- */
const ICONOS = {
  inicio: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  cursos: '<path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M4 17a3 3 0 0 1 3-3h11"/>',
  actividad: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  evaluaciones: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 13l2 2 4-4"/>',
  calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  calificaciones: '<circle cx="12" cy="9" r="5"/><path d="m9 13-2 8 5-3 5 3-2-8"/>',
  mensajes: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  agregar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M12 13v5M9.5 15.5h5"/>',
  usuario: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'
};
function icono(nombre) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONOS[nombre]}</svg>`;
}

/* ---------- Rutas (las carpetas hu04/ y hu10/ son hermanas) ---------- */
const RUTAS = {
  inicio: '../hu10/inicio.html',
  evaluaciones: '../hu04/actividades.html',
  calificaciones: '../hu10/calificaciones.html',
  detalle: id => `../hu10/detalle.html?curso=${id}`
};

/* ---------- Utilidades de fecha ---------- */
const DIAS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const dos = n => String(n).padStart(2, '0');
const fechaCorta = d => `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()}`;
const hora = d => `${dos(d.getHours())}:${dos(d.getMinutes())}`;
const mismoDia = (a, b) => a.toDateString() === b.toDateString();

/* "Hoy · lun 05/10/2026, 18:00"  o  "jue 08/10/2026, 20:00" */
function fechaCompleta(d) {
  const base = `${DIAS[d.getDay()]} ${fechaCorta(d)}, ${hora(d)}`;
  return mismoDia(d, FECHA_HOY) ? `Hoy · ${base}` : base;
}

/* Fin de la semana actual (domingo 23:59) */
function finDeSemana(d) {
  const fin = new Date(d);
  fin.setDate(d.getDate() + ((7 - d.getDay()) % 7));
  fin.setHours(23, 59, 59);
  return fin;
}

/* Badge de tiempo restante: "Vence en 3 h", "Vence en 3 días" */
function tiempoRestante(fecha) {
  const horas = Math.round((fecha - FECHA_HOY) / 36e5);
  if (horas < 24) return { texto: `Vence en ${horas} h`, tono: 'warn' };
  const dias = Math.round(horas / 24);
  return { texto: `Vence en ${dias} día${dias === 1 ? '' : 's'}`, tono: dias <= 2 ? 'warn' : 'neutral' };
}

/* Próximo recordatorio según las preferencias (1 día antes / 1 hora antes) */
function proximoRecordatorio(fecha) {
  const opciones = [];
  if (RECORDATORIOS.diaAntes) opciones.push(new Date(fecha - 864e5));
  if (RECORDATORIOS.horaAntes) opciones.push(new Date(fecha - 36e5));
  const futuras = opciones.filter(d => d > FECHA_HOY).sort((a, b) => a - b);
  if (!futuras.length) return null;
  const r = futuras[0];
  return mismoDia(r, FECHA_HOY) ? `hoy ${hora(r)}` : `${DIAS[r.getDay()]} ${fechaCorta(r)}, ${hora(r)}`;
}

/* ---------- Cálculos de notas ---------- */
/* Promedio ponderado solo de las evaluaciones con nota */
function promedioCurso(curso) {
  const calificadas = curso.evaluaciones.filter(e => e.nota !== null);
  const pesoTotal = calificadas.reduce((s, e) => s + COMPONENTES[e.tipo].peso, 0);
  if (!pesoTotal) return null;
  const suma = calificadas.reduce((s, e) => s + e.nota * COMPONENTES[e.tipo].peso, 0);
  return { valor: suma / pesoTotal, pesoEvaluado: pesoTotal };
}

/* Promedio general: cursos que ya tienen nota */
function promedioGeneral() {
  const proms = CURSOS.map(promedioCurso).filter(Boolean).map(p => p.valor);
  return proms.reduce((s, v) => s + v, 0) / proms.length;
}

const redondear = (v, dec = 2) => Number(v.toFixed(dec)).toString();

/* ---------- Estructura compartida: sidebar + navegación móvil ---------- */
function dibujarEstructura(activo) {
  const items = [
    ['inicio', 'Inicio', RUTAS.inicio],
    ['cursos', 'Cursos', '#'],
    ['actividad', 'Actividad', '#'],
    ['evaluaciones', 'Evaluaciones', RUTAS.evaluaciones],
    ['calendario', 'Calendario', '#'],
    ['calificaciones', 'Calificaciones', RUTAS.calificaciones],
    ['mensajes', 'Mensajes', '#']
  ];
  const enlace = ([id, texto, href]) =>
    `<a href="${href}" class="${id === activo ? 'is-activo' : ''}" ${id === activo ? 'aria-current="page"' : ''}>${icono(id)}<span>${texto}</span></a>`;

  document.getElementById('sidebar').innerHTML = `
    <div class="sidebar__logo"><img src="../img/logo-upc-blanco.svg" alt="Aula Virtual UPC"></div>
    <nav class="nav" aria-label="Menú principal">${items.map(enlace).join('')}</nav>
    <div class="sidebar__usuario">
      <span class="avatar">${ESTUDIANTE.iniciales}</span>
      <div><div class="sidebar__nombre">${ESTUDIANTE.nombre}</div><div class="sidebar__rol">${ESTUDIANTE.rol}</div></div>
    </div>`;

  const movil = items.filter(([id]) => ['inicio', 'cursos', 'evaluaciones', 'calificaciones', 'mensajes'].includes(id));
  document.getElementById('bottom-nav').innerHTML = movil.map(enlace).join('');
}

/* ---------- Fila de curso (Inicio) ---------- */
function filaCursoInicio(curso, proximo) {
  const tono = curso.modalidad === 'Virtual' ? 'success' : 'accent';
  return `
    <div class="fila-curso ${proximo ? 'es-proximo' : ''}">
      <span class="fila-curso__icono">${icono('cursos')}</span>
      <div class="fila-curso__info">
        <p class="fila-curso__nombre">${curso.nombre}</p>
        <span class="badge badge--${tono}">${curso.modalidad.toUpperCase()}</span>
        <span class="texto-sec">${curso.profesor}</span>
      </div>
    </div>`;
}

/* =========================================================
   HU-10 · Inicio
   ========================================================= */
function paginaInicio() {
  dibujarEstructura('inicio');
  const cursosA = CURSOS.filter(c => c.modulo === 'A');
  const cursosB = CURSOS.filter(c => c.modulo === 'B');
  const inicioB = fechaCorta(MODULOS.B.inicio);

  document.getElementById('contenido').innerHTML = `
    <h1 class="titulo-pagina">Inicio</h1>

    <section class="card perfil" aria-label="Datos de la estudiante">
      <span class="avatar">${ESTUDIANTE.iniciales}</span>
      <div>
        <p class="perfil__nombre">${ESTUDIANTE.nombre}</p>
        <p class="perfil__dato">Código: ${ESTUDIANTE.codigo}</p>
        <p class="perfil__dato">${ESTUDIANTE.correo}</p>
      </div>
    </section>

    <section class="indicadores" aria-label="Resumen académico">
      <div class="card indicador">
        <p class="etiqueta">Periodo actual</p>
        <span class="indicador__valor">${ESTUDIANTE.periodo} · ${ESTUDIANTE.moduloActual}</span>
      </div>
      <div class="card indicador">
        <p class="etiqueta">Cursos aprobados</p>
        <span class="indicador__valor">${ESTUDIANTE.cursosAprobados}</span>
      </div>
      <a class="card indicador" href="${RUTAS.calificaciones}">
        <p class="etiqueta">Promedio general</p>
        <span class="indicador__fila">
          <span class="indicador__valor">${redondear(promedioGeneral())}</span>
          <span class="indicador__enlace">Ver calificaciones →</span>
        </span>
      </a>
    </section>

    <div class="encabezado-seccion"><h2>Mis cursos actuales</h2><a href="#">Ver todos</a></div>

    <p class="etiqueta">${MODULOS.A.nombre} · En curso</p>
    <section class="card card--lista">${cursosA.map(c => filaCursoInicio(c, false)).join('')}</section>

    <p class="etiqueta">${MODULOS.B.nombre} · Inicia el ${inicioB}</p>
    <section class="card card--lista">${cursosB.map(c => filaCursoInicio(c, true)).join('')}</section>`;
}

/* =========================================================
   HU-10 · Calificaciones · Resumen
   ========================================================= */
function paginaCalificaciones() {
  dibujarEstructura('calificaciones');

  const filaA = c => {
    const p = promedioCurso(c);
    return `
      <a class="fila-nota" href="${RUTAS.detalle(c.id)}">
        <span class="fila-curso__icono">${icono('cursos')}</span>
        <span class="fila-nota__info">
          <p class="fila-nota__nombre">${c.nombre}</p>
          <span class="texto-sec">${c.profesor}</span>
        </span>
        <span class="fila-nota__valor">${p ? Math.round(p.valor) : '—'}</span>
        ${icono('chevron')}
      </a>`;
  };
  const filaB = c => `
    <div class="fila-nota es-proximo">
      <span class="fila-curso__icono">${icono('cursos')}</span>
      <span class="fila-nota__info">
        <p class="fila-nota__nombre">${c.nombre}</p>
        <span class="texto-sec">${c.profesor}</span>
      </span>
      <span class="badge">Por iniciar</span>
    </div>`;

  document.getElementById('contenido').innerHTML = `
    <h1 class="titulo-pagina">Calificaciones</h1>
    <p class="subtitulo">Resumen de tus calificaciones en todos los cursos matriculados · Actualizado al ${fechaCorta(FECHA_HOY)}</p>

    <div class="calif-layout">
      <section class="card" aria-label="Calificaciones por curso">
        <div class="grupo-modulo">
          <p class="etiqueta">${MODULOS.A.nombre} · En curso</p>
          ${CURSOS.filter(c => c.modulo === 'A').map(filaA).join('')}
        </div>
        <div class="grupo-modulo">
          <p class="etiqueta">${MODULOS.B.nombre} · Inicia el ${fechaCorta(MODULOS.B.inicio)}</p>
          ${CURSOS.filter(c => c.modulo === 'B').map(filaB).join('')}
        </div>
      </section>

      <aside class="card" aria-label="Promedio general">
        <p class="etiqueta">Promedio general</p>
        <div class="caja-promedio caja-promedio__fila">
          <span>Promedio actual</span>
          <span class="caja-promedio__valor">${redondear(promedioGeneral())}</span>
        </div>
      </aside>
    </div>`;
}

/* =========================================================
   HU-10 · Calificaciones · Detalle del curso
   ========================================================= */
function paginaDetalle() {
  dibujarEstructura('calificaciones');
  const id = new URLSearchParams(location.search).get('curso') || 'ux';
  const curso = CURSOS.find(c => c.id === id && c.modulo === 'A') || CURSOS[0];
  const prom = promedioCurso(curso);
  document.title = `${curso.nombre} · Calificaciones`;

  const filas = [...curso.evaluaciones].sort((a, b) => a.fecha - b.fecha).map(e => {
    const comp = COMPONENTES[e.tipo];
    const calificada = e.nota !== null;
    return `
      <tr>
        <td>${e.tipo} · ${comp.nombre}</td>
        <td class="sec">${fechaCorta(e.fecha)}</td>
        <td class="sec">${comp.peso}%</td>
        <td class="${calificada ? 'nota' : 'sec'}">${calificada ? `${e.nota}/20` : '—'}</td>
        <td><span class="badge ${calificada ? 'badge--success' : ''}">${calificada ? 'Calificado' : 'Pendiente'}</span></td>
      </tr>`;
  }).join('');

  /* Texto del cálculo: (20% × TB1 + 15% × PC1) ÷ 35% = (3.6 + 2.7) ÷ 0.35 = 18 */
  const calificadas = curso.evaluaciones.filter(e => e.nota !== null);
  const terminos = calificadas.map(e => `${COMPONENTES[e.tipo].peso}% × ${e.tipo}`).join(' + ');
  const parciales = calificadas.map(e => redondear(e.nota * COMPONENTES[e.tipo].peso / 100)).join(' + ');
  const formulaFinal = FORMULA_ORDEN.map(t => `${COMPONENTES[t].peso}% (${t})`).join(' + ');

  document.getElementById('contenido').innerHTML = `
    <nav class="migas" aria-label="Ruta">
      <a href="${RUTAS.calificaciones}">Calificaciones</a><span aria-hidden="true">/</span><span>${curso.nombre}</span>
    </nav>
    <h1 class="titulo-pagina">${curso.nombre}</h1>
    <p class="subtitulo" style="margin-top:-4px">${curso.profesor}</p>

    <section class="card">
      <p class="etiqueta">Promedio del curso</p>
      <div class="caja-promedio">
        <div class="caja-promedio__fila">
          <span>Promedio actual</span>
          <span class="caja-promedio__valor">${prom ? redondear(prom.valor) : '—'}</span>
        </div>
        <p class="texto-sec" style="margin:6px 0 0">
          Promedio ponderado de las evaluaciones calificadas al ${fechaCorta(FECHA_HOY)} (${prom ? prom.pesoEvaluado : 0}% del curso).
        </p>
      </div>
    </section>

    <section class="card tabla-wrap">
      <table class="tabla">
        <thead>
          <tr><th>Tarea</th><th class="col-fecha">Fecha</th><th class="col-peso">Peso</th><th class="col-nota">Calificación</th><th class="col-estado">Estado</th></tr>
        </thead>
        <tbody>${filas}</tbody>
        <tfoot>
          <tr>
            <td colspan="2">PROMEDIO PARCIAL</td>
            <td>${prom ? prom.pesoEvaluado : 0}% evaluado</td>
            <td>${prom ? `${redondear(prom.valor)}/20` : '—'}</td>
            <td><span class="badge badge--accent">En curso</span></td>
          </tr>
        </tfoot>
      </table>
    </section>

    <p class="formula">
      NOTA FINAL = ${formulaFinal}<br>
      ${prom ? `PROMEDIO PARCIAL = (${terminos}) ÷ ${prom.pesoEvaluado}% = (${parciales}) ÷ ${prom.pesoEvaluado / 100} = ${redondear(prom.valor)}` : ''}
    </p>`;
}

/* =========================================================
   HU-04 · Actividades por realizar
   ========================================================= */

/* Junta evaluaciones y actividades sin peso de los cursos del módulo vigente */
function obtenerActividades() {
  const lista = [];
  CURSOS.filter(c => c.modulo === 'A').forEach(c => {
    c.evaluaciones.forEach(e => lista.push({
      titulo: `${e.tipo} · ${COMPONENTES[e.tipo].nombre}`, curso: c, fecha: e.fecha,
      publicado: e.publicado, peso: COMPONENTES[e.tipo].peso, completada: e.nota !== null
    }));
    c.actividadesSinPeso.forEach(a => lista.push({
      titulo: a.titulo, curso: c, fecha: a.fecha, publicado: a.publicado, peso: null, completada: false
    }));
  });
  return lista.sort((a, b) => a.fecha - b.fecha);
}

const textoPeso = a => (a.peso ? `${a.peso}% nota final` : 'Sin peso en la nota');

function tarjetaActividad(a) {
  const t = tiempoRestante(a.fecha);
  const rec = proximoRecordatorio(a.fecha);
  return `
    <article class="card actividad">
      <div class="actividad__info">
        <h3 class="actividad__titulo">${a.titulo}</h3>
        <span class="texto-sec">${a.curso.nombre} · NRC ${a.curso.nrc} · Publicado por ${a.curso.profesor} el ${fechaCorta(a.publicado)}</span>
        <span class="actividad__meta">${icono('calendario')}${fechaCompleta(a.fecha)}</span>
        ${rec ? `<span class="actividad__meta actividad__recordatorio">${icono('reloj')}Recordatorio: ${rec}</span>` : ''}
      </div>
      <div class="actividad__acciones">
        <span class="texto-sec">${textoPeso(a)}</span>
        <span class="badge badge--md badge--${t.tono}">${t.texto}</span>
        <a class="btn btn--secundario btn--sm" href="#">Ver actividad</a>
      </div>
    </article>`;
}

function filaProxima(a) {
  return `
    <div class="proxima">
      <div class="proxima__info">
        <p class="proxima__titulo">${a.titulo}</p>
        <span class="texto-sec">${a.curso.nombre}</span>
      </div>
      <span class="texto-sec">${textoPeso(a)}</span>
      <span class="proxima__fecha">${icono('calendario')}${fechaCompleta(a.fecha)}</span>
    </div>`;
}

const PROXIMAS_VISIBLES = 3;
let mostrarTodasProximas = false;

function vistaPorRealizar(pendientes) {
  const finSemana = finDeSemana(FECHA_HOY);
  const hoy = pendientes.filter(a => mismoDia(a.fecha, FECHA_HOY));
  const semana = pendientes.filter(a => !mismoDia(a.fecha, FECHA_HOY) && a.fecha <= finSemana);
  const proximas = pendientes.filter(a => a.fecha > finSemana);
  const visibles = mostrarTodasProximas ? proximas : proximas.slice(0, PROXIMAS_VISIBLES);
  const restantes = proximas.length - PROXIMAS_VISIBLES;

  const grupo = (titulo, items) => items.length
    ? `<h2 class="titulo-seccion">${titulo}</h2><div class="lista-actividades">${items.map(tarjetaActividad).join('')}</div>` : '';

  return `
    ${grupo('Hoy', hoy)}
    ${grupo('Esta semana', semana)}
    ${proximas.length ? `
      <h2 class="titulo-seccion">Próximas semanas</h2>
      <section class="card card--lista">${visibles.map(filaProxima).join('')}</section>
      ${restantes > 0 ? `<button class="btn-enlace" id="ver-todas" type="button">${mostrarTodasProximas
        ? 'Mostrar menos'
        : `+ ${restantes} evaluaciones más hasta el fin del módulo (${fechaCorta(MODULOS.A.fin)}) · Ver todas →`}</button>` : ''}` : ''}`;
}

function vistaCompletadas(completadas) {
  if (!completadas.length) return '<div class="card vacio">Aún no has completado evaluaciones en este módulo.</div>';
  return `<section class="card card--lista">${completadas.map(a => `
    <div class="proxima">
      <div class="proxima__info"><p class="proxima__titulo">${a.titulo}</p><span class="texto-sec">${a.curso.nombre}</span></div>
      <span class="texto-sec">${textoPeso(a)}</span>
      <span class="proxima__fecha">${icono('calendario')}${fechaCorta(a.fecha)}</span>
      <span class="badge badge--success">Completada</span>
    </div>`).join('')}</section>`;
}

function paginaActividades() {
  dibujarEstructura('evaluaciones');
  const todas = obtenerActividades();
  const pendientes = todas.filter(a => !a.completada && a.fecha >= FECHA_HOY);
  const completadas = todas.filter(a => a.completada).reverse();
  const vencidas = todas.filter(a => !a.completada && a.fecha < FECHA_HOY);
  let pestana = 'pendientes';

  const contenido = document.getElementById('contenido');
  contenido.innerHTML = `
    <h1 class="titulo-pagina">Actividades por realizar</h1>
    <p class="subtitulo">Mostrando solo las evaluaciones vigentes del ${ESTUDIANTE.moduloActual} · Actualizado al ${fechaCorta(FECHA_HOY)}</p>

    <div class="banner" role="status">
      ${icono('reloj')}<span class="banner__texto" id="texto-recordatorios"></span>
      <button class="btn-enlace" type="button" id="abrir-config">Configurar</button>
    </div>

    <div class="filtros">
      <label class="sr-only" for="periodo">Periodo</label>
      <select class="select" id="periodo"><option>Periodo: ${ESTUDIANTE.periodo} · ${ESTUDIANTE.moduloActual}</option></select>
      <label class="sr-only" for="orden">Ordenar</label>
      <select class="select" id="orden"><option>Ordenar por: Proximidad de vencimiento</option></select>
    </div>

    <div class="tabs" role="tablist">
      <button class="tab" role="tab" data-tab="pendientes">Por realizar (${pendientes.length})</button>
      <button class="tab" role="tab" data-tab="completadas">Completadas (${completadas.length})</button>
      <button class="tab" role="tab" data-tab="vencidas">Vencidas (${vencidas.length})</button>
      <span class="tabs__divisor" aria-hidden="true"></span>
      <button class="tab" role="tab" data-tab="historial">Historial</button>
    </div>

    <div id="panel" role="tabpanel"></div>

    <p class="nota-pie">Las actividades de módulos anteriores no se muestran aquí para evitar confusiones.
      Consúltalas en <button class="btn-enlace" type="button" data-ir="historial">Historial →</button></p>

    <dialog id="config">
      <form method="dialog">
        <h2>Recordatorios</h2>
        <p class="texto-sec" style="margin:0 0 8px">Elige cuándo quieres que te avisemos antes de cada vencimiento.</p>
        <label><input type="checkbox" id="rec-dia"> 1 día antes</label>
        <label><input type="checkbox" id="rec-hora"> 1 hora antes</label>
        <div class="acciones">
          <button class="btn btn--secundario btn--sm" value="cancelar">Cancelar</button>
          <button class="btn btn--primario btn--sm" value="guardar" id="guardar-config">Guardar</button>
        </div>
      </form>
    </dialog>`;

  const panel = document.getElementById('panel');

  function textoRecordatorios() {
    const partes = [];
    if (RECORDATORIOS.diaAntes) partes.push('1 día antes');
    if (RECORDATORIOS.horaAntes) partes.push('1 hora antes');
    document.getElementById('texto-recordatorios').textContent = partes.length
      ? `Recordatorios activos: ${partes.join(' y ')} del vencimiento`
      : 'Recordatorios desactivados';
  }

  function mostrar() {
    contenido.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === pestana)));
    if (pestana === 'pendientes') panel.innerHTML = vistaPorRealizar(pendientes);
    if (pestana === 'completadas') panel.innerHTML = vistaCompletadas(completadas);
    if (pestana === 'vencidas') panel.innerHTML = '<div class="card vacio">No tienes evaluaciones vencidas en este módulo.</div>';
    if (pestana === 'historial') panel.innerHTML = '<div class="card vacio">Aquí verás las actividades de módulos y periodos anteriores, separadas de las vigentes.</div>';
    panel.style.display = 'flex';
    panel.style.flexDirection = 'column';
    panel.style.gap = '12px';
  }

  /* Eventos */
  contenido.addEventListener('click', e => {
    const tab = e.target.closest('[data-tab]');
    const ir = e.target.closest('[data-ir]');
    if (tab) { pestana = tab.dataset.tab; mostrar(); }
    if (ir) { pestana = ir.dataset.ir; mostrar(); window.scrollTo({ top: 0 }); }
    if (e.target.id === 'ver-todas') { mostrarTodasProximas = !mostrarTodasProximas; mostrar(); }
  });

  const dialogo = document.getElementById('config');
  document.getElementById('abrir-config').addEventListener('click', () => {
    document.getElementById('rec-dia').checked = RECORDATORIOS.diaAntes;
    document.getElementById('rec-hora').checked = RECORDATORIOS.horaAntes;
    dialogo.showModal();
  });
  dialogo.addEventListener('close', () => {
    if (dialogo.returnValue !== 'guardar') return;
    RECORDATORIOS.diaAntes = document.getElementById('rec-dia').checked;
    RECORDATORIOS.horaAntes = document.getElementById('rec-hora').checked;
    textoRecordatorios();
    mostrar();
  });

  textoRecordatorios();
  mostrar();
}

/* ---------- Arranque: según el data-pagina del <body> ---------- */
const PAGINAS = {
  inicio: paginaInicio,
  calificaciones: paginaCalificaciones,
  detalle: paginaDetalle,
  actividades: paginaActividades
};
document.addEventListener('DOMContentLoaded', () => {
  const pagina = document.body.dataset.pagina;
  if (PAGINAS[pagina]) PAGINAS[pagina]();
});
