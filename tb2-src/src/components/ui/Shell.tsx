import { useState, type ReactNode } from "react";
import AvatarIniciales from "./Avatar";
import Icono, { type IconoNombre } from "./Icono";

type Item = { id: string; etiqueta: string; icono: IconoNombre; href: string };

type ShellProps = {
  items: Item[];
  activo: string;
  usuario: { nombre: string; rol: string; iniciales: string };
  children: ReactNode;
};

export default function Shell({ items, activo, usuario, children }: ShellProps) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="flex min-h-full flex-col md:flex-row">
      <header className="flex items-center justify-between bg-primary px-4 py-3 md:hidden">
        <img src="assets/logo-upc-blanco.svg" alt="UPC" className="h-8 w-auto" />
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="sidebar"
          aria-label="Menú"
          className="inline-flex size-10 cursor-pointer items-center justify-center rounded-[6px] text-sidebar-foreground foco-anillo"
        >
          <Icono nombre="menu" />
        </button>
      </header>
      <aside
        id="sidebar"
        className={`${abierto ? "flex" : "hidden"} w-full shrink-0 flex-col gap-6 bg-primary p-4 md:sticky md:top-0 md:flex md:h-dvh md:w-[200px]`}
        data-name="sidebar"
      >
        <div className="hidden justify-center md:flex">
          <img src="assets/logo-upc-blanco.svg" alt="UPC" className="size-[50px]" />
        </div>
        <nav aria-label="Principal" className="flex-1">
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {items.map((it) => {
              const esActivo = it.id === activo;
              return (
                <li key={it.id}>
                  <a
                    href={it.href}
                    onClick={() => setAbierto(false)}
                    aria-current={esActivo ? "page" : undefined}
                    className={`relative flex h-10 items-center gap-3 px-3 text-[13px] no-underline foco-anillo ${
                      esActivo
                        ? "bg-sidebar-active font-semibold text-sidebar-foreground before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-sidebar-foreground"
                        : "rounded-[6px] font-normal text-sidebar-muted"
                    }`}
                  >
                    <Icono nombre={it.icono} />
                    {it.etiqueta}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <AvatarIniciales iniciales={usuario.iniciales} />
          <div className="flex min-w-0 flex-col gap-[2px]">
            <p className="truncate text-[13px] font-semibold text-primary-foreground">{usuario.nombre}</p>
            <p className="text-[12px] text-sidebar-muted">{usuario.rol}</p>
          </div>
        </div>
      </aside>
      {children}
    </div>
  );
}
