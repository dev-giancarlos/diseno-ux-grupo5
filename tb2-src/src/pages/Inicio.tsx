import { BadgeConteo, Icono, BloqueMarcador, Boton, EstadoVacio, Pagina, Stack, Tarjeta, Texto } from "@/components/ui";
import FilaActividad from "@/components/actividades/FilaActividad";
import { ordenar, sinFechaOficial, type Actividad } from "@/data";
import { hrefSinFecha } from "@/rutas";
import Encabezado from "./Encabezado";

export default function Inicio({ actividades, onAgregar }: { actividades: Actividad[]; onAgregar: () => void }) {
  const lista = ordenar(sinFechaOficial(actividades));
  return (
    <Pagina>
      <Encabezado titulo="Inicio" subtitulo="Hola, Yulissa" />
      <div className="grid items-start gap-5 lg:grid-cols-[2fr_1fr]">
        <Stack gap={20}>
          <BloqueMarcador alto="lg" />
          <BloqueMarcador alto="md" />
        </Stack>
        <div className="w-full max-w-[360px]"><Tarjeta gap={14}>
          <Stack direccion="fila" justificar="between" alinear="center" gap={8}>
            <Stack direccion="fila" alinear="center" gap={8}>
              <Icono nombre="calendario" size="md" />
              <Texto variante="seccion" as="h2">
                Actividades sin fecha oficial
              </Texto>
            </Stack>
            <BadgeConteo numero={lista.length} />
          </Stack>
          {lista.length > 0 ? (
            <>
              <div>
                {lista.slice(0, 2).map((a) => (
                  <FilaActividad key={a.id} actividad={a} compacta />
                ))}
              </div>
              <div className="flex justify-end">
                <Boton variant="link" href={hrefSinFecha()} subrayado iconoFin>
                  Ver todas
                </Boton>
              </div>
            </>
          ) : (
            <EstadoVacio
              icono="calendar-check"
              titulo="Todo tiene fecha oficial por ahora"
              texto="Si anunciaron una actividad en clase y no aparece en tu curso, puedes agregarla."
              accion={
                <Boton variant="soft" iconoInicio="calendario-mas" onClick={onAgregar}>
                  Agregar actividad
                </Boton>
              }
            />
          )}
        </Tarjeta></div>
      </div>
    </Pagina>
  );
}
