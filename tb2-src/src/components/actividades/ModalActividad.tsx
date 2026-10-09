import { useEffect, useRef, useState } from "react";
import { Alerta, Campo, Input, Interruptor, Modal, ModalPieAcciones, Stack } from "@/components/ui";
import { combinarFecha, cursos, semanas, tieneFechaPropia, type Actividad } from "@/data";

// "oficial": la alumna confirma la fecha oficial que anunció el docente; la actividad sale de Sin fecha oficial.
export type ModoModal = { modo: "crear" } | { modo: "completar" | "oficial"; actividad: Actividad };

type Props = {
  estado: ModoModal | null;
  onCerrar: () => void;
  onGuardar: (a: Actividad) => void;
};

type Ref = HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;
const FUENTES = { anunciada: "El docente la dijo en clase", estimada: "Es una estimación mía" } as const;
const dos = (n: number) => String(n).padStart(2, "0");
const aISO = (d: Date) => `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
const quitarFuente = (nota: string) => nota.replace(/^Fuente: .*$/m, "").trim();

function valoresIniciales(e: ModoModal | null) {
  const a = e && e.modo !== "crear" ? e.actividad : null;
  return {
    curso: a?.cursoId ?? "",
    nombre: a?.nombre ?? "",
    precision: e?.modo !== "oficial" && a?.semanaAlumno != null ? "semana" : "dia",
    fecha: a?.fechaAlumno ? aISO(a.fechaAlumno) : "",
    hora: a?.horaAlumno ?? "",
    semana: a?.semanaAlumno != null ? String(a.semanaAlumno) : "",
    calificada: a?.calificada ?? false,
    peso: a?.peso != null ? String(a.peso) : "",
    fuente: (a?.fuenteFecha ?? "anunciada") as keyof typeof FUENTES,
    nota: a ? quitarFuente(a.nota) : "",
  };
}

export default function ModalActividad({ estado, onCerrar, onGuardar }: Props) {
  const [v, setV] = useState(() => valoresIniciales(estado));
  const [errores, setErrores] = useState<Record<string, string>>({});
  const refs = { nombre: useRef<Ref>(null), fecha: useRef<Ref>(null), semana: useRef<Ref>(null), peso: useRef<Ref>(null) };

  useEffect(() => {
    setV(valoresIniciales(estado));
    setErrores({});
  }, [estado]);

  const completar = estado && estado.modo !== "crear" ? estado.actividad : null;
  const oficial = estado?.modo === "oficial";
  const delDocente = completar?.origen === "docente";
  const conSemana = !oficial && v.precision === "semana";
  const set = (k: Exclude<keyof typeof v, "calificada">) => (valor: string) => setV((p) => ({ ...p, [k]: valor }));

  const titulo = oficial ? "Confirmar fecha" : !completar ? "Agregar actividad" : tieneFechaPropia(completar) ? "Editar fecha" : "Agregar fecha";
  const descripcionBloqueo = delDocente ? "Viene de tu curso, no se puede editar" : "La registraste tú; aquí solo cambias la fecha";

  function guardar() {
    const e: Record<string, string> = {};
    if (!completar && !v.nombre.trim()) e.nombre = "Escribe el nombre";
    const fecha = combinarFecha(v.fecha, v.hora);
    if (conSemana) {
      if (!v.semana) e.semana = "Elige una semana del ciclo";
    } else if (!fecha || fecha.getTime() <= Date.now()) {
      e.fecha = "Elige una fecha futura";
    }
    const peso = Number(v.peso);
    if (!oficial && v.calificada && v.peso.trim() && !(peso > 0 && peso <= 100)) e.peso = "Escribe un porcentaje entre 1 y 100";
    setErrores(e);
    const primero = (["nombre", "fecha", "semana", "peso"] as const).find((k) => e[k]);
    if (primero) {
      requestAnimationFrame(() => refs[primero].current?.focus());
      return;
    }
    if (oficial && completar) {
      onGuardar({ ...completar, fechaOficial: fecha });
      return;
    }

    const notaBase = v.nota.trim();
    const nota = delDocente ? [`Fuente: ${FUENTES[v.fuente]}`, notaBase].filter(Boolean).join("\n") : notaBase;
    const fechaDatos = {
      fechaAlumno: conSemana ? null : fecha,
      horaAlumno: conSemana ? null : v.hora || null,
      semanaAlumno: conSemana ? Number(v.semana) : null,
      fuenteFecha: delDocente ? v.fuente : null,
      calificada: v.calificada,
      peso: v.calificada && v.peso.trim() ? peso : null,
      nota,
    };
    onGuardar(
      completar
        ? { ...completar, ...fechaDatos }
        : {
            id: `alumno-${Date.now()}`,
            cursoId: v.curso || cursos[0].id,
            nombre: v.nombre.trim(),
            origen: "alumno",
            semanaOficial: null,
            fechaOficial: null,
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
        oficial
          ? "Usa la fecha que anunció el docente. La actividad sale de Sin fecha oficial."
          : completar
          ? "Esta actividad ya está en tu lista. Solo falta la fecha."
          : "Registra una actividad que anunciaron en clase y no aparece en tu curso."
      }
      onCerrar={onCerrar}
      pie={
        <ModalPieAcciones
          etiquetaPrimaria={oficial ? "Confirmar fecha" : completar ? "Guardar fecha" : "Agregar actividad"}
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

        <Campo id="m-curso" etiqueta="Curso" descripcion={completar ? descripcionBloqueo : undefined}>
          <Input
            id="m-curso"
            tipo="selector"
            estado={completar ? "bloqueado" : "normal"}
            valor={completar ? `${completar.cursoId}` : v.curso || cursos[0].id}
            opciones={opcionesCurso}
            onCambio={set("curso")}
            descripcionId={completar ? "m-curso-desc" : undefined}
          />
        </Campo>

        <Campo id="m-nombre" etiqueta="Nombre de la actividad" error={errores.nombre}>
          <Input
            id="m-nombre"
            estado={completar ? "bloqueado" : errores.nombre ? "error" : "normal"}
            valor={v.nombre}
            marcador="Escribe el nombre de la actividad"
            onCambio={set("nombre")}
            descripcionId={errores.nombre ? "m-nombre-error" : undefined}
            refEntrada={refs.nombre}
          />
        </Campo>

        {!oficial && (
        <Campo id="m-precision" etiqueta="¿Sabes el día exacto?" descripcion='Si solo te dijeron la semana, elige "Solo sé la semana"'>
          <Input
            id="m-precision"
            tipo="selector"
            valor={v.precision}
            opciones={[
              { valor: "dia", etiqueta: "Sí, sé el día" },
              { valor: "semana", etiqueta: "Solo sé la semana" },
            ]}
            onCambio={(p) => {
              set("precision")(p);
              setErrores({});
            }}
            descripcionId="m-precision-desc"
          />
        </Campo>
        )}

        <div className="flex flex-wrap items-start gap-4">
          {conSemana ? (
            <Campo flexible id="m-semana" etiqueta="Semana" error={errores.semana}>
              <Input
                id="m-semana"
                tipo="selector"
                estado={errores.semana ? "error" : "normal"}
                valor={v.semana}
                marcador="Elige"
                opciones={semanas.map((s) => ({ valor: String(s), etiqueta: `Semana ${s}` }))}
                onCambio={set("semana")}
                descripcionId={errores.semana ? "m-semana-error" : undefined}
                refEntrada={refs.semana}
              />
            </Campo>
          ) : (
            <>
              <Campo flexible id="m-fecha" etiqueta="Fecha" error={errores.fecha}>
                <Input
                  id="m-fecha"
                  tipo="fecha"
                  estado={errores.fecha ? "error" : "normal"}
                  valor={v.fecha}
                  onCambio={set("fecha")}
                  descripcionId={errores.fecha ? "m-fecha-error" : undefined}
                  refEntrada={refs.fecha}
                />
              </Campo>
              <Campo flexible id="m-hora" etiqueta="Hora" descripcion="Si la mencionaron">
                <Input id="m-hora" tipo="hora" valor={v.hora} onCambio={set("hora")} descripcionId="m-hora-desc" />
              </Campo>
            </>
          )}
        </div>

        {!oficial && (
          <Stack gap={12}>
            <Interruptor
              id="m-calificada"
              etiqueta="Es calificada"
              activo={v.calificada}
              onCambio={(activo) => setV((p) => ({ ...p, calificada: activo }))}
            />
            {v.calificada && (
              <div className="w-full sm:w-[220px]">
                <Campo id="m-peso" etiqueta="Peso en la nota final (%)" descripcion="Opcional, si lo sabes" error={errores.peso}>
                  <Input
                    id="m-peso"
                    tipo="numero"
                    estado={errores.peso ? "error" : "normal"}
                    valor={v.peso}
                    marcador="Ej. 15"
                    onCambio={set("peso")}
                    descripcionId={errores.peso ? "m-peso-error" : "m-peso-desc"}
                    refEntrada={refs.peso}
                  />
                </Campo>
              </div>
            )}
          </Stack>
        )}

        {delDocente && !oficial && (
          <Campo id="m-fuente" etiqueta="De dónde sale esta fecha" descripcion='Se guarda en la nota. La lista la marca como "Fecha anotada por ti"'>
            <Input
              id="m-fuente"
              tipo="selector"
              valor={v.fuente}
              opciones={Object.entries(FUENTES).map(([valor, etiqueta]) => ({ valor, etiqueta }))}
              onCambio={set("fuente")}
              descripcionId="m-fuente-desc"
            />
          </Campo>
        )}

        {!oficial && (
        <Stack>
          <Campo id="m-nota" etiqueta="Nota" descripcion="Dónde lo anunciaron">
            <Input id="m-nota" tipo="area" valor={v.nota} onCambio={set("nota")} descripcionId="m-nota-desc" />
          </Campo>
        </Stack>
        )}
        <button type="submit" hidden />
      </form>
    </Modal>
  );
}
