// Campo "¿Cuándo?": una semana del ciclo (lista) o un día exacto (calendario), en un solo control.
// Con soloDia (fecha oficial) solo se elige un día. El panel se abre debajo del campo, dentro del flujo,
// para que no lo recorte el modal en pantallas chicas.
import { useEffect, useRef, useState } from "react";
import { diaCorto, HOY, inicioSemana, INICIO_CICLO, rangoSemana, semanaDeFecha, semanas } from "@/data";
import Icono from "./Icono";

type SelectorFechaProps = {
  id: string;
  semana: number | null;
  dia: Date | null;
  soloDia?: boolean;
  error?: boolean;
  descripcionId?: string;
  onSemana: (n: number | null) => void;
  onDia: (d: Date | null) => void;
};

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS_SEMANA = ["L", "M", "M", "J", "V", "S", "D"];
const soloFecha = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const mismoDia = (a: Date, b: Date) => a.getTime() === b.getTime();
const FIN_CICLO = (() => {
  const d = inicioSemana(semanas.length);
  d.setDate(d.getDate() + 6);
  return d;
})();

// Lunes de la semana (calendario de lunes a domingo).
function lunes(d: Date) {
  const r = soloFecha(d);
  r.setDate(r.getDate() - ((r.getDay() + 6) % 7));
  return r;
}

export default function SelectorFecha({ id, semana, dia, soloDia = false, error = false, descripcionId, onSemana, onDia }: SelectorFechaProps) {
  const [abierto, setAbierto] = useState<null | "semanas" | "calendario">(null);
  const hoy = soloFecha(HOY);
  const semanaHoy = semanaDeFecha(hoy);
  const base = dia ?? (semana ? inicioSemana(semana) : hoy < INICIO_CICLO ? INICIO_CICLO : hoy);
  const [mes, setMes] = useState(() => new Date(base.getFullYear(), base.getMonth(), 1));
  const caja = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => !caja.current?.contains(e.target as Node) && setAbierto(null);
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Cierra solo el panel, no el modal que lo contiene.
        e.preventDefault();
        e.stopPropagation();
        setAbierto(null);
      }
    };
    document.addEventListener("mousedown", fuera);
    caja.current?.addEventListener("keydown", tecla);
    const nodo = caja.current;
    return () => {
      document.removeEventListener("mousedown", fuera);
      nodo?.removeEventListener("keydown", tecla);
    };
  }, [abierto]);

  useEffect(() => {
    if (abierto === "semanas") lista.current?.querySelector<HTMLElement>("[aria-selected=true], [data-actual]")?.scrollIntoView({ block: "center" });
    if (abierto === "calendario") setMes(new Date(base.getFullYear(), base.getMonth(), 1));
    // Solo al abrir: la base de ese momento decide el mes que se muestra.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [abierto]);

  const elegirDia = (d: Date) => {
    onDia(d);
    onSemana(semanaDeFecha(d));
    setAbierto(null);
  };
  const elegirSemana = (n: number) => {
    onSemana(n);
    onDia(null);
    setAbierto(null);
  };
  const alternar = (panel: "semanas" | "calendario") => setAbierto((a) => (a === panel ? null : panel));

  // Celdas del mes: semanas completas de lunes a domingo.
  const ultimo = new Date(mes.getFullYear(), mes.getMonth() + 1, 0);
  const filas: Date[][] = [];
  for (let ini = lunes(mes); ini <= ultimo; ini = new Date(ini.getFullYear(), ini.getMonth(), ini.getDate() + 7)) {
    filas.push(Array.from({ length: 7 }, (_, i) => new Date(ini.getFullYear(), ini.getMonth(), ini.getDate() + i)));
  }
  const puedeAtras = new Date(mes.getFullYear(), mes.getMonth() - 1, 1) >= new Date(INICIO_CICLO.getFullYear(), INICIO_CICLO.getMonth(), 1);
  const puedeAdelante = new Date(mes.getFullYear(), mes.getMonth() + 1, 1) <= FIN_CICLO;
  const elegible = (d: Date) => d >= hoy && d >= INICIO_CICLO && d <= FIN_CICLO;
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  const marco = `flex h-10 overflow-hidden rounded-[6px] border bg-card ${
    error ? "border-destructive" : abierto ? "border-ring shadow-[0_0_0_3px_color-mix(in_srgb,var(--ring)_15%,transparent)]" : "border-input"
  }`;

  return (
    <div ref={caja} className="flex flex-col gap-2">
      <div className={marco}>
        {dia ? (
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-muted py-[3px] pr-1 pl-[10px] text-[13px] font-semibold text-accent">
              {diaCorto(dia)}
              <button
                type="button"
                aria-label="Quitar el día"
                onClick={() => onDia(null)}
                className="inline-grid size-5 cursor-pointer place-items-center rounded-full hover:bg-card foco-anillo"
              >
                <Icono nombre="quitar" size="sm" />
              </button>
            </span>
            {semanaDeFecha(dia) && <span className="ml-auto truncate text-[12px] text-muted-foreground">Semana {semanaDeFecha(dia)}</span>}
          </div>
        ) : (
          <button
            id={id}
            type="button"
            aria-haspopup={soloDia ? "dialog" : "listbox"}
            aria-expanded={abierto != null}
            aria-describedby={descripcionId}
            aria-invalid={error || undefined}
            onClick={() => alternar(soloDia ? "calendario" : "semanas")}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-3 text-left text-[13px] focus:outline-none"
          >
            {semana && !soloDia ? (
              <>
                <span className="text-foreground">Semana {semana}</span>
                <span className="ml-auto truncate text-[12px] text-muted-foreground">{rangoSemana(semana)}</span>
              </>
            ) : (
              <span className="flex-1 text-muted-foreground">{soloDia ? "Elige el día" : "Elige una semana"}</span>
            )}
            {!soloDia && <Icono nombre="chevron-down" />}
          </button>
        )}
        <button
          type="button"
          aria-label="Elegir un día en el calendario"
          title="Elegir un día en el calendario"
          aria-expanded={abierto === "calendario"}
          onClick={() => alternar("calendario")}
          className={`inline-grid w-11 shrink-0 cursor-pointer place-items-center border-l border-border text-accent foco-anillo ${
            dia || abierto === "calendario" ? "bg-accent-muted" : "hover:bg-background"
          }`}
        >
          <Icono nombre="calendario" />
        </button>
      </div>

      {abierto === "semanas" && (
        <ul
          ref={lista}
          role="listbox"
          aria-label="Semanas del ciclo"
          className="m-0 max-h-[264px] list-none overflow-y-auto rounded-[6px] border border-border bg-card p-1 shadow-toast"
        >
          {semanas.map((n) => {
            const pasada = semanaHoy != null && n < semanaHoy;
            const elegida = n === semana;
            return (
              <li key={n} role="option" aria-selected={elegida} aria-disabled={pasada} data-actual={n === semanaHoy || undefined}>
                <button
                  type="button"
                  disabled={pasada}
                  onClick={() => elegirSemana(n)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-[6px] px-3 py-2 text-left text-[13px] foco-anillo disabled:cursor-default disabled:opacity-45 ${
                    elegida ? "bg-accent-muted font-semibold text-accent" : "text-foreground enabled:hover:bg-background"
                  }`}
                >
                  Semana {n}
                  {n === semanaHoy ? (
                    <span className="rounded-full bg-accent-muted px-2 py-[2px] text-[11px] font-semibold text-accent">Esta semana</span>
                  ) : (
                    <span className={`text-[12px] ${elegida ? "text-accent" : "text-muted-foreground"}`}>{rangoSemana(n)}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {abierto === "calendario" && (
        <div role="dialog" aria-label="Calendario" className="rounded-[6px] border border-border bg-card p-3 shadow-toast sm:max-w-[340px]">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[14px] font-semibold text-foreground">
              {MESES[mes.getMonth()][0].toUpperCase() + MESES[mes.getMonth()].slice(1)} {mes.getFullYear()}
            </p>
            <div className="flex gap-1">
              <button
                type="button"
                aria-label="Mes anterior"
                disabled={!puedeAtras}
                onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}
                className="inline-grid size-8 cursor-pointer place-items-center rounded-[6px] text-muted-foreground enabled:hover:bg-background disabled:opacity-35 foco-anillo"
              >
                <Icono nombre="chevron-izquierda" />
              </button>
              <button
                type="button"
                aria-label="Mes siguiente"
                disabled={!puedeAdelante}
                onClick={() => setMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}
                className="inline-grid size-8 cursor-pointer place-items-center rounded-[6px] text-muted-foreground enabled:hover:bg-background disabled:opacity-35 foco-anillo"
              >
                <Icono nombre="chevron-right" />
              </button>
            </div>
          </div>
          <div role="grid" className="grid grid-cols-[30px_repeat(7,1fr)] gap-[2px] text-center">
            <span aria-hidden="true" />
            {DIAS_SEMANA.map((d, i) => (
              <span key={i} aria-hidden="true" className="py-1 text-[11px] font-medium text-muted-foreground">
                {d}
              </span>
            ))}
            {filas.map((fila) => {
              const n = semanaDeFecha(fila[0]);
              const resaltada = !dia && n != null && n === semana;
              return [
                <span
                  key={`s${fila[0].getTime()}`}
                  className={`grid place-items-center text-[10.5px] font-semibold ${resaltada ? "text-accent" : "text-muted-foreground"}`}
                >
                  {n ? `S${n}` : ""}
                </span>,
                ...fila.map((d) => {
                  const fuera = d.getMonth() !== mes.getMonth();
                  const sel = dia != null && mismoDia(d, soloFecha(dia));
                  const esHoy = mismoDia(d, hoy);
                  return (
                    <button
                      key={d.getTime()}
                      type="button"
                      disabled={!elegible(d)}
                      aria-pressed={sel}
                      aria-label={`${diaCorto(d)}${esHoy ? ", hoy" : ""}`}
                      onClick={() => elegirDia(d)}
                      className={`h-9 cursor-pointer rounded-[6px] text-[13px] foco-anillo disabled:cursor-default ${
                        sel
                          ? "bg-accent-solid font-semibold text-accent-foreground"
                          : `${resaltada ? "bg-accent-muted" : ""} ${fuera ? "text-muted-foreground/50" : "text-foreground"} enabled:hover:bg-background disabled:text-muted-foreground/35`
                      } ${esHoy && !sel ? "shadow-[inset_0_0_0_1px_var(--accent-solid)]" : ""}`}
                    >
                      {d.getDate()}
                    </button>
                  );
                }),
              ];
            })}
          </div>
          <div className="mt-3 flex gap-2 border-t border-border pt-3">
            {[
              { texto: "Hoy", d: hoy },
              { texto: "Mañana", d: manana },
            ]
              .filter((r) => elegible(r.d))
              .map((r) => (
                <button
                  key={r.texto}
                  type="button"
                  onClick={() => elegirDia(r.d)}
                  className="cursor-pointer rounded-full border border-border px-3 py-1 text-[12px] text-muted-foreground hover:border-input hover:text-foreground foco-anillo"
                >
                  {r.texto}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
