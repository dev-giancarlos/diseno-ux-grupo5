import Boton from "./Boton";
import Icono from "./Icono";

type Tono = "warn" | "error" | "success";

const TONOS: Record<Tono, { caja: string; icono: "warn" | "error" | "success" }> = {
  warn: { caja: "bg-warning-muted border-warning text-warning-foreground", icono: "warn" },
  error: { caja: "bg-destructive-muted border-destructive text-destructive", icono: "error" },
  success: { caja: "bg-success-muted border-success text-success-foreground", icono: "success" },
};

type AlertaProps = {
  tono?: Tono;
  texto: string;
  accion?: { etiqueta: string; href: string };
};

export default function Alerta({ tono = "warn", texto, accion }: AlertaProps) {
  const { caja, icono } = TONOS[tono];
  return (
    <div
      role={tono === "error" ? "alert" : "status"}
      className={`flex w-full items-center gap-[10px] rounded-[6px] border px-3 py-[11px] text-[13px] ${caja}`}
    >
      <Icono nombre={icono} />
      <p className="min-w-0 flex-1">{texto}</p>
      {accion && (
        <Boton variant="link" href={accion.href} aviso subrayado iconoFin>
          {accion.etiqueta}
        </Boton>
      )}
    </div>
  );
}

export function Toast({ texto }: { texto: string | null }) {
  if (!texto) return null;
  return (
    <div className="fixed right-4 bottom-4 left-4 z-50 sm:left-auto sm:w-[286px]">
      <Alerta tono="success" texto={texto} />
    </div>
  );
}
