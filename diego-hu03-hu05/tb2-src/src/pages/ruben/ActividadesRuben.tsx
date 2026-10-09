// Pantalla de Rubén (HU-01 · Actividades), copiada de ruben-hu01-hu09/src/App.tsx con su lógica.
// Cambios: usa el sidebar de la app; "Agregar actividad" abre el modal de HU-03 y la línea de
// Sin fecha oficial cuenta las actividades reales (D1).
import { useState } from "react"
import { cursos, HU01_GRUPOS, sinFechaOficial, type Actividad } from "@/data"
import { hrefSinFecha } from "@/rutas"
import "./estilos-ruben.css"

// Íconos de Rubén (ruben-hu01-hu09/public/assets), copiados a public/assets/ruben.
const icons = {
  chevron: "assets/ruben/b761c.svg",
  addCalendar: "assets/ruben/dc6c6.svg",
  calendarMd: "assets/ruben/b9ad6.svg",
  success: "assets/ruben/3c6a9.svg",
  activitySuccess: "assets/ruben/b9c4f.svg",
  syncChevron: "assets/ruben/befcd.svg",
  apple: "assets/ruben/edd02.svg",
}

type ActivityFilter = "all" | "week" | "overdue"

type Activity = {
  urgency: string
  title: string
  date: string
  course: string
  weight: string | null
  tone: string
}

// Los datos vienen del backend (backend.pendientes), agrupados como en su app.
const activityGroups: { title: string; range: string; activities: Activity[] }[] = HU01_GRUPOS.map((g) => ({
  title: g.titulo,
  range: g.rango,
  activities: g.actividades.map((a) => ({
    urgency: a.plazo,
    title: a.titulo,
    date: a.fecha,
    course: a.curso.nombre,
    weight: a.peso,
    tone: a.curso.tono,
  })),
}))
const totalPendientes = activityGroups.reduce((n, g) => n + g.activities.length, 0)

function ActivityRow({ activity }: { activity: Activity }) {
  return (
    <article className="activity-row">
      <div className="activity-name">
        <span
          className={activity.urgency.startsWith("Vence hoy") ? "urgent" : ""}
        >
          {activity.urgency}
        </span>
        <strong>{activity.title}</strong>
      </div>
      <time>{activity.date}</time>
      <span className={`course-badge ${activity.tone}`}>{activity.course}</span>
      <div className="weight">
        <strong>{activity.weight ?? "Sin peso"}</strong>
        <small>{activity.weight ? "nota final" : "en la nota"}</small>
      </div>
      <button className="outline-button small" type="button">
        Ver actividad
      </button>
    </article>
  )
}

export default function ActividadesRuben({ actividades, onAgregar }: { actividades: Actividad[]; onAgregar: () => void }) {
  const n = sinFechaOficial(actividades).length
  const [filter, setFilter] = useState<ActivityFilter>("all")
  const [course, setCourse] = useState("Todos los cursos")
  const groups =
    filter === "week"
      ? activityGroups.slice(1, 2)
      : filter === "overdue"
        ? []
        : activityGroups
  const visibleCount = groups.reduce(
    (count, group) => count + group.activities.length,
    0,
  )

  return (
    <div className="ruben">
    <main className="content">
      <section className="page-heading activities-heading">
        <div>
          <h1>Actividades</h1>
          <p>
            Lista unificada de tareas y evaluaciones pendientes de todos tus
            cursos inscritos
          </p>
        </div>
        <div className="heading-actions">
          <button className="primary-button" type="button" onClick={onAgregar}>
            {/* Mismo ícono que el botón "Agregar actividad" de la app TB2 (lucide calendar-plus). */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M16 18h6" />
              <path d="M16 2v3" />
              <path d="M19 15v6" />
              <path d="M21 11.5V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8.3" />
              <path d="M3 9h18" />
              <path d="M8 2v3" />
            </svg>
            Agregar actividad
          </button>
        </div>
      </section>

      <section className="page-body">
        <div className="info-banner">
          <img src={icons.activitySuccess} alt="" />
          Vista unificada activa: Estás viendo las actividades pendientes
          integradas de tus {cursos.length} cursos matriculados.
        </div>

        <div className="section-title">
          <h2>Todas mis actividades pendientes</h2>
          <span className="count-badge">{totalPendientes}</span>
        </div>
        {n > 0 && (
          <p className="sin-fecha-linea">
            {n === 1 ? "No incluye 1 actividad que aún no tiene fecha oficial." : `No incluye ${n} actividades que aún no tienen fecha oficial.`}
            <a href={hrefSinFecha()}>
              Ver <img src={icons.chevron} alt="" />
            </a>
          </p>
        )}

        <div className="filters">
          <label>
            <span className="sr-only">Curso</span>
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
            >
              <option>Todos los cursos</option>
              {cursos.map((c) => (
                <option key={c.id}>{c.nombre}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Orden</span>
            <select defaultValue="Proximidad">
              <option value="Proximidad">
                Ordenar por: Proximidad de vencimiento
              </option>
              <option>Ordenar por: Curso</option>
              <option>Ordenar por: Peso académico</option>
            </select>
          </label>
        </div>

        <div
          className="tabs"
          role="tablist"
          aria-label="Filtros de actividades"
        >
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
            role="tab"
            type="button"
          >
            Todos los pendientes ({totalPendientes})
          </button>
          <button
            className={filter === "week" ? "active" : ""}
            onClick={() => setFilter("week")}
            role="tab"
            type="button"
          >
            Por entregar esta semana ({activityGroups[1].activities.length})
          </button>
          <button
            className={filter === "overdue" ? "active" : ""}
            onClick={() => setFilter("overdue")}
            role="tab"
            type="button"
          >
            Vencidas (0)
          </button>
        </div>

        <div className="activity-list">
          {groups.map((group) => (
            <section className="activity-group" key={group.title}>
              <header>
                <span>
                  {group.title} <b>{group.activities.length}</b>
                </span>
                <small>{group.range}</small>
              </header>
              {group.activities
                .filter(
                  (item) =>
                    course === "Todos los cursos" || item.course === course,
                )
                .map((activity) => (
                  <ActivityRow activity={activity} key={activity.title} />
                ))}
            </section>
          ))}
          {filter === "overdue" && (
            <section className="activity-group empty-group">
              <header>
                <span>
                  Vencidas <b>0</b>
                </span>
              </header>
              <div>No tienes actividades vencidas</div>
            </section>
          )}
        </div>

        <footer className="list-footer">
          <span>
            {filter === "overdue"
              ? ""
              : `Mostrando ${visibleCount} actividades pendientes`}
          </span>
          <span>Hora local · Lima (GMT-5)</span>
        </footer>
      </section>
    </main>
    </div>
  )
}
