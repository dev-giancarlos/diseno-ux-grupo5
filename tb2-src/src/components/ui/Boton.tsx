import type { ReactNode } from "react";
import Icono, { type IconoNombre } from "./Icono";

type Variante = "primary" | "secondary" | "soft" | "ghost" | "link";

const VARIANTES: Record<Variante, string> = {
  primary: "bg-accent-solid text-accent-foreground hover:bg-accent",
  secondary: "bg-card text-foreground border border-input hover:bg-background",
  soft: "bg-accent-muted text-accent border border-accent",
  ghost: "bg-accent-muted text-accent",
  link: "text-accent",
};

const TAMANOS = {
  sm: "h-8 text-[12px]",
  md: "h-10 text-[13px]",
} as const;

const RELLENO = { sm: "px-[10px]", md: "px-4" } as const;

type BotonProps = {
  children?: ReactNode;
  variant?: Variante;
  size?: "sm" | "md";
  iconoInicio?: IconoNombre;
  iconoFin?: boolean;
  soloIcono?: boolean;
  etiqueta?: string;
  href?: string;
  onClick?: () => void;
  ancho?: boolean;
  anchoMovil?: boolean;
  tactil?: boolean;
  plano?: boolean;
  aviso?: boolean;
  subrayado?: boolean;
  type?: "button" | "submit";
};

export default function Boton({
  children,
  variant = "primary",
  size = "md",
  iconoInicio,
  iconoFin = false,
  soloIcono = false,
  etiqueta,
  href,
  onClick,
  ancho = false,
  anchoMovil = false,
  tactil = false,
  plano = false,
  aviso = false,
  subrayado = false,
  type = "button",
}: BotonProps) {
  const sinCaja = variant === "link" || plano;
  // Dentro de un aviso, el enlace toma el color del tono del aviso.
  const colorVariante = aviso ? "text-inherit" : VARIANTES[variant];
  const clases = [
    "inline-flex items-center justify-center gap-[6px] rounded-[6px] font-semibold whitespace-nowrap cursor-pointer no-underline foco-anillo",
    TAMANOS[size],
    sinCaja ? "" : soloIcono ? (size === "sm" ? "w-8 px-0" : "w-10 px-0") : RELLENO[size],
    plano ? "bg-transparent text-accent border border-transparent hover:bg-accent-muted hover:border-accent px-2" : colorVariante,
    variant === "link" ? "px-0" : "",
    subrayado ? "underline" : "",
    ancho ? "w-full" : "",
    anchoMovil ? "w-full sm:w-auto" : "",
    tactil ? "min-h-[44px]" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const contenido = (
    <>
      {iconoInicio && <Icono nombre={iconoInicio} />}
      {!soloIcono && children}
      {iconoFin && <Icono nombre="chevron-right" />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={clases} aria-label={etiqueta} onClick={onClick}>
        {contenido}
      </a>
    );
  }
  return (
    <button type={type} className={clases} aria-label={etiqueta} onClick={onClick}>
      {contenido}
    </button>
  );
}
