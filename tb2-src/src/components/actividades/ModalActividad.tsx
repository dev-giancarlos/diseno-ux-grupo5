import { useEffect, useRef, useState } from "react";
import { Alerta, Campo, Icono, Input, Interruptor, Modal, ModalPieAcciones, OpcionesTarjeta, SelectorFecha, Stack } from "@/components/ui";
import { cursoPorId, cursos, type Actividad } from "@/data";

// Una sola acción por fila: el tipo de fecha decide si la actividad sigue en Sin fecha oficial.
export type ModoModal = { modo: "crear" } | { modo: "completar"; actividad: Actividad };

type Props = {
  estado: ModoModal | null;
  onCerrar: () => void;
  onGuardar: (a: Actividad) => void;
};

type TipoFecha = "oficial" | "anunciada" | "estimada";
type Ref = HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;

const TIPOS: Record<TipoFecha, { titulo: string; descripcion: string }> = {
  oficial: { titulo: "Oficial", descripcion: "El docente la confirmó" },
  anunciada: { titulo: "Anunciada", descripcion: "El docente la mencionó" },
  estimada: { titulo: "Estimada", descripcion: "Es mi cálculo" },
};

const quitarFuente = (nota: string) => nota.replace(/^Fuente: .*$/m, "").trim();
const soloFecha = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

function valoresIniciales(e: ModoModal | null) {
  const a = e?.modo === "completar" ? e.actividad : null;
  return {
    curso: a?.cursoId ?? "",
    nombre: a?.nombre ?? "",
    tipoFecha: (a?.fuenteFecha ?? "anunciada") as TipoFecha,
    dia: a?.fechaAlumno ? soloFecha(a.fechaAlumno) : null,
    hora: a?.horaAlumno ?? "",
    semana: a?.semanaAlumno ?? null,
    calificada: a?.calificada ?? false,
    peso: a?.peso != null ? String(a.peso) : "",
    nota: a ? quitarFuente(a.nota) : "",
  };
}

export default function ModalActividad({ estado, onCerrar, onGuardar }: Props) {
  const [v, setV] = useState(() => valoresIniciales(estado));
  const [errores, setErrores] = useState<Record<string, string>>({});
  const refs = { nombre: useRef<Ref>(null), peso: useRef<Ref>(null) };

  useEffect(() => {
    setV(valoresIniciales(estado));
    setErrores({});
  }, [estado]);

  const completar = estado?.modo === "completar" ? estado.actividad : null;
  const oficial = v.tipoFecha === "oficial";
  // Al corregir un campo se borra su error (y el resumen se actualiza solo).
  const ERROR_DE: Partial<Record<keyof typeof v, string>> = { nombre: "nombre", dia: "cuando", semana: "cuando", tipoFecha: "cuando", peso: "peso", calificada: "peso" };
  const set = <K extends keyof typeof v>(k: K) => (valor: (typeof v)[K]) => {
    setV((p) => ({ ...p, [k]: valor }));
    const clave = ERROR_DE[k];
    if (clave) setErrores(({ [clave]: _, ...resto }) => resto);
  };

  const titulo = completar ? "Editar actividad" : "Agregar actividad";
  const tipos: TipoFecha[] = ["oficial", "anunciada", "estimada"];

  function guardar() {
    const e: Record<string, string> = {};
    if (!completar && !v.nombre.trim()) e.nombre = "Escribe el nombre";
    if (oficial && !v.dia) e.cuando = "Elige el día que confirmó el docente";
    else if (!v.dia && !v.semana) e.cuando = "Elige una semana o un día";
    else if (v.dia && v.dia < soloFecha(new Date())) e.cuando = "Elige una fecha futura";
    const peso = Number(v.peso);
    if (v.calificada && v.peso.trim() && !(peso > 0 && peso <= 100)) e.peso = "Escribe un porcentaje entre 1 y 100";
    setErrores(e);
    if (e.nombre || e.peso) {
      const primero = e.nombre ? refs.nombre : refs.peso;
      requestAnimationFrame(() => primero.current?.focus());
    }
    if (Object.keys(e).length) return;

    const [h, m] = /^\d{2}:\d{2}$/.test(v.hora) ? v.hora.split(":").map(Number) : [23, 59];
    const fecha = v.dia ? new Date(v.dia.getFullYear(), v.dia.getMonth(), v.dia.getDate(), h, m) : null;
    const comunes = { calificada: v.calificada, peso: v.calificada && v.peso.trim() ? peso : null, nota: v.nota.trim() };

    if (completar && oficial) {
      onGuardar({ ...completar, ...comunes, fechaOficial: fecha });
      return;
    }
    const fechaDatos = {
      ...comunes,
      fechaAlumno: fecha,
      horaAlumno: v.dia && v.hora ? v.hora : null,
      semanaAlumno: v.dia ? null : v.semana,
      // Una actividad creada como Oficial no se lista en Sin fecha oficial: su tipo de fecha propio no se muestra.
      fuenteFecha: v.tipoFecha === "oficial" ? "anunciada" : v.tipoFecha,
    };
    onGuardar(
      completar
        ? { ...completar, ...fechaDatos }
        : {
            id: `alumno-${Date.now()}`,
            cursoId: v.curso || cursos[0].id,
            nombre: v.nombre.trim(),
            fechaOficial: oficial ? fecha : null,
            ...fechaDatos,
          },
    );
  }

  const nErrores = Object.keys(errores).length;
  const opcionesCurso = cursos.map((c) => ({ valor: c.id, etiqueta: `${c.nombre} · NRC ${c.nrc}` }));

  return (
    <Modal
      abierto={estado != null}
      titulo={titulo}
      subtitulo={
        completar ? (
          <>
            <span className="font-semibold text-foreground">{completar.nombre}</span> · {cursoPorId(completar.cursoId).nombre}
          </>
        ) : (
          "Registra una actividad que anunciaron en clase y no aparece en tu curso."
        )
      }
      onCerrar={onCerrar}
      pie={
        <ModalPieAcciones
          etiquetaPrimaria={!completar ? "Agregar actividad" : oficial ? "Guardar fecha oficial" : "Guardar cambios"}
          onCancelar={onCerrar}
          onConfirmar={guardar}
        />
      }
    >
      <form
        noValidate
        onSubmit={(ev) => {
          ev.preventDefault();
          guardar();
        }}
        className="flex flex-col gap-5"
      >
        {nErrores > 0 && <Alerta tono="error" texto={nErrores === 1 ? "Revisa 1 dato" : `Revisa ${nErrores} datos`} />}

        {!completar && (
          <>
            <Campo id="m-curso" etiqueta="Curso">
              <Input id="m-curso" tipo="selector" valor={v.curso || cursos[0].id} opciones={opcionesCurso} onCambio={set("curso")} />
            </Campo>
            <Campo id="m-nombre" etiqueta="Nombre" error={errores.nombre}>
              <Input
                id="m-nombre"
                estado={errores.nombre ? "error" : "normal"}
                valor={v.nombre}
                marcador="Ej. Quiz de laboratorio"
                onCambio={set("nombre")}
                descripcionId={errores.nombre ? "m-nombre-error" : undefined}
                refEntrada={refs.nombre}
              />
            </Campo>
          </>
        )}

        <Stack gap={8}>
          <OpcionesTarjeta
            nombre="m-tipo-fecha"
            etiqueta="Tipo de fecha"
            opciones={tipos.map((t) => ({ valor: t, ...TIPOS[t] }))}
            valor={v.tipoFecha}
            onCambio={(t) => set("tipoFecha")(t as TipoFecha)}
          />
          {(completar || oficial) && (
            <p
              className={`flex items-center gap-2 rounded-[6px] px-3 py-[9px] text-[12px] ${
                oficial ? "bg-success-muted text-success-foreground" : "bg-background text-muted-foreground"
              }`}
            >
              <Icono nombre={oficial ? "success" : "info"} />
              {!oficial
                ? "Sigue en Sin fecha oficial, con tu fecha a la vista."
                : completar
                  ? `Al guardar, ${completar.nombre} sale de Sin fecha oficial.`
                  : "Con fecha oficial, la actividad no aparece en Sin fecha oficial."}
            </p>
          )}
        </Stack>

        <Stack gap={6}>
          <label htmlFor="m-cuando" className="text-[13px] font-semibold text-foreground">
            {oficial ? "Día y hora" : "¿Cuándo?"}
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0 sm:flex-[1.6]">
              <SelectorFecha
                id="m-cuando"
                semana={v.semana}
                dia={v.dia}
                soloDia={oficial}
                error={!!errores.cuando}
                descripcionId={errores.cuando ? "m-cuando-error" : "m-cuando-desc"}
                onSemana={set("semana")}
                onDia={set("dia")}
              />
            </div>
            {v.dia && (
              <div className="sm:flex-1">
                <Input id="m-hora" tipo="hora" valor={v.hora} onCambio={set("hora")} etiquetaAria="Hora" />
              </div>
            )}
          </div>
          {errores.cuando ? (
            <p id="m-cuando-error" className="text-[12px] text-destructive">
              {errores.cuando}
            </p>
          ) : (
            <p id="m-cuando-desc" className="text-[12px] text-muted-foreground">
              {oficial
                ? "Una fecha oficial siempre es un día exacto. La hora es opcional."
                : v.dia
                  ? "La hora es opcional."
                  : "Si sabes el día exacto, usa el calendario."}
            </p>
          )}
        </Stack>

        <Stack gap={6}>
          <div className="flex items-center justify-between gap-4 rounded-[6px] border border-border px-4 py-3">
            <div className="flex min-w-0 flex-col gap-[2px]">
              <label htmlFor="m-calificada" className="cursor-pointer text-[13px] font-semibold text-foreground">
                Es calificada
              </label>
              <p className="text-[12px] text-muted-foreground">{v.calificada ? "Peso en la nota final, si lo sabes" : "Suma a tu nota final"}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {v.calificada && (
                <div className="relative w-[92px]">
                  <Input
                    id="m-peso"
                    tipo="numero"
                    compacto
                    estado={errores.peso ? "error" : "normal"}
                    valor={v.peso}
                    marcador="Ej. 15"
                    onCambio={set("peso")}
                    etiquetaAria="Peso en la nota final, en porcentaje"
                    descripcionId={errores.peso ? "m-peso-error" : undefined}
                    refEntrada={refs.peso}
                  />
                  <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[13px] text-muted-foreground">
                    %
                  </span>
                </div>
              )}
              <Interruptor
                id="m-calificada"
                etiqueta="Es calificada"
                mostrarEtiqueta={false}
                activo={v.calificada}
                onCambio={set("calificada")}
              />
            </div>
          </div>
          {errores.peso && (
            <p id="m-peso-error" className="text-[12px] text-destructive">
              {errores.peso}
            </p>
          )}
        </Stack>

        <Campo id="m-nota" etiqueta="Comentarios (opcional)">
          <Input id="m-nota" tipo="area" autoCrecer valor={v.nota} marcador="Ej. Lo anunció en la clase del lunes" onCambio={set("nota")} />
        </Campo>
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
