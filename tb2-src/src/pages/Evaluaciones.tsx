// Porte a React de la pantalla de Carmen (daniela-hu04-hu10/hu04/actividades.html + js/app.js).
// Mismo HTML pasado a JSX y mismo CSS (./evaluaciones/estilos-carmen.css); la lógica que
// reescribía el DOM ahora es estado del componente. Solo se porta el contenido: el sidebar es el de la app.
import { useRef, useState } from "react";
import { Alerta } from "@/components/ui";
import { esEvaluacion, HU04_COMPONENTES, HU04_CURSOS, HU04_ESTUDIANTE, HU04_FECHA_HOY, HU04_MODULO_A_FIN, sinFechaOficial, type Actividad, type Hu04Curso } from "@/data";
import { hrefSinFecha } from "@/rutas";
import "./evaluaciones/estilos-carmen.css";

/* ---------- Íconos (SVG en línea) ---------- */
const ICONOS = {
  calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
};
function IconoCarmen({ nombre }: { nombre: keyof typeof ICONOS }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICONOS[nombre] }}
    />
  );
}

/* ---------- Utilidades de fecha ---------- */
const FECHA_HOY = HU04_FECHA_HOY;
const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
const dos = (n: number) => String(n).padStart(2, "0");
const fechaCorta = (d: Date) => `${dos(d.getDate())}/${dos(d.getMonth() + 1)}/${d.getFullYear()}`;
const hora = (d: Date) => `${dos(d.getHours())}:${dos(d.getMinutes())}`;
const mismoDia = (a: Date, b: Date) => a.toDateString() === b.toDateString();

/* "Hoy · lun 05/10/2026, 18:00"  o  "jue 08/10/2026, 20:00" */
function fechaCompleta(d: Date) {
  const base = `${DIAS[d.getDay()]} ${fechaCorta(d)}, ${hora(d)}`;
  return mismoDia(d, FECHA_HOY) ? `Hoy · ${base}` : base;
}

/* Fin de la semana actual (domingo 23:59) */
function finDeSemana(d: Date) {
  const fin = new Date(d);
  fin.setDate(d.getDate() + ((7 - d.getDay()) % 7));
  fin.setHours(23, 59, 59);
  return fin;
}

/* Badge de tiempo restante: "Vence en 3 h", "Vence en 3 días" */
function tiempoRestante(fecha: Date) {
  const horas = Math.round((fecha.getTime() - FECHA_HOY.getTime()) / 36e5);
  if (horas < 24) return { texto: `Vence en ${horas} h`, tono: "warn" };
  const dias = Math.round(horas / 24);
  return { texto: `Vence en ${dias} día${dias === 1 ? "" : "s"}`, tono: dias <= 2 ? "warn" : "neutral" };
}

type Recordatorios = { diaAntes: boolean; horaAntes: boolean };

/* Próximo recordatorio según las preferencias (1 día antes / 1 hora antes) */
function proximoRecordatorio(fecha: Date, rec: Recordatorios) {
  const opciones: Date[] = [];
  if (rec.diaAntes) opciones.push(new Date(fecha.getTime() - 864e5));
  if (rec.horaAntes) opciones.push(new Date(fecha.getTime() - 36e5));
  const futuras = opciones.filter((d) => d > FECHA_HOY).sort((a, b) => a.getTime() - b.getTime());
  if (!futuras.length) return null;
  const r = futuras[0];
  return mismoDia(r, FECHA_HOY) ? `hoy ${hora(r)}` : `${DIAS[r.getDay()]} ${fechaCorta(r)}, ${hora(r)}`;
}

/* Junta evaluaciones y actividades sin peso de los cursos del módulo vigente */
type Item = { titulo: string; curso: Hu04Curso; fecha: Date; publicado: Date; peso: number | null; completada: boolean };
function obtenerActividades(): Item[] {
  const lista: Item[] = [];
  HU04_CURSOS.filter((c) => c.modulo === "A").forEach((c) => {
    c.evaluaciones.forEach((e) =>
      lista.push({
        titulo: `${e.tipo} · ${HU04_COMPONENTES[e.tipo].nombre}`, curso: c, fecha: e.fecha,
        publicado: e.publicado, peso: HU04_COMPONENTES[e.tipo].peso, completada: e.nota !== null,
      }),
    );
    c.actividadesSinPeso.forEach((a) =>
      lista.push({ titulo: a.titulo, curso: c, fecha: a.fecha, publicado: a.publicado, peso: null, completada: false }),
    );
  });
  return lista.sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
}

const textoPeso = (a: Item) => (a.peso ? `${a.peso}% nota final` : "Sin peso en la nota");

function TarjetaActividad({ a, rec }: { a: Item; rec: Recordatorios }) {
  const t = tiempoRestante(a.fecha);
  const r = proximoRecordatorio(a.fecha, rec);
  return (
    <article className="card actividad">
      <div className="actividad__info">
        <h3 className="actividad__titulo">{a.titulo}</h3>
        <span className="texto-sec">
          {a.curso.nombre} · NRC {a.curso.nrc} · Publicado por {a.curso.profesor} el {fechaCorta(a.publicado)}
        </span>
        <span className="actividad__meta">
          <IconoCarmen nombre="calendario" />
          {fechaCompleta(a.fecha)}
        </span>
        {r && (
          <span className="actividad__meta actividad__recordatorio">
            <IconoCarmen nombre="reloj" />
            Recordatorio: {r}
          </span>
        )}
      </div>
      <div className="actividad__acciones">
        <span className="texto-sec">{textoPeso(a)}</span>
        <span className={`badge badge--md badge--${t.tono}`}>{t.texto}</span>
        <a className="btn btn--secundario btn--sm" href="#" onClick={(e) => e.preventDefault()}>
          Ver actividad
        </a>
      </div>
    </article>
  );
}

function FilaProxima({ a }: { a: Item }) {
  return (
    <div className="proxima">
      <div className="proxima__info">
        <p className="proxima__titulo">{a.titulo}</p>
        <span className="texto-sec">{a.curso.nombre}</span>
      </div>
      <span className="texto-sec">{textoPeso(a)}</span>
      <span className="proxima__fecha">
        <IconoCarmen nombre="calendario" />
        {fechaCompleta(a.fecha)}
      </span>
    </div>
  );
}

const PROXIMAS_VISIBLES = 3;

function VistaPorRealizar({ pendientes, rec, mostrarTodas, onVerTodas }: { pendientes: Item[]; rec: Recordatorios; mostrarTodas: boolean; onVerTodas: () => void }) {
  const finSemana = finDeSemana(FECHA_HOY);
  const hoy = pendientes.filter((a) => mismoDia(a.fecha, FECHA_HOY));
  const semana = pendientes.filter((a) => !mismoDia(a.fecha, FECHA_HOY) && a.fecha <= finSemana);
  const proximas = pendientes.filter((a) => a.fecha > finSemana);
  const visibles = mostrarTodas ? proximas : proximas.slice(0, PROXIMAS_VISIBLES);
  const restantes = proximas.length - PROXIMAS_VISIBLES;

  const grupo = (titulo: string, items: Item[]) =>
    items.length > 0 && (
      <>
        <h2 className="titulo-seccion">{titulo}</h2>
        <div className="lista-actividades">
          {items.map((a) => (
            <TarjetaActividad key={a.titulo + a.curso.id} a={a} rec={rec} />
          ))}
        </div>
      </>
    );

  return (
    <>
      {grupo("Hoy", hoy)}
      {grupo("Esta semana", semana)}
      {proximas.length > 0 && (
        <>
          <h2 className="titulo-seccion">Próximas semanas</h2>
          <section className="card card--lista">
            {visibles.map((a) => (
              <FilaProxima key={a.titulo + a.curso.id} a={a} />
            ))}
          </section>
          {restantes > 0 && (
            <button className="btn-enlace" id="ver-todas" type="button" onClick={onVerTodas}>
              {mostrarTodas
                ? "Mostrar menos"
                : `+ ${restantes} evaluaciones más hasta el fin del módulo (${fechaCorta(HU04_MODULO_A_FIN)}) · Ver todas →`}
            </button>
          )}
        </>
      )}
    </>
  );
}

function VistaCompletadas({ completadas }: { completadas: Item[] }) {
  if (!completadas.length) return <div className="card vacio">Aún no has completado evaluaciones en este módulo.</div>;
  return (
    <section className="card card--lista">
      {completadas.map((a) => (
        <div className="proxima" key={a.titulo + a.curso.id}>
          <div className="proxima__info">
            <p className="proxima__titulo">{a.titulo}</p>
            <span className="texto-sec">{a.curso.nombre}</span>
          </div>
          <span className="texto-sec">{textoPeso(a)}</span>
          <span className="proxima__fecha">
            <IconoCarmen nombre="calendario" />
            {fechaCorta(a.fecha)}
          </span>
          <span className="badge badge--success">Completada</span>
        </div>
      ))}
    </section>
  );
}

type Pestana = "pendientes" | "completadas" | "vencidas" | "historial";

export default function Evaluaciones({ actividades }: { actividades: Actividad[] }) {
  // Aviso de HU-05: misma fuente que la pantalla Sin fecha oficial, solo evaluaciones.
  const sinFecha = sinFechaOficial(actividades).filter(esEvaluacion).length;
  const todas = obtenerActividades();
  const pendientes = todas.filter((a) => !a.completada && a.fecha >= FECHA_HOY);
  const completadas = todas.filter((a) => a.completada).reverse();
  const vencidas = todas.filter((a) => !a.completada && a.fecha < FECHA_HOY);

  const [pestana, setPestana] = useState<Pestana>("pendientes");
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [rec, setRec] = useState<Recordatorios>({ diaAntes: true, horaAntes: true });
  const [borrador, setBorrador] = useState<Recordatorios>(rec);
  const dialogo = useRef<HTMLDialogElement>(null);

  const partes = [];
  if (rec.diaAntes) partes.push("1 día antes");
  if (rec.horaAntes) partes.push("1 hora antes");
  const textoRecordatorios = partes.length ? `Recordatorios activos: ${partes.join(" y ")} del vencimiento` : "Recordatorios desactivados";

  const tab = (id: Pestana, texto: string) => (
    <button className="tab" role="tab" aria-selected={pestana === id} onClick={() => setPestana(id)}>
      {texto}
    </button>
  );

  return (
    <div className="carmen">
    <main className="main">
      <h1 className="titulo-pagina">Evaluaciones por realizar</h1>
      <p className="subtitulo">
        Mostrando solo las evaluaciones vigentes del {HU04_ESTUDIANTE.moduloActual} · Actualizado al {fechaCorta(FECHA_HOY)}
      </p>

      <div className="banner" role="status">
        <IconoCarmen nombre="reloj" />
        <span className="banner__texto">{textoRecordatorios}</span>
        <button
          className="btn-enlace"
          type="button"
          onClick={() => {
            setBorrador(rec);
            dialogo.current?.showModal();
          }}
        >
          Configurar
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="filtros">
        <label className="sr-only" htmlFor="periodo">Periodo</label>
        <select className="select" id="periodo">
          <option>
            Periodo: {HU04_ESTUDIANTE.periodo} · {HU04_ESTUDIANTE.moduloActual}
          </option>
        </select>
        <label className="sr-only" htmlFor="orden">Ordenar</label>
        <select className="select" id="orden">
          <option>Ordenar por: Proximidad de vencimiento</option>
        </select>
      </div>
        {sinFecha > 0 && (
          <div className="w-full md:w-[400px]">
            <Alerta
              tono="warn"
              texto={sinFecha === 1 ? "1 evaluación aún no tiene fecha oficial" : `${sinFecha} evaluaciones aún no tienen fecha oficial`}
              accion={{ etiqueta: "Ver", href: hrefSinFecha() }}
            />
          </div>
        )}
      </div>

      <div className="tabs" role="tablist">
        {tab("pendientes", `Por realizar (${pendientes.length})`)}
        {tab("completadas", `Completadas (${completadas.length})`)}
        {tab("vencidas", `Vencidas (${vencidas.length})`)}
        <span className="tabs__divisor" aria-hidden="true"></span>
        {tab("historial", "Historial")}
      </div>

      <div id="panel" role="tabpanel" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {pestana === "pendientes" && (
          <VistaPorRealizar pendientes={pendientes} rec={rec} mostrarTodas={mostrarTodas} onVerTodas={() => setMostrarTodas((v) => !v)} />
        )}
        {pestana === "completadas" && <VistaCompletadas completadas={completadas} />}
        {pestana === "vencidas" && <div className="card vacio">No tienes evaluaciones vencidas en este módulo.</div>}
        {pestana === "historial" && (
          <div className="card vacio">Aquí verás las actividades de módulos y periodos anteriores, separadas de las vigentes.</div>
        )}
      </div>

      <p className="nota-pie">
        Las actividades de módulos anteriores no se muestran aquí para evitar confusiones. Consúltalas en{" "}
        <button
          className="btn-enlace"
          type="button"
          onClick={() => {
            setPestana("historial");
            window.scrollTo({ top: 0 });
          }}
        >
          Historial →
        </button>
      </p>

      <dialog
        id="config"
        ref={dialogo}
        onClose={() => {
          if (dialogo.current?.returnValue === "guardar") setRec(borrador);
        }}
      >
        <form method="dialog">
          <h2>Recordatorios</h2>
          <p className="texto-sec" style={{ margin: "0 0 8px" }}>
            Elige cuándo quieres que te avisemos antes de cada vencimiento.
          </p>
          <label>
            <input type="checkbox" checked={borrador.diaAntes} onChange={(e) => setBorrador((b) => ({ ...b, diaAntes: e.target.checked }))} /> 1 día
            antes
          </label>
          <label>
            <input type="checkbox" checked={borrador.horaAntes} onChange={(e) => setBorrador((b) => ({ ...b, horaAntes: e.target.checked }))} /> 1 hora
            antes
          </label>
          <div className="acciones">
            <button className="btn btn--secundario btn--sm" value="cancelar">
              Cancelar
            </button>
            <button className="btn btn--primario btn--sm" value="guardar">
              Guardar
            </button>
          </div>
        </form>
      </dialog>
    </main>
    </div>
  );
}
