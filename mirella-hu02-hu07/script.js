const HOY = new Date(2026, 9, 8, 15, 0);          // jueves 8 de octubre de 2026, 15:00

const CURSOS = [
  { id: "md", nombre: "Matemática Discreta",             prof: "Prof. Andrés Salazar",  tono: "purple" },
  { id: "ux", nombre: "Diseño UX",                       prof: "Prof. Mariana Torres",  tono: "pink"   },
  { id: "bd", nombre: "Base de Datos",                   prof: "Prof. Carlos Mendoza",  tono: "cyan"   },
  { id: "p2", nombre: "Programación II",                 prof: "Prof. Lucía Paredes",   tono: "green"  },
  { id: "mi", nombre: "Metodología de la Investigación", prof: "Prof. Jorge Castillo",  tono: "amber"  },
];

// peso = % de la nota final (null = no calificada)
const PENDIENTES = [
  { curso: "md", titulo: "PC1 - Práctica Calificada 1",                vence: new Date(2026, 9,  8, 18,  0), peso: 15 },
  { curso: "ux", titulo: "TB1 - Trabajo 1",                            vence: new Date(2026, 9,  8, 23, 59), peso: 20 },
  { curso: "bd", titulo: "Laboratorio 3 - Modelo relacional",          vence: new Date(2026, 9,  9, 20,  0), peso: 10 },
  { curso: "p2", titulo: "Adjuntar foto de DNI para la PC1 en línea",  vence: new Date(2026, 9,  9, 23, 59), peso: null },
  { curso: "p2", titulo: "PC1 - Estructuras de datos",                 vence: new Date(2026, 9, 10, 18,  0), peso: 15 },
  { curso: "mi", titulo: "TB1 - Planteamiento del problema",           vence: new Date(2026, 9, 11, 23, 59), peso: 15 },
  { curso: "md", titulo: "Tarea 4 - Relaciones y funciones",           vence: new Date(2026, 9, 13, 23, 59), peso: 5 },
  { curso: "ux", titulo: "Adjuntar video de presentación del proyecto",vence: new Date(2026, 9, 14, 23, 59), peso: null },
  { curso: "ux", titulo: "Avance de proyecto - Prototipo",             vence: new Date(2026, 9, 15, 23, 59), peso: 25 },
  { curso: "bd", titulo: "Control de lectura 2",                       vence: new Date(2026, 9, 18, 20,  0), peso: 10 },
  { curso: "p2", titulo: "Evaluación continua 2",                      vence: new Date(2026, 9, 20, 18,  0), peso: 15 },
];

// Actividades sin fecha oficial, por curso (suman 9)
const SIN_FECHA = { md: 3, ux: 1, bd: 2, p2: 1, mi: 2 };

// [curso, fecha de recepción, asunto, texto, ¿no leído?]  · más recientes primero
const ANUNCIOS = [
  ["ux", "04/10/26 · 07:30", "[Diseño UX] Rúbrica para el prototipo de baja fidelidad", "Buenos días, estudiantes. Ya está disponible la rúbrica. Incluyan el flujo principal y justifiquen sus decisiones en el Avance de proyecto del 15/10.", true],
  ["p2", "03/10/26 · 18:00", "[Programación II] Recordatorio: PC1 y código fuente", "Estimados alumnos, la PC1 cierra el 10/10 a las 18:00. Adjunten el archivo de código y comprueben que sus funciones se ejecuten sin errores.", true],
  ["bd", "03/10/26 · 09:00", "[Base de Datos] Indicaciones para el Laboratorio 3", "Hola a todos. En el Laboratorio 3 señalen claves y cardinalidades del modelo relacional. Revisen el ejemplo de clase antes de entregar el 09/10.", true],
  ["md", "02/10/26 · 16:00", "[Matemática Discreta] Guía de repaso para la PC1", "Estimados estudiantes, publiqué una guía con ejercicios resueltos. Úsenla para revisar sus tablas de verdad y preparar la PC1.", false],
  ["ux", "02/10/26 · 08:00", "[Diseño UX] Material de apoyo para entrevistas", "Queridos alumnos, encontrarán la pauta de entrevistas en Materiales. Eviten preguntas dirigidas y registren los hallazgos de cada participante.", true],
  ["p2", "01/10/26 · 15:00", "[Programación II] Ejemplos de estructuras de datos disponibles", "Hola, estudiantes. Subí los ejemplos que trabajamos en clase. Practiquen con datos distintos y anoten sus dudas para la próxima sesión.", false],
  ["bd", "30/09/26 · 11:00", "[Base de Datos] Lectura previa: claves y relaciones", "Estimados alumnos, revisen la lectura de claves primarias y foráneas para el Control de lectura 2. Traigan un ejemplo de relación uno a muchos.", false],
  ["md", "29/09/26 · 17:00", "[Matemática Discreta] Tarea 4: criterios de evaluación", "Buenas tardes. Se evaluarán el procedimiento y la justificación de cada relación. La entrega de la Tarea 4 está habilitada hasta el 13/10.", false],
  ["ux", "28/09/26 · 10:00", "[Diseño UX] Próxima clase: revisión de wireframes", "Hola a todos. Traigan sus primeros bocetos del flujo principal. Revisaremos la jerarquía de información y les daré comentarios por equipo.", false],
  ["mi", "27/09/26 · 09:00", "[Metodología de la Investigación] TB1: lineamientos del planteamiento", "Estimados estudiantes, ya pueden consultar los lineamientos del TB1. Delimiten el problema y formulen su pregunta antes de nuestra sesión.", false],
];

/* ====== UTILIDADES ====== */
const $ = id => document.getElementById(id);
const dos = n => String(n).padStart(2, "0");
const MESES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const MESES_LARGOS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
const DIAS_LARGOS = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const soloDia = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const diasEntre = (a, b) => Math.round((soloDia(b) - soloDia(a)) / 864e5);
const curso = id => CURSOS.find(c => c.id === id);
const hora = d => `${dos(d.getHours())}:${dos(d.getMinutes())}`;
const delMes = d => `${d.getDate()} de ${MESES_LARGOS[d.getMonth()]}`;

// Semana actual: hasta el domingo
const hoyDia = soloDia(HOY);
const domingo = new Date(hoyDia); domingo.setDate(hoyDia.getDate() + ((7 - hoyDia.getDay()) % 7));
const lunes = new Date(domingo);  lunes.setDate(domingo.getDate() + 1);
const manana = new Date(hoyDia);  manana.setDate(hoyDia.getDate() + 1);

function estado(p) {                       // vencida | hoy | semana | proximas
  if (p.vence < HOY) return "vencida";
  const d = diasEntre(HOY, p.vence);
  if (d === 0) return "hoy";
  return soloDia(p.vence) <= domingo ? "semana" : "proximas";
}

/* ====== ESTADO ====== */
const state = { curso: "todos", orden: "proximidad", tab: "todos" };

/* ====== ACTIVIDADES ====== */
function fila(p) {
  const c = curso(p.curso), d = diasEntre(HOY, p.vence), est = estado(p);
  const urgencia = est === "vencida" ? "Vencida" : d === 0 ? `Vence hoy a las ${hora(p.vence)}` : d === 1 ? "Vence mañana" : `Vence en ${d} días`;
  const clase = est === "vencida" ? "late" : d === 0 ? "urgent" : "";
  const fecha = `${p.vence.getDate()} ${MESES[p.vence.getMonth()]} · ${hora(p.vence)}`;
  const peso = p.peso != null ? [`${p.peso}%`, "nota final"] : ["Sin peso", "en la nota"];
  return `
    <article class="activity-row">
      <div class="activity-name"><span class="${clase}">${urgencia}</span><strong>${p.titulo}</strong></div>
      <time>${fecha}</time>
      <span class="course-badge ${c.tono}">${c.nombre}</span>
      <div class="weight"><strong>${peso[0]}</strong><small>${peso[1]}</small></div>
      <button type="button" class="outline-button small">Ver actividad</button>
    </article>`;
}

const porFecha = (a, b) => a.vence - b.vence;

function grupos(lista) {                   // devuelve [{titulo, rango, items}] según el orden elegido
  if (state.orden === "curso") {
    return CURSOS.map(c => ({ titulo: c.nombre, rango: c.prof, items: lista.filter(p => p.curso === c.id).sort(porFecha) }));
  }
  if (state.orden === "peso") {
    const items = [...lista].sort((a, b) => (b.peso ?? -1) - (a.peso ?? -1) || porFecha(a, b));
    return [{ titulo: "Mayor peso académico primero", rango: "Sin peso al final", items }];
  }
  return [
    { titulo: "Hoy",              rango: `${DIAS_LARGOS[hoyDia.getDay()]}, ${delMes(hoyDia)}`, items: lista.filter(p => estado(p) === "hoy").sort(porFecha) },
    { titulo: "Esta semana",      rango: `Del ${manana.getDate()} al ${delMes(domingo)}`,     items: lista.filter(p => estado(p) === "semana").sort(porFecha) },
    { titulo: "Próximas semanas", rango: `Desde el ${delMes(lunes)}`,                         items: lista.filter(p => estado(p) === "proximas").sort(porFecha) },
  ];
}

function renderActividades() {
  const base = PENDIENTES.filter(p => state.curso === "todos" || p.curso === state.curso);
  const nTodos = base.filter(p => estado(p) !== "vencida").length;
  const nSemana = base.filter(p => estado(p) === "semana").length;
  const nVenc = base.filter(p => estado(p) === "vencida").length;

  $("total-badge").textContent = nTodos;
  $("tab-todos").textContent = `Todos los pendientes (${nTodos})`;
  $("tab-semana").textContent = `Por entregar esta semana (${nSemana})`;
  $("tab-vencidas").textContent = `Vencidas (${nVenc})`;
  document.querySelectorAll(".tabs button").forEach(b => {
    b.classList.toggle("active", b.dataset.tab === state.tab);
    b.setAttribute("aria-selected", b.dataset.tab === state.tab);
  });

  const n = state.curso === "todos" ? Object.values(SIN_FECHA).reduce((a, b) => a + b, 0) : SIN_FECHA[state.curso];
  $("sin-fecha").textContent = n === 0 ? "" : n === 1
    ? "No incluye 1 actividad que aún no tiene fecha oficial."
    : `No incluye ${n} actividades que aún no tienen fecha oficial.`;

  // Pestaña activa → lista a mostrar
  let lista = base.filter(p => state.tab === "vencidas" ? estado(p) === "vencida"
                             : state.tab === "semana"   ? estado(p) === "semana"
                             : estado(p) !== "vencida");
  let html = "";
  if (state.tab === "vencidas" && lista.length === 0) {
    html = `<section class="activity-group empty-group"><header><span>Vencidas <b>0</b></span></header><div>No tienes actividades vencidas</div></section>`;
  } else if (lista.length === 0) {
    html = `<section class="activity-group empty-group"><div>No hay actividades para mostrar con este filtro</div></section>`;
  } else {
    html = grupos(lista).filter(g => g.items.length).map(g => `
      <section class="activity-group">
        <header><span>${g.titulo} <b>${g.items.length}</b></span><small>${g.rango}</small></header>
        ${g.items.map(fila).join("")}
      </section>`).join("");
  }
  $("activities").innerHTML = html;
  $("foot-left").textContent = state.tab === "vencidas" ? "" :
    `Mostrando ${lista.length} ${lista.length === 1 ? "actividad pendiente" : "actividades pendientes"}`;
}

$("f-curso").onchange = e => { state.curso = e.target.value; renderActividades(); };
$("f-orden").onchange = e => { state.orden = e.target.value; renderActividades(); };
document.querySelectorAll(".tabs button").forEach(b => b.onclick = () => { state.tab = b.dataset.tab; renderActividades(); });


//-- ------------------------- Yuli, Gian y Martín ------------------------- --//
/* ====== ANUNCIOS (barra y panel retráctil) ====== */
const noLeidos = ANUNCIOS.filter(a => a[4]).length;
$("bar-badge").textContent = noLeidos;
$("ann-unread").textContent = `${noLeidos} no leídos`;
$("ann-sum").textContent = `${ANUNCIOS.length} anuncios · Todos los cursos · Más recientes primero`;
$("ann-foot").textContent = `Mostrando ${ANUNCIOS.length} de ${ANUNCIOS.length} anuncios · Recepción hasta el 04/10/2026, 07:30`;
$("announcements").innerHTML = ANUNCIOS.map(([id, fecha, asunto, texto, sinLeer]) => `
  <article class="ann ${sinLeer ? "unread" : ""}">
    <div class="top"><span>${curso(id).nombre} · ${curso(id).prof}</span><span>${fecha}</span></div>
    <div class="subj"><span>${asunto}</span>${sinLeer ? '<span class="tag">No leído</span>' : ""}</div>
    <p>${texto}</p>
  </article>`).join("");

let abierto = false;
function setPanel(open) {
  abierto = open;
  $("ann-panel").classList.toggle("open", open);
  $("ann-panel").setAttribute("aria-hidden", !open);
  $("ann-bar").setAttribute("aria-expanded", open);
  $("bar-chev").innerHTML = `<use href="#i-${open ? "right" : "left"}"/>`;
}
$("ann-bar").onclick = () => setPanel(!abierto);                  // un clic abre; otro clic en la barra lo retrae
$("ann-bar").onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPanel(!abierto); } };
$("panel-close").onclick = () => setPanel(false);                 // "Cerrar" también lo retrae
//-- ------------------------- Yuli, Gian y Martín ------------------------- --//
//-- ------------------------- Yuli, Gian y Martín ------------------------- --//


/* ====== MENÚ ====== */
document.querySelectorAll("[data-inactivo]").forEach(a => a.onclick = e => e.preventDefault());   // solo "Actividades" está activa
$("menu-btn").onclick = () => {
  const abre = !$("sidebar").classList.contains("open");
  $("sidebar").classList.toggle("open", abre);
  $("menu-btn").setAttribute("aria-expanded", abre);
};

/* ====== INICIO ====== */
// Enlace directo: index.html#hu07 abre la página con el panel de anuncios desplegado
const aplicarHash = () => setPanel(location.hash === "#hu07");
window.addEventListener("hashchange", aplicarHash);
renderActividades();
aplicarHash();
