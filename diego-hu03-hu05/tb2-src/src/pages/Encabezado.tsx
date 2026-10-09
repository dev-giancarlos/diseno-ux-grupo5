import type { ReactNode } from "react";
import { Stack, Texto } from "@/components/ui";

export default function Encabezado({ titulo, subtitulo, miga, accion }: { titulo: string; subtitulo?: string; miga?: ReactNode; accion?: ReactNode }) {
  return (
    <Stack gap={8}>
      {miga}
      <Stack direccion="fila" justificar="between" alinear="end" gap={16} envolver>
        <Stack gap={8} flexible>
          <Texto variante="titulo" as="h1">
            {titulo}
          </Texto>
          {subtitulo && <Texto variante="subtitulo">{subtitulo}</Texto>}
        </Stack>
        {accion}
      </Stack>
    </Stack>
  );
}
