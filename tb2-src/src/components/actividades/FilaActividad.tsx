import { Badge, Boton, Icono } from "@/components/ui";
import { badgesDe, cursoPorId, fechaPropiaTexto, semanaDe, tieneFechaPropia, type Actividad } from "@/data";

type FilaProps = {
  actividad: Actividad;
  compacta?: boolean;
  onAccion?: (a: Actividad) => void;
};

// Fila única para lista, tarjeta de Inicio, escritorio y móvil (C8, C11).
export default function FilaActividad({ actividad: a, compacta = false, onAccion }: FilaProps) {
  const curso = cursoPorId(a.cursoId);
  const semana = semanaDe(a);

  if (compacta) {
    return (
      <div className="flex flex-col gap-[3px] border-t border-border pt-3">
        <p className="truncate text-[13px] font-semibold text-foreground">{a.nombre}</p>
        <p className="text-[12px] text-muted-foreground">
          {curso.nombre}
          {semana != null && ` · Semana ${semana}`}
        </p>
      </div>
    );
  }

  const propia = fechaPropiaTexto(a);
  const badges = badgesDe(a).map((b) => (
    <Badge key={b.texto} texto={b.texto} tono={b.tono} estilo={b.estilo} icono={b.icono} />
  ));

  return (
    <article className="grid gap-2 rounded-[6px] border border-border bg-card p-5 @[560px]:grid-cols-[1fr_auto] @[560px]:gap-x-4">
      <div className="flex flex-wrap gap-2 @[560px]:col-start-2 @[560px]:row-start-1 @[560px]:justify-end">{badges}</div>
      <div className="flex min-w-0 flex-col gap-2 @[560px]:col-start-1 @[560px]:row-span-2 @[560px]:row-start-1">
        <h3 className="truncate text-[16px] font-semibold text-foreground">{a.nombre}</h3>
        <p className="text-[13px] text-muted-foreground">
          {curso.nombre} · NRC {curso.nrc}
        </p>
        {(a.semanaOficial != null || propia) && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 pt-1 text-[13px] text-muted-foreground">
            {a.semanaOficial != null && (
              <span className="inline-flex items-center gap-2">
                <Icono nombre="calendario" />
                Semana {a.semanaOficial}
              </span>
            )}
            {propia && (
              <span className="inline-flex items-center gap-2 font-semibold text-state-neutral">
                <Icono nombre="clock" />
                {propia}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 @[560px]:col-start-2 @[560px]:row-start-2 @[560px]:self-end @[560px]:justify-self-end">
        <Boton variant="link" iconoInicio="calendario-mas" onClick={() => onAccion?.(a)}>
          {tieneFechaPropia(a) ? "Editar fecha" : "Agregar fecha"}
        </Boton>
      </div>
    </article>
  );
}
