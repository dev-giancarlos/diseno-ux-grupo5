import { BloqueMarcador, Pagina } from "@/components/ui";
import Encabezado from "./Encabezado";

// Pantalla en blanco: se puebla reemplazando este componente en App.tsx.
export default function Marcador({ titulo }: { titulo: string }) {
  return (
    <Pagina>
      <Encabezado titulo={titulo} />
      <BloqueMarcador alto="sm" />
      <div className="grid gap-5 lg:grid-cols-2">
        <BloqueMarcador alto="lg" />
        <BloqueMarcador alto="lg" />
      </div>
      <BloqueMarcador alto="md" />
    </Pagina>
  );
}
