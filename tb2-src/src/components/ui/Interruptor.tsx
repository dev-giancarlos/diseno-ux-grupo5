// Interruptor (switch) del sistema: mismo trazo que el Switch de las pantallas de Giancarlos (40×22, accent-solid).
type InterruptorProps = {
  id: string;
  etiqueta: string;
  activo: boolean;
  onCambio: (activo: boolean) => void;
};

export default function Interruptor({ id, etiqueta, activo, onCambio }: InterruptorProps) {
  return (
    <div className="flex items-center gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={activo}
        onClick={() => onCambio(!activo)}
        className={`relative inline-flex h-[22px] w-10 shrink-0 cursor-pointer items-center rounded-[11px] p-[2px] foco-anillo ${
          activo ? "justify-end bg-accent-solid" : "justify-start bg-state-neutral-solid"
        }`}
      >
        <span aria-hidden="true" className="size-[18px] rounded-[9px] bg-card" />
      </button>
      <label htmlFor={id} className="cursor-pointer text-[13px] font-semibold text-foreground">
        {etiqueta}
      </label>
    </div>
  );
}
