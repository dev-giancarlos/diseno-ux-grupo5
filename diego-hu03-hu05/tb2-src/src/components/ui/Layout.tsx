import type { ElementType, ReactNode } from "react";

const GAPS = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-[3px]",
  4: "gap-1",
  6: "gap-[6px]",
  8: "gap-2",
  10: "gap-[10px]",
  12: "gap-3",
  14: "gap-[14px]",
  16: "gap-4",
  20: "gap-5",
  24: "gap-6",
} as const;
type Gap = keyof typeof GAPS;

const ALINEAR = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;
const JUSTIFICAR = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
} as const;

type StackProps = {
  children?: ReactNode;
  as?: ElementType;
  direccion?: "columna" | "fila";
  gap?: Gap;
  alinear?: keyof typeof ALINEAR;
  justificar?: keyof typeof JUSTIFICAR;
  envolver?: boolean;
  flexible?: boolean;
  minimo?: boolean;
  separador?: boolean;
  [dato: `data-${string}`]: string | undefined;
};

export function Stack({
  children,
  as: Tag = "div",
  direccion = "columna",
  gap = 0,
  alinear = "stretch",
  justificar = "start",
  envolver = false,
  flexible = false,
  minimo = false,
  separador = false,
  ...resto
}: StackProps) {
  const clases = [
    "flex",
    direccion === "columna" ? "flex-col" : "flex-row",
    GAPS[gap],
    ALINEAR[alinear],
    JUSTIFICAR[justificar],
    envolver ? "flex-wrap" : "",
    flexible ? "flex-1 min-w-0" : "",
    minimo ? "min-w-[150px] flex-1" : "",
    separador ? "border-t border-border pt-3" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag className={clases} {...resto}>
      {children}
    </Tag>
  );
}

const TEXTOS = {
  titulo: "text-[24px] font-semibold text-foreground",
  subtitulo: "text-[14px] text-muted-foreground",
  seccion: "text-[16px] font-semibold text-foreground",
  modal: "text-[20px] font-semibold text-foreground",
  cuerpo: "text-[13px] text-foreground",
  cuerpoFuerte: "text-[13px] font-semibold text-foreground",
  meta: "text-[13px] text-muted-foreground",
  metaFuerte: "text-[13px] font-semibold text-muted-foreground",
  nota: "text-[12px] text-muted-foreground",
  notaFuerte: "text-[13px] font-semibold text-foreground",
  centrado: "text-[13px] text-muted-foreground text-center",
  seccionCentrada: "text-[16px] font-semibold text-foreground text-center",
} as const;

type TextoProps = {
  children: ReactNode;
  variante?: keyof typeof TEXTOS;
  as?: ElementType;
  truncar?: boolean;
  id?: string;
};

export function Texto({ children, variante = "cuerpo", as: Tag = "p", truncar = false, id }: TextoProps) {
  return (
    <Tag id={id} className={`${TEXTOS[variante]} ${truncar ? "truncate" : ""}`}>
      {children}
    </Tag>
  );
}

type TarjetaProps = {
  children: ReactNode;
  discontinua?: boolean;
  relleno?: "normal" | "amplio";
  gap?: Gap;
  centrada?: boolean;
};

export function Tarjeta({ children, discontinua = false, relleno = "normal", gap = 0, centrada = false }: TarjetaProps) {
  return (
    <div
      className={[
        "flex flex-col rounded-[6px] border border-border",
        discontinua ? "border-dashed" : "bg-card",
        relleno === "normal" ? "p-5" : "px-8 py-12",
        GAPS[gap],
        centrada ? "items-center" : "items-stretch",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function Pagina({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-w-0 flex-1 flex-col gap-5 p-4 md:p-6" data-name="main-content">
      {children}
    </main>
  );
}

const ALTOS = { sm: "h-16", md: "h-28", lg: "h-44" } as const;

export function BloqueMarcador({ alto = "md" }: { alto?: keyof typeof ALTOS }) {
  return <div aria-hidden="true" className={`w-full rounded-[6px] bg-muted ${ALTOS[alto]}`} />;
}

export function Lista({ children }: { children: ReactNode }) {
  return <ul className="m-0 flex list-none flex-col gap-4 p-0">{children}</ul>;
}

export function ItemLista({ children }: { children: ReactNode }) {
  return <li className="@container">{children}</li>;
}
