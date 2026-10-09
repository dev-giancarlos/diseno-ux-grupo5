// Pantalla de Giancarlos (HU-01 · Actividades), construida desde Figma (nodo 451:11859).
// Solo el encabezado tiene funcionalidad: lleva a Sin fecha oficial y abre el modal de HU-03.
// El banner, los filtros, las pestañas y la lista son estáticos, con los datos de ejemplo de Figma.
import { BadgeConteo, Boton, Icono, Input } from "@/components/ui";
import { HU01_GRUPOS, sinFechaOficial, type Actividad, type Hu01Actividad } from "@/data";
import { hrefSinFecha } from "@/rutas";

const TOTAL = HU01_GRUPOS.reduce((n, g) => n + g.actividades.length, 0);

function FilaPendiente({ a }: { a: Hu01Actividad }) {
  return (
    <div className="flex w-full flex-wrap items-center gap-4 rounded-[10px] border border-border bg-card px-5 py-[14px] md:h-[76px] md:flex-nowrap">
      <div className="flex min-w-[200px] flex-1 flex-col gap-1">
        <div className="flex gap-2 text-[12px]">
          <p className={`flex-1 font-medium ${a.urgente ? "text-warning-foreground" : "text-state-neutral"}`}>{a.plazo}</p>
          <p className="whitespace-nowrap text-muted-foreground">{a.fecha}</p>
        </div>
        <p className="text-[14px] font-semibold text-foreground">{a.titulo}</p>
      </div>
      <div className="md:w-[230px]">
        <span
          className="inline-flex rounded-full px-2 py-1 text-[11px] font-semibold whitespace-nowrap"
          style={{ background: a.curso.fondo, color: a.curso.texto }}
        >
          {a.curso.nombre}
        </span>
      </div>
      <div className="flex w-[80px] flex-col gap-[3px] whitespace-nowrap">
        <p className="text-[14px] font-semibold text-foreground">{a.peso}</p>
        <p className="text-[11px] text-muted-foreground">nota final</p>
      </div>
      <Boton variant="secondary" size="sm">
        Ver actividad
      </Boton>
    </div>
  );
}

function Pestana({ texto, activa = false }: { texto: string; activa?: boolean }) {
  return (
    <span
      className={`px-3 py-2 text-[14px] whitespace-nowrap ${
        activa ? "border-b-2 border-accent-solid font-semibold text-foreground" : "text-muted-foreground"
      }`}
    >
      {texto}
    </span>
  );
}

export default function Actividades({ actividades, onAgregar }: { actividades: Actividad[]; onAgregar: () => void }) {
  const n = sinFechaOficial(actividades).length;
  return (
    <main className="flex min-w-0 flex-1 flex-col" data-name="main-content">
      <div className="flex flex-col gap-[10px] px-4 pt-7 pb-6 md:px-9">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="flex-1 text-[27px] font-bold text-foreground">Actividades</h1>
          <div className="flex flex-wrap items-center gap-4">
            <Boton variant="link" href={hrefSinFecha()} iconoFin>
              Sin fecha oficial
              <BadgeConteo numero={n} tono="suave" size="sm" />
            </Boton>
            <Boton iconoInicio="calendario-mas" onClick={onAgregar}>
              Agregar actividad
            </Boton>
          </div>
        </div>
        <p className="text-[14px] leading-[1.5] text-muted-foreground">
          Lista unificada de tareas y evaluaciones pendientes de todos tus cursos inscritos
        </p>
      </div>

      <div className="flex flex-col gap-6 px-4 pt-2 pb-7 md:px-9">
        <div className="flex min-h-12 items-center gap-[10px] rounded-[8px] border border-[#eef0ff] bg-accent-muted px-3 py-[11px] text-[13px] text-foreground">
          <Icono nombre="success" />
          <p className="flex-1">Vista unificada activa: Estás viendo las actividades pendientes integradas de tus 5 cursos matriculados.</p>
        </div>

        <div className="flex items-center gap-3">
          <h2 className="text-[20px] font-normal text-foreground">Todas mis actividades pendientes</h2>
          <BadgeConteo numero={TOTAL} tono="suave" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full sm:w-[260px]">
            <Input id="act-curso" tipo="selector" valor="todos" opciones={[{ valor: "todos", etiqueta: "Todos los cursos" }]} etiquetaAria="Curso" />
          </div>
          <div className="w-full sm:w-[375px]">
            <Input
              id="act-orden"
              tipo="selector"
              valor="proximidad"
              opciones={[{ valor: "proximidad", etiqueta: "Ordenar por: Proximidad de vencimiento" }]}
              etiquetaAria="Ordenar"
            />
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto border-b border-border">
          <Pestana texto={`Todos los pendientes (${TOTAL})`} activa />
          <Pestana texto="Por entregar esta semana (3)" />
          <Pestana texto="Vencidas (0)" />
        </div>

        <div className="flex flex-col gap-5">
          {HU01_GRUPOS.map((g) => (
            <section key={g.titulo} className="flex flex-col gap-[10px]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-normal text-foreground">{g.titulo}</h3>
                  <BadgeConteo numero={g.actividades.length} tono="suave" size="sm" />
                </div>
                <p className="text-[11px] text-muted-foreground">{g.rango}</p>
              </div>
              {g.actividades.map((a) => (
                <FilaPendiente key={a.titulo} a={a} />
              ))}
            </section>
          ))}
          <div className="flex flex-wrap justify-between gap-2 pt-1 text-muted-foreground">
            <p className="text-[12px]">Mostrando {TOTAL} actividades pendientes de 5 cursos</p>
            <p className="text-[11px]">Hora local · Lima (GMT-5)</p>
          </div>
        </div>
      </div>
    </main>
  );
}
