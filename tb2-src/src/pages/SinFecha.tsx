import { useState } from "react";
import { Boton, ChipFiltroDeCurso, EstadoVacio, Input, ItemLista, Lista, Pagina, Stack, Texto } from "@/components/ui";
import FilaActividad from "@/components/actividades/FilaActividad";
import { cursos, ordenar, sinFechaOficial, type Actividad } from "@/data";
import { hrefSinFecha } from "@/rutas";
import Encabezado from "./Encabezado";

type Props = {
  actividades: Actividad[];
  cursoFiltro: string | null;
  onAccion: (a: Actividad) => void;
  onAgregar: () => void;
  onPublicar: (a: Actividad) => void;
};

export default function SinFecha({ actividades, cursoFiltro, onAccion, onAgregar, onPublicar }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const todas = sinFechaOficial(actividades);
  const curso = cursos.find((c) => c.id === cursoFiltro) ?? null;
  const q = busqueda.trim().toLowerCase();
  const visibles = ordenar(
    todas.filter((a) => (!curso || a.cursoId === curso.id) && (!q || a.nombre.toLowerCase().includes(q))),
  );
  const irA = (id: string | null) => (window.location.hash = hrefSinFecha(id));
  const quitarFiltro = () => {
    setBusqueda("");
    irA(null);
  };

  return (
    <Pagina>
      <Encabezado
        titulo="Sin fecha oficial"
        subtitulo="Actividades de tus cursos con entrega o cierre cuya fecha oficial el curso todavía no publica."
        miga={
          <nav aria-label="Ruta" className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <a href="#/evaluaciones" className="rounded-[6px] font-semibold text-accent underline foco-anillo">
              Evaluaciones
            </a>
            <span aria-hidden="true">/</span>
            <span aria-current="page" className="font-semibold text-foreground">
              Sin fecha oficial
            </span>
          </nav>
        }
      />

      <Stack direccion="fila" gap={12} envolver alinear="center" justificar="between">
        <Stack direccion="fila" gap={12} envolver alinear="center">
        <div className="w-full sm:w-[360px]">
          <Input id="buscar" tipo="busqueda" compacto valor={busqueda} onCambio={setBusqueda} marcador="Buscar actividad" etiquetaAria="Buscar actividad" />
        </div>
        <div className="w-full sm:w-[220px]">
          <Input
            id="filtro-curso"
            tipo="selector"
            compacto
            valor={curso?.id ?? ""}
            marcador="Todos los cursos"
            opciones={cursos.map((c) => ({ valor: c.id, etiqueta: c.nombre }))}
            onCambio={(id) => irA(id || null)}
            etiquetaAria="Filtrar por curso"
          />
        </div>
        </Stack>
        <Boton variant="soft" anchoMovil onClick={onAgregar}>
          + Agregar actividad
        </Boton>
      </Stack>

      {curso && (
        <div>
          <ChipFiltroDeCurso etiqueta={curso.nombre} onQuitar={() => irA(null)} />
        </div>
      )}
      <Texto variante="meta">
          {visibles.length === 1 ? "1 actividad" : `${visibles.length} actividades`}
      </Texto>

      {visibles.length > 0 ? (
        <Lista>
          {visibles.map((a) => (
            <ItemLista key={a.id}>
              <FilaActividad actividad={a} onAccion={onAccion} onPublicar={onPublicar} />
            </ItemLista>
          ))}
        </Lista>
      ) : todas.length === 0 ? (
        <EstadoVacio
          icono="calendar-check"
          titulo="Todo tiene fecha oficial por ahora"
          texto="Si anunciaron una actividad en clase y no aparece en tu curso, puedes agregarla."
          accion={
            <Boton variant="soft" onClick={onAgregar}>
              + Agregar actividad
            </Boton>
          }
        />
      ) : (
        <EstadoVacio
          icono="filter-x"
          titulo="El filtro no deja ninguna actividad a la vista"
          texto="Hay actividades sin fecha oficial en otros cursos. Quita el filtro para verlas."
          accion={
            <Boton variant="soft" iconoInicio="filter-x" onClick={quitarFiltro}>
              Quitar filtro
            </Boton>
          }
        />
      )}
    </Pagina>
  );
}
