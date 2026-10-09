import Icono, { type IconoNombre } from "./Icono";

type Tono = "neutral" | "warn" | "success" | "accent";
type Estilo = "relleno" | "contorno";

const RELLENO: Record<Tono, string> = {
  neutral: "bg-muted text-state-neutral",
  warn: "bg-warning-muted text-warning-foreground",
  success: "bg-success-muted text-success-foreground",
  accent: "bg-accent-muted text-accent",
};
const CONTORNO: Record<Tono, string> = {
  neutral: "border border-state-neutral text-state-neutral",
  warn: "border border-warning text-warning-foreground",
  success: "border border-success text-success-foreground",
  accent: "border border-accent text-accent",
};
const TAMANOS = {
  sm: "px-2 py-1 text-[11px]",
  md: "px-[10px] py-[6px] text-[12px]",
} as const;

type BadgeProps = {
  texto: string;
  tono?: Tono;
  estilo?: Estilo;
  size?: "sm" | "md";
  icono?: IconoNombre;
};

export default function Badge({ texto, tono = "neutral", estilo = "relleno", size = "md", icono }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold whitespace-nowrap ${TAMANOS[size]} ${
        estilo === "relleno" ? RELLENO[tono] : CONTORNO[tono]
      }`}
    >
      {icono && <Icono nombre={icono} size="sm" />}
      {texto}
    </span>
  );
}

const CONTEO = {
  solido: "bg-primary text-primary-foreground",
  suave: "bg-accent-muted text-accent",
  neutro: "bg-muted text-muted-foreground",
} as const;

export function BadgeConteo({ numero, tono = "solido", size = "md" }: { numero: number; tono?: "solido" | "suave" | "neutro"; size?: "sm" | "md" }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-semibold ${
        size === "md" ? "min-w-[26px] px-2 py-[3px] text-[14px]" : "min-w-5 px-[7px] py-[3px] text-[11px]"
      } ${CONTEO[tono]}`}
    >
      {numero}
    </span>
  );
}
