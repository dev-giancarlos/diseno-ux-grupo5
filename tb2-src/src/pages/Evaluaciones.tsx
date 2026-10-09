import { Alerta, BloqueMarcador, Pagina } from "@/components/ui";
import { sinFechaOficial, type Actividad } from "@/data";
import { hrefSinFecha } from "@/rutas";
import Encabezado from "./Encabezado";

export default function Evaluaciones({ actividades }: { actividades: Actividad[] }) {
  const n = sinFechaOficial(actividades).length;
  return (
    <Pagina>
      <Encabezado titulo="Evaluaciones" />
      {n > 0 && (
        <Alerta
          tono="warn"
          texto={n === 1 ? "1 actividad de tus cursos no tiene fecha oficial" : `${n} actividades de tus cursos no tienen fecha oficial`}
          accion={{ etiqueta: "Ver", href: hrefSinFecha() }}
        />
      )}
      <BloqueMarcador alto="sm" />
      <BloqueMarcador alto="lg" />
      <BloqueMarcador alto="md" />
    </Pagina>
  );
}
