import { Alerta, BloqueMarcador, Icono, Pagina, Stack, Texto } from "@/components/ui";
import { cursoPorId, cursos, sinFechaOficial, type Actividad } from "@/data";
import { hrefSinFecha } from "@/rutas";
import Encabezado from "./Encabezado";

export default function Cursos() {
  return (
    <Pagina>
      <Encabezado titulo="Cursos" />
      <div className="grid gap-4 sm:grid-cols-2">
        {cursos.map((c) => (
          <a
            key={c.id}
            href={`#/cursos/${c.id}`}
            className="flex items-center justify-between gap-3 rounded-[6px] border border-border bg-card p-5 text-foreground no-underline hover:border-input foco-anillo"
          >
            <Stack gap={4}>
              <Texto variante="cuerpoFuerte">{c.nombre}</Texto>
              <Texto variante="meta">NRC {c.nrc}</Texto>
            </Stack>
            <Icono nombre="chevron-right" />
          </a>
        ))}
      </div>
    </Pagina>
  );
}

export function Curso({ id, actividades }: { id: string; actividades: Actividad[] }) {
  const curso = cursos.find((c) => c.id === id);
  if (!curso) return <Cursos />;
  const n = sinFechaOficial(actividades).filter((a) => a.cursoId === id).length;
  return (
    <Pagina>
      <Encabezado
        titulo={cursoPorId(id).nombre}
        subtitulo={`NRC ${curso.nrc}`}
        miga={
          <a href="#/cursos" className="self-start rounded-[6px] text-[13px] text-muted-foreground underline foco-anillo">
            Cursos
          </a>
        }
      />
      {n > 0 && (
        <Alerta
          texto={n === 1 ? "1 actividad de este curso no tiene fecha oficial" : `${n} actividades de este curso no tienen fecha oficial`}
          accion={{ etiqueta: "Ver", href: hrefSinFecha(id) }}
        />
      )}
      <BloqueMarcador alto="lg" />
      <BloqueMarcador alto="md" />
    </Pagina>
  );
}
