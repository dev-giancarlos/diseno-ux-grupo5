import Icono from "./Icono";

export default function ChipFiltroDeCurso({ etiqueta, onQuitar }: { etiqueta: string; onQuitar: () => void }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-accent-muted py-[6px] pr-2 pl-[10px] text-[12px] font-normal text-accent">
      {etiqueta}
      <button
        type="button"
        onClick={onQuitar}
        aria-label={`Quitar filtro: ${etiqueta}`}
        className="inline-flex cursor-pointer items-center justify-center rounded-full text-accent foco-anillo"
      >
        <Icono nombre="quitar" size="sm" />
      </button>
    </span>
  );
}
