import { useEffect, useRef, useState } from "react";
import { Shell, Toast } from "@/components/ui";
import ModalActividad, { type ModoModal } from "@/components/actividades/ModalActividad";
import { actividadesIniciales, fechaPublicada, formatoFecha, type Actividad } from "@/data";
import { leerHash, menu } from "@/rutas";
import Actividades from "@/pages/Actividades";
import Cursos, { Curso } from "@/pages/Cursos";
import Evaluaciones from "@/pages/Evaluaciones";
import Inicio from "@/pages/Inicio";
import Marcador from "@/pages/Marcador";
import SinFecha from "@/pages/SinFecha";

const USUARIO = { nombre: "Yulissa Terán", rol: "Estudiante", iniciales: "YT" };

export default function App() {
  const [ubicacion, setUbicacion] = useState(leerHash);
  const [actividades, setActividades] = useState<Actividad[]>(actividadesIniciales);
  const [modal, setModal] = useState<ModoModal | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const temporizador = useRef<number>(undefined);

  useEffect(() => {
    const alCambiar = () => {
      setUbicacion(leerHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", alCambiar);
    return () => window.removeEventListener("hashchange", alCambiar);
  }, []);

  const abrirCrear = () => setModal({ modo: "crear" });
  const abrirCompletar = (actividad: Actividad) => setModal({ modo: "completar", actividad });

  function guardar(a: Actividad) {
    setActividades((lista) => (lista.some((x) => x.id === a.id) ? lista.map((x) => (x.id === a.id ? a : x)) : [...lista, a]));
    setModal(null);
    mostrarToast("Actividad agregada a tus pendientes");
  }

  // Demo: el curso publica la fecha oficial; la actividad sale de Sin fecha oficial.
  function publicar(a: Actividad) {
    const fecha = fechaPublicada(a);
    setActividades((lista) => lista.map((x) => (x.id === a.id ? { ...x, fechaOficial: fecha } : x)));
    mostrarToast(`El curso publicó la fecha de ${a.nombre}: ${formatoFecha(fecha)}`);
  }

  function mostrarToast(texto: string) {
    setToast(texto);
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setToast(null), 4500);
  }

  const [seccion = "inicio", sub] = ubicacion.segmentos;
  const item = menu.find((m) => m.id === seccion);

  let pagina;
  if (seccion === "inicio") pagina = <Inicio actividades={actividades} onAgregar={abrirCrear} />;
  else if (seccion === "cursos") pagina = sub ? <Curso id={sub} actividades={actividades} /> : <Cursos />;
  else if (seccion === "actividades") pagina = <Actividades actividades={actividades} onAgregar={abrirCrear} />;
  else if (seccion === "evaluaciones" && sub === "sin-fecha")
    pagina = (
      <SinFecha actividades={actividades} cursoFiltro={ubicacion.query.get("curso")} onAccion={abrirCompletar} onAgregar={abrirCrear} onPublicar={publicar} />
    );
  else if (seccion === "evaluaciones") pagina = <Evaluaciones actividades={actividades} />;
  else pagina = <Marcador titulo={item?.etiqueta ?? "Página no encontrada"} />;

  return (
    <Shell items={menu} activo={item?.id ?? ""} usuario={USUARIO}>
      {pagina}
      <ModalActividad estado={modal} onCerrar={() => setModal(null)} onGuardar={guardar} />
      <Toast texto={toast} />
    </Shell>
  );
}
