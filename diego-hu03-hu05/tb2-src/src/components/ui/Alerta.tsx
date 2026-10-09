import { useEffect, useState } from "react";
import Boton from "./Boton";
import Icono from "./Icono";

type Tono = "warn" | "error" | "success";

const TONOS: Record<Tono, { caja: string; icono: "warn" | "error" | "success" }> = {
  warn: { caja: "bg-warning-muted border-warning text-warning-foreground", icono: "warn" },
  error: { caja: "bg-destructive-muted border-destructive text-destructive", icono: "error" },
  success: { caja: "bg-success-muted border-success text-success-foreground", icono: "success" },
};

// Un enlace (href) o un botón (onClick); con ambos, es un enlace que además ejecuta onClick.
export type AccionAlerta = { etiqueta: string; href?: string; onClick?: () => void };

type AlertaProps = {
  tono?: Tono;
  texto: string;
  accion?: AccionAlerta;
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
        <Boton variant="link" href={accion.href} onClick={accion.onClick} aviso subrayado iconoFin={!!accion.href}>
          {accion.etiqueta}
        </Boton>
      )}
    </div>
  );
}

export type AvisoToast = { id: number; texto: string; accion?: AccionAlerta };

const DURACION = 4500;
const DURACION_CON_ACCION = 8000;

export function Toast({ aviso, onCerrar }: { aviso: AvisoToast | null; onCerrar: () => void }) {
  if (!aviso) return null;
  return <ToastActivo key={aviso.id} aviso={aviso} onCerrar={onCerrar} />;
}

// Con una acción, el aviso dura más y no se cierra mientras el cursor o el foco estén encima (WCAG 2.2.1).
function ToastActivo({ aviso, onCerrar }: { aviso: AvisoToast; onCerrar: () => void }) {
  const [encima, setEncima] = useState(false);
  const [enfocado, setEnfocado] = useState(false);
  const pausado = !!aviso.accion && (encima || enfocado);

  useEffect(() => {
    if (pausado) return;
    const t = window.setTimeout(onCerrar, aviso.accion ? DURACION_CON_ACCION : DURACION);
    return () => window.clearTimeout(t);
  }, [pausado, aviso, onCerrar]);

  return (
    <div
      className="fixed right-4 bottom-4 left-4 z-50 sm:left-auto sm:w-[286px]"
      onMouseEnter={() => setEncima(true)}
      onMouseLeave={() => setEncima(false)}
      onFocus={() => setEnfocado(true)}
      onBlur={() => setEnfocado(false)}
    >
      <Alerta tono="success" texto={aviso.texto} accion={aviso.accion} />
    </div>
  );
}
