import { useEffect, useLayoutEffect, useRef, type ReactNode, type Ref } from "react";
import Icono from "./Icono";
import { Stack } from "./Layout";

type Opcion = { valor: string; etiqueta: string };

type InputProps = {
  id: string;
  tipo?: "texto" | "selector" | "area" | "fecha" | "hora" | "busqueda" | "numero";
  estado?: "normal" | "bloqueado" | "error";
  valor: string;
  onCambio?: (valor: string) => void;
  marcador?: string;
  opciones?: Opcion[];
  compacto?: boolean;
  // Solo tipo "area": empieza en una línea y crece con el texto hasta MAX_LINEAS.
  autoCrecer?: boolean;
  descripcionId?: string;
  etiquetaAria?: string;
  refEntrada?: Ref<HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement>;
};

export default function Input({
  id,
  tipo = "texto",
  estado = "normal",
  valor,
  onCambio,
  marcador,
  opciones = [],
  compacto = false,
  autoCrecer = false,
  descripcionId,
  etiquetaAria,
  refEntrada,
}: InputProps) {
  const bloqueado = estado === "bloqueado";
  const alto = tipo === "area" ? (autoCrecer ? "h-10 py-[9px] leading-5" : "h-16 py-[10px]") : compacto ? "h-[38px]" : "h-10";
  const borde = estado === "error" ? "border-destructive" : "border-input";
  const fondo = bloqueado ? "bg-muted text-state-neutral" : tipo === "area" ? "bg-background text-foreground" : "bg-card text-foreground";
  const clases = `w-full rounded-[6px] border px-3 text-[13px] placeholder:text-muted-foreground ${alto} ${borde} ${fondo} focus:outline-none focus:border-ring focus:shadow-[inset_0_0_0_1px_var(--ring)]`;
  const comunes = {
    id,
    "aria-invalid": estado === "error" || undefined,
    "aria-describedby": descripcionId,
    "aria-label": etiquetaAria,
  };

  if (bloqueado) {
    const texto = tipo === "selector" ? (opciones.find((o) => o.valor === valor)?.etiqueta ?? valor) : valor;
    return <input {...comunes} ref={refEntrada} readOnly value={texto} className={clases} />;
  }

  if (tipo === "selector") {
    return (
      <div className="relative w-full">
        <select
          {...comunes}
          ref={refEntrada}
          value={valor}
          onChange={(e) => onCambio?.(e.target.value)}
          className={`${clases} cursor-pointer appearance-none pr-9 ${valor === "" ? "text-muted-foreground" : ""}`}
        >
          {marcador !== undefined && <option value="">{marcador}</option>}
          {opciones.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.etiqueta}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground">
          <Icono nombre="chevron-down" />
        </span>
      </div>
    );
  }

  if (tipo === "area" && autoCrecer) {
    return <AreaAutoCrece comunes={comunes} refEntrada={refEntrada} valor={valor} marcador={marcador} onCambio={onCambio} clases={clases} />;
  }

  if (tipo === "area") {
    return (
      <textarea
        {...comunes}
        ref={refEntrada}
        value={valor}
        placeholder={marcador}
        onChange={(e) => onCambio?.(e.target.value)}
        className={`${clases} resize-none`}
      />
    );
  }

  const tipoNativo = tipo === "fecha" ? "date" : tipo === "hora" ? "time" : tipo === "busqueda" ? "search" : tipo === "numero" ? "number" : "text";
  return (
    <input
      {...comunes}
      ref={refEntrada}
      type={tipoNativo}
      value={valor}
      placeholder={marcador}
      onChange={(e) => onCambio?.(e.target.value)}
      className={clases}
    />
  );
}

const MAX_LINEAS = 5;

type AreaAutoCreceProps = Pick<InputProps, "refEntrada" | "valor" | "marcador" | "onCambio"> & {
  comunes: Record<string, unknown>;
  clases: string;
};

// La altura se calcula con scrollHeight (y no con field-sizing) para que funcione en todos los navegadores.
function AreaAutoCrece({ comunes, refEntrada, valor, marcador, onCambio, clases }: AreaAutoCreceProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function ajustar() {
    const el = ref.current;
    // Dentro de un <dialog> todavía cerrado no hay medidas: se ajusta cuando se vuelve visible.
    if (!el || el.clientWidth === 0) return;
    const s = getComputedStyle(el);
    const bordes = parseFloat(s.borderTopWidth) + parseFloat(s.borderBottomWidth);
    const maximo = parseFloat(s.lineHeight) * MAX_LINEAS + parseFloat(s.paddingTop) + parseFloat(s.paddingBottom) + bordes;
    el.style.height = "auto";
    const alto = el.scrollHeight + bordes;
    el.style.height = `${Math.min(alto, maximo)}px`;
    el.style.overflowY = alto > maximo ? "auto" : "hidden";
  }

  useLayoutEffect(ajustar, [valor]);

  // Al abrir el modal o cambiar el ancho, el texto ocupa otras líneas. Solo se escucha el ancho:
  // reaccionar al alto que pone ajustar() volvería a disparar el observador.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ancho = -1;
    const observador = new ResizeObserver(([e]) => {
      if (e.contentRect.width === ancho) return;
      ancho = e.contentRect.width;
      requestAnimationFrame(ajustar);
    });
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <textarea
      {...comunes}
      ref={(el) => {
        ref.current = el;
        if (typeof refEntrada === "function") refEntrada(el as HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement);
        else if (refEntrada) refEntrada.current = el as HTMLInputElement & HTMLSelectElement & HTMLTextAreaElement;
      }}
      rows={1}
      value={valor}
      placeholder={marcador}
      onChange={(e) => onCambio?.(e.target.value)}
      className={`${clases} block resize-none overflow-y-hidden`}
    />
  );
}

type CampoTextoProps = {
  rol?: "etiqueta" | "descripcion" | "error";
  children: ReactNode;
  htmlFor?: string;
  id?: string;
};

export function CampoTexto({ rol = "etiqueta", children, htmlFor, id }: CampoTextoProps) {
  if (rol === "etiqueta") {
    return (
      <label htmlFor={htmlFor} className="text-[13px] font-semibold text-foreground">
        {children}
      </label>
    );
  }
  return (
    <p id={id} className={`text-[12px] ${rol === "error" ? "text-destructive" : "text-muted-foreground"}`}>
      {children}
    </p>
  );
}

type CampoProps = {
  id: string;
  etiqueta: string;
  descripcion?: string;
  error?: string;
  flexible?: boolean;
  children: ReactNode;
};

export function Campo({ id, etiqueta, descripcion, error, flexible = false, children }: CampoProps) {
  return (
    <Stack gap={6} minimo={flexible}>
      <CampoTexto htmlFor={id}>{etiqueta}</CampoTexto>
      {children}
      {descripcion && <CampoTexto rol="descripcion" id={`${id}-desc`}>{descripcion}</CampoTexto>}
      {error && <CampoTexto rol="error" id={`${id}-error`}>{error}</CampoTexto>}
    </Stack>
  );
}
