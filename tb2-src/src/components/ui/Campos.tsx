import type { ReactNode, Ref } from "react";
import Icono from "./Icono";
import { Stack } from "./Layout";

type Opcion = { valor: string; etiqueta: string };

type InputProps = {
  id: string;
  tipo?: "texto" | "selector" | "area" | "fecha" | "hora" | "busqueda";
  estado?: "normal" | "bloqueado" | "error";
  valor: string;
  onCambio?: (valor: string) => void;
  marcador?: string;
  opciones?: Opcion[];
  compacto?: boolean;
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
  descripcionId,
  etiquetaAria,
  refEntrada,
}: InputProps) {
  const bloqueado = estado === "bloqueado";
  const alto = tipo === "area" ? "h-16 py-[10px]" : compacto ? "h-[38px]" : "h-10";
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

  const tipoNativo = tipo === "fecha" ? "date" : tipo === "hora" ? "time" : tipo === "busqueda" ? "search" : "text";
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
