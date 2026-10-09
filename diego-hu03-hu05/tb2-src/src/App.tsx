import { useCallback, useEffect, useRef, useState } from "react";
import { Shell, Toast, type AccionAlerta, type AvisoToast } from "@/components/ui";
import { backend } from "@/backend";
import ModalActividad, { type ModoModal } from "@/components/actividades/ModalActividad";
import { actividadesIniciales, formatoFecha, type Actividad } from "@/data";
import { esSinFecha, hrefSinFecha, leerHash, menu } from "@/rutas";
import ActividadesRuben from "@/pages/ruben/ActividadesRuben";
import CalendarioRuben from "@/pages/ruben/CalendarioRuben";
import Cursos, { Curso } from "@/pages/Cursos";
import Evaluaciones from "@/pages/Evaluaciones";
import Inicio from "@/pages/Inicio";
import Marcador from "@/pages/Marcador";
import SinFecha from "@/pages/SinFecha";

export default function App() {
  const [ubicacion, setUbicacion] = useState(leerHash);
  const [actividades, setActividades] = useState<Actividad[]>(actividadesIniciales);
  const [modal, setModal] = useState<ModoModal | null>(null);
  const [toast, setToast] = useState<AvisoToast | null>(null);
  const idToast = useRef(0);
  // Actividad que acaba de entrar a una lista oficial: su fila se resalta unos segundos.
  const [resaltado, setResaltado] = useState<string | null>(null);
  // Pantalla desde la que se llegó a Sin fecha oficial: decide a dónde lleva una fecha oficial.
  const origen = useRef("actividades");

  useEffect(() => {
    const alCambiar = () => {
      setUbicacion(leerHash());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", alCambiar);
    return () => window.removeEventListener("hashchange", alCambiar);
  }, []);

  useEffect(() => {
    if (!esSinFecha(ubicacion)) origen.current = ubicacion.segmentos[0] ?? "inicio";
  }, [ubicacion]);

  useEffect(() => {
    if (!resaltado) return;
    const llevar = window.setTimeout(() => document.querySelector(".fila-resaltada")?.scrollIntoView({ block: "center", behavior: "smooth" }), 80);
    const quitar = window.setTimeout(() => setResaltado(null), 4500);
    return () => {
      window.clearTimeout(llevar);
      window.clearTimeout(quitar);
    };
  }, [resaltado, ubicacion]);

  const abrirCrear = () => setModal({ modo: "crear" });
  const abrirCompletar = (actividad: Actividad) => setModal({ modo: "completar", actividad });

  const cerrarToast = useCallback(() => setToast(null), []);

  function guardar(a: Actividad) {
    const anterior = actividades;
    const creada = modal?.modo === "crear";
    setActividades((lista) => (lista.some((x) => x.id === a.id) ? lista.map((x) => (x.id === a.id ? a : x)) : [...lista, a]));
    setModal(null);
    if (a.fechaOficial) {
      // Con fecha oficial entra a la lista oficial. Desde Evaluaciones solo se navega si es calificada,
      // para no llevar a una pantalla que no tiene que ver; desde cualquier otra, a Actividades.
      const desde = esSinFecha(ubicacion) ? origen.current : (ubicacion.segmentos[0] ?? "inicio");
      const destino = desde === "evaluaciones" ? (a.calificada ? "#/evaluaciones" : null) : "#/actividades";
      if (destino) {
        setResaltado(a.id);
        window.location.hash = destino;
      }
      const fecha = formatoFecha(a.fechaOficial);
      const texto = creada
        ? `${a.nombre} tiene fecha oficial: ${fecha}. No aparece en Sin fecha oficial`
        : `${a.nombre} ya tiene fecha oficial: ${fecha}. Salió de Sin fecha oficial`;
      mostrarToast(texto, {
        etiqueta: "Deshacer",
        onClick: () => {
          setResaltado(null);
          setActividades(anterior);
          mostrarToast("Cambio deshecho");
        },
      });
    } else if (creada) {
      // En Sin fecha oficial la actividad nueva ya se ve en la lista: "Ver" no llevaría a ningún lado.
      mostrarToast(`${a.nombre} quedó en Sin fecha oficial`, esSinFecha(ubicacion) ? undefined : { etiqueta: "Ver", href: hrefSinFecha(), onClick: cerrarToast });
    } else mostrarToast("Actividad agregada a tus pendientes");
  }

  function mostrarToast(texto: string, accion?: AccionAlerta) {
    setToast({ id: ++idToast.current, texto, accion });
  }

  const [seccion = "inicio", sub] = ubicacion.segmentos;
  const sinFecha = esSinFecha(ubicacion);
  const item = menu.find((m) => m.id === (sinFecha ? "actividades" : seccion));

  let pagina;
  if (seccion === "inicio") pagina = <Inicio actividades={actividades} onAgregar={abrirCrear} />;
  else if (seccion === "cursos") pagina = sub ? <Curso id={sub} actividades={actividades} /> : <Cursos />;
  else if (sinFecha)
    pagina = (
      <SinFecha actividades={actividades} cursoFiltro={ubicacion.query.get("curso")} soloEvaluaciones={ubicacion.query.get("solo") === "evaluaciones"} onAccion={abrirCompletar} onAgregar={abrirCrear} />
    );
  else if (seccion === "actividades") pagina = <ActividadesRuben actividades={actividades} onAgregar={abrirCrear} resaltado={resaltado} />;
  else if (seccion === "calendario") pagina = <CalendarioRuben />;
  else if (seccion === "evaluaciones") pagina = <Evaluaciones actividades={actividades} resaltado={resaltado} />;
  else pagina = <Marcador titulo={item?.etiqueta ?? "Página no encontrada"} />;

  return (
    <Shell items={menu} activo={item?.id ?? ""} usuario={backend.usuario}>
      {pagina}
      <ModalActividad estado={modal} onCerrar={() => setModal(null)} onGuardar={guardar} />
      <Toast aviso={toast} onCerrar={cerrarToast} />
    </Shell>
  );
}
