import { Badge, Boton, Icono } from "@/components/ui";
import { cursoPorId, fechaAlumnoTexto, semanaDe, semanaDeFecha, type Actividad } from "@/data";

type FilaProps = {
  actividad: Actividad;
  compacta?: boolean;
  onAccion?: (a: Actividad) => void;
};

// Mismas palabras que las tarjetas de "Tipo de fecha" del modal.
const TIPOS = {
  anunciada: { icono: "anunciada", texto: "Anunciada" },
  estimada: { icono: "estimada", texto: "Estimada" },
} as const;

function cercania(a: Actividad) {
  const hoy = semanaDeFecha(new Date());
  const semana = semanaDe(a);
  if (hoy == null || semana == null) return null;
  if (semana === hoy) return "Esta semana";
  if (semana === hoy + 1) return "Próxima semana";
  return null;
}

// Fila única para lista, tarjeta de Inicio, escritorio y móvil (C8, C11).
export default function FilaActividad({ actividad: a, compacta = false, onAccion }: FilaProps) {
  const curso = cursoPorId(a.cursoId);
  const fecha = fechaAlumnoTexto(a);

  if (compacta) {
    return (
      <div className="flex flex-col gap-[3px] border-t border-border pt-3">
        <p className="truncate text-[13px] font-semibold text-foreground">{a.nombre}</p>
        <p className="text-[12px] text-muted-foreground">
          {curso.nombre} · {fecha}
        </p>
      </div>
    );
  }

  const tipo = a.fuenteFecha ? TIPOS[a.fuenteFecha] : null;
  const proxima = cercania(a);

  return (
    <article className="flex flex-col gap-3 rounded-[6px] border border-border bg-card p-5 @[560px]:flex-row @[560px]:items-start @[560px]:justify-between @[560px]:gap-4">
      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="truncate text-[16px] font-semibold text-foreground">{a.nombre}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground">
          <span className="inline-flex flex-wrap items-center gap-x-[6px]">
            {curso.nombre}
            {a.origen === "curso" && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 whitespace-nowrap text-accent">
                  <Icono nombre="cursos" size="sm" />
                  Del curso
                </span>
              </>
            )}
          </span>
          {a.calificada && <Badge texto={a.peso != null ? `Calificada · ${a.peso}%` : "Calificada"} icono="calificaciones" />}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-start gap-1 @[560px]:items-end">
        {/* La fecha no se parte: si no entra, la etiqueta de cercanía queda en su propia línea. */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted-foreground @[560px]:justify-end">
          {proxima && <Badge texto={proxima} tono="warn" />}
          {tipo ? (
            <span className="inline-flex items-center gap-[6px] whitespace-nowrap">
              <Icono nombre={tipo.icono} />
              <span className="font-semibold text-foreground">{fecha}</span>· {tipo.texto}
            </span>
          ) : (
            <span className="inline-flex items-center gap-[6px] whitespace-nowrap">
              <Icono nombre="clock" />
              {fecha}
            </span>
          )}
        </div>
        <Boton variant="link" iconoInicio="editar" etiqueta={`Editar ${a.nombre}`} onClick={() => onAccion?.(a)}>
          Editar
        </Boton>
      </div>
    </article>
  );
}
