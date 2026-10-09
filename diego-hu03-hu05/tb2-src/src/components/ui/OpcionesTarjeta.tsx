// Opciones excluyentes que se ven todas a la vez (radio), cada una con su explicación corta.
// En escritorio van en columnas; en móvil, una por fila con la explicación a la derecha.
type Opcion = { valor: string; titulo: string; descripcion: string };

type OpcionesTarjetaProps = {
  nombre: string;
  etiqueta: string;
  opciones: Opcion[];
  valor: string;
  onCambio: (valor: string) => void;
};

const COLUMNAS = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" } as const;

export default function OpcionesTarjeta({ nombre, etiqueta, opciones, valor, onCambio }: OpcionesTarjetaProps) {
  return (
    <fieldset className="m-0 flex min-w-0 flex-col gap-2 border-0 p-0">
      <legend className="mb-2 p-0 text-[13px] font-semibold text-foreground">{etiqueta}</legend>
      <div className={`grid grid-cols-1 gap-2 ${COLUMNAS[opciones.length as 2 | 3] ?? ""}`}>
        {opciones.map((o) => {
          const activa = o.valor === valor;
          return (
            <label
              key={o.valor}
              className={`flex cursor-pointer items-center justify-between gap-x-3 gap-y-[2px] rounded-[6px] border px-3 py-[10px] has-[:focus-visible]:shadow-[0_0_0_2px_var(--card),0_0_0_4px_var(--ring)] sm:flex-col sm:items-start sm:justify-start ${
                activa ? "border-accent-solid bg-accent-muted shadow-[inset_0_0_0_0.5px_var(--accent-solid)]" : "border-border bg-card hover:border-input"
              }`}
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name={nombre}
                  value={o.valor}
                  checked={activa}
                  onChange={() => onCambio(o.valor)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={`inline-grid size-[14px] place-items-center rounded-full border-[1.5px] ${activa ? "border-accent-solid" : "border-input"}`}
                >
                  {activa && <span className="size-[6px] rounded-full bg-accent-solid" />}
                </span>
                <span className={`text-[13px] font-semibold ${activa ? "text-accent" : "text-foreground"}`}>{o.titulo}</span>
              </span>
              <span className="text-[12px] text-muted-foreground sm:pl-[22px]">{o.descripcion}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
