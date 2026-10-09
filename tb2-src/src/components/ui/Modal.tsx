import { useEffect, useRef, type ReactNode } from "react";
import Boton from "./Boton";
import { Stack, Texto } from "./Layout";

type ModalProps = {
  abierto: boolean;
  titulo: string;
  subtitulo: string;
  onCerrar: () => void;
  pie: ReactNode;
  children: ReactNode;
};

export default function Modal({ abierto, titulo, subtitulo, onCerrar, pie, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="modal-titulo"
      onCancel={(e) => {
        e.preventDefault();
        onCerrar();
      }}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[640px] overflow-y-auto rounded-[8px] border border-border bg-card p-0 text-foreground shadow-modal"
    >
      {abierto && (
        <div className="flex flex-col gap-5 px-5 py-6 sm:px-7">
          <Stack direccion="fila" justificar="between" alinear="start" gap={12}>
            <Stack gap={6} flexible>
              <Texto variante="modal" as="h2" id="modal-titulo">
                {titulo}
              </Texto>
              <Texto variante="meta">{subtitulo}</Texto>
            </Stack>
            <Boton variant="ghost" size="sm" iconoInicio="quitar" soloIcono etiqueta="Cerrar" onClick={onCerrar} />
          </Stack>
          {children}
          {pie}
        </div>
      )}
    </dialog>
  );
}

type PieProps = {
  etiquetaPrimaria: string;
  onCancelar: () => void;
  onConfirmar: () => void;
};

export function ModalPieAcciones({ etiquetaPrimaria, onCancelar, onConfirmar }: PieProps) {
  return (
    <div className="flex flex-col gap-[10px] sm:flex-row-reverse sm:justify-start sm:gap-3">
      <Boton anchoMovil onClick={onConfirmar}>
        {etiquetaPrimaria}
      </Boton>
      <Boton anchoMovil variant="secondary" onClick={onCancelar}>
        Cancelar
      </Boton>
    </div>
  );
}
