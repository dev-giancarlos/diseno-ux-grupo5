import type { ReactNode } from "react";
import Icono, { type IconoNombre } from "./Icono";

type EstadoVacioProps = { icono: IconoNombre; titulo: string; texto?: string; accion: ReactNode };

export default function EstadoVacio({ icono, titulo, texto, accion }: EstadoVacioProps) {
  return (
    <div className="flex flex-col items-center gap-[14px] rounded-[6px] border border-dashed border-border px-8 py-12 text-center">
      <span className="text-muted-foreground">
        <Icono nombre={icono} size="lg" />
      </span>
      <h2 className="text-[16px] font-semibold text-foreground">{titulo}</h2>
      {texto && <p className="text-[13px] text-muted-foreground">{texto}</p>}
      {accion}
    </div>
  );
}
