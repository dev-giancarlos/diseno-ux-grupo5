import { useCallback, useEffect, useRef, useState } from "react";
import { Shell, Toast, type AccionAlerta, type AvisoToast } from "@/components/ui";
import ModalActividad, { type ModoModal } from "@/components/actividades/ModalActividad";
import { actividadesIniciales, formatoFecha, type Actividad } from "@/data";
import { hrefSinFecha, leerHash, menu } from "@/rutas";
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
  const [toast, setToast] = useState<AvisoToast | null>(null);
  const idToast = useRef(0);

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

  const cerrarToast = useCallback(() => setToast(null), []);

  function guardar(a: Actividad) {
    const anterior = actividades;
    const creada = modal?.modo === "crear";
    setActividades((lista) => (lista.some((x) => x.id === a.id) ? lista.map((x) => (x.id === a.id ? a : x)) : [...lista, a]));
    setModal(null);
    if (a.fechaOficial) {
      mostrarToast(`${a.nombre} ya tiene fecha oficial: ${formatoFecha(a.fechaOficial)}. Salió de Sin fecha oficial`, {
        etiqueta: "Deshacer",
        onClick: () => {
          setActividades(anterior);
          mostrarToast("Cambio deshecho");
        },
      });
    } else if (creada) {
      // En Sin fecha oficial la actividad nueva ya se ve en la lista: "Ver" no llevaría a ningún lado.
      const enSinFecha = ubicacion.segmentos.join("/") === "evaluaciones/sin-fecha";
      mostrarToast(`${a.nombre} quedó en Sin fecha oficial`, enSinFecha ? undefined : { etiqueta: "Ver", href: hrefSinFecha(), onClick: cerrarToast });
    } else mostrarToast("Actividad agregada a tus pendientes");
  }

  function mostrarToast(texto: string, accion?: AccionAlerta) {
    setToast({ id: ++idToast.current, texto, accion });
  }

  const [seccion = "inicio", sub] = ubicacion.segmentos;
  const item = menu.find((m) => m.id === seccion);

  let pagina;
  if (seccion === "inicio") pagina = <Inicio actividades={actividades} onAgregar={abrirCrear} />;
  else if (seccion === "cursos") pagina = sub ? <Curso id={sub} actividades={actividades} /> : <Cursos />;
  else if (seccion === "actividades") pagina = <Actividades actividades={actividades} onAgregar={abrirCrear} />;
  else if (seccion === "evaluaciones" && sub === "sin-fecha")
    pagina = (
      <SinFecha actividades={actividades} cursoFiltro={ubicacion.query.get("curso")} soloEvaluaciones={ubicacion.query.get("solo") === "evaluaciones"} onAccion={abrirCompletar} onAgregar={abrirCrear} />
    );
  else if (seccion === "evaluaciones") pagina = <Evaluaciones actividades={actividades} />;
  else pagina = <Marcador titulo={item?.etiqueta ?? "Página no encontrada"} />;

  return (
    <Shell items={menu} activo={item?.id ?? ""} usuario={USUARIO}>
      {pagina}
      <ModalActividad estado={modal} onCerrar={() => setModal(null)} onGuardar={guardar} />
      <Toast aviso={toast} onCerrar={cerrarToast} />
    </Shell>
  );
}
