import { useState } from "react"

const assets = `${import.meta.env.BASE_URL}assets`

const icons = {
  logo: `${assets}/6313b.svg`,
  home: `${assets}/3845f.svg`,
  courses: `${assets}/785e2.svg`,
  activity: `${assets}/2bc79.svg`,
  evaluations: `${assets}/a1330.svg`,
  calendar: `${assets}/c6312.svg`,
  calendarActive: `${assets}/339eb.svg`,
  grades: `${assets}/a36f2.svg`,
  messages: `${assets}/b6bde.svg`,
  chevron: `${assets}/b761c.svg`,
  addCalendar: `${assets}/dc6c6.svg`,
  calendarMd: `${assets}/b9ad6.svg`,
  success: `${assets}/3c6a9.svg`,
  activitySuccess: `${assets}/b9c4f.svg`,
  syncChevron: `${assets}/befcd.svg`,
  apple: `${assets}/edd02.svg`,
}

type Screen = "activities" | "calendar"
type ActivityFilter = "all" | "week" | "overdue"

type Activity = {
  urgency: string
  title: string
  date: string
  course: string
  weight: string
  tone: string
}

const activityGroups: { title: string range: string activities: Activity[] }[] =
  [
    {
      title: "Hoy",
      range: "Jueves, 8 de octubre",
      activities: [
        {
          urgency: "Vence hoy a las 18:00",
          title: "PC1 - Práctica Calificada 1",
          date: "8 oct · 18:00",
          course: "Matemática Discreta",
          weight: "15%",
          tone: "purple",
        },
        {
          urgency: "Vence hoy a las 23:59",
          title: "TB1 - Trabajo 1",
          date: "8 oct · 23:59",
          course: "Diseño UX",
          weight: "20%",
          tone: "pink",
        },
      ],
    },
    {
      title: "Esta semana",
      range: "Del 9 al 11 de octubre",
      activities: [
        {
          urgency: "Vence mañana",
          title: "Laboratorio 3 - Modelo relacional",
          date: "9 oct · 20:00",
          course: "Base de Datos",
          weight: "10%",
          tone: "cyan",
        },
        {
          urgency: "Vence en 2 días",
          title: "PC1 - Estructuras de datos",
          date: "10 oct · 18:00",
          course: "Programación II",
          weight: "15%",
          tone: "green",
        },
        {
          urgency: "Vence en 3 días",
          title: "TB1 - Planteamiento del problema",
          date: "11 oct · 23:59",
          course: "Metodología de la Investigación",
          weight: "15%",
          tone: "amber",
        },
      ],
    },
    {
      title: "Próximas semanas",
      range: "Desde el 12 de octubre",
      activities: [
        {
          urgency: "Vence en 5 días",
          title: "Tarea 4 - Relaciones y funciones",
          date: "13 oct · 23:59",
          course: "Matemática Discreta",
          weight: "5%",
          tone: "purple",
        },
        {
          urgency: "Vence en 7 días",
          title: "Avance de proyecto - Prototipo",
          date: "15 oct · 23:59",
          course: "Diseño UX",
          weight: "25%",
          tone: "pink",
        },
        {
          urgency: "Vence en 10 días",
          title: "Control de lectura 2",
          date: "18 oct · 20:00",
          course: "Base de Datos",
          weight: "10%",
          tone: "cyan",
        },
        {
          urgency: "Vence en 12 días",
          title: "Evaluación continua 2",
          date: "20 oct · 18:00",
          course: "Programación II",
          weight: "15%",
          tone: "green",
        },
      ],
    },
  ]

const navItems = [
  ["Inicio", icons.home],
  ["Cursos", icons.courses],
  ["Actividades", icons.activity],
  ["Evaluaciones", icons.evaluations],
  ["Calendario", icons.calendar],
  ["Calificaciones", icons.grades],
  ["Mensajes", icons.messages],
] as const

function Sidebar({
  screen,
  onNavigate,
}: {
  screen: Screen
  onNavigate: (screen: Screen) => void
}) {
  return (
    <aside className="sidebar">
      <img className="brand-mark" src={icons.logo} alt="UPC" />
      <nav className="main-nav" aria-label="Navegación principal">
        {navItems.map(([label, icon]) => {
          const target =
            label === "Calendario"
              ? "calendar"
              : label === "Actividades"
                ? "activities"
                : null
          const active =
            (screen === "activities" && label === "Actividades") ||
            (screen === "calendar" && label === "Calendario")

          return (
            <button
              className={`nav-item ${active ? "active" : ""}`}
              key={label}
              onClick={() => target && onNavigate(target)}
              type="button"
            >
              <img
                src={
                  label === "Calendario" && active ? icons.calendarActive : icon
                }
                alt=""
              />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
      <div className="profile">
        <span className="avatar">RV</span>
        <span>
          <strong>Rubén Vargas</strong>
          <small>Estudiante</small>
        </span>
      </div>
    </aside>
  )
}

function MobileHeader({
  screen,
  onNavigate,
}: {
  screen: Screen
  onNavigate: (screen: Screen) => void
}) {
  return (
    <header className="mobile-header">
      <img src={icons.logo} alt="UPC" />
      <div>
        <button
          className={screen === "activities" ? "selected" : ""}
          onClick={() => onNavigate("activities")}
          type="button"
        >
          Actividades
        </button>
        <button
          className={screen === "calendar" ? "selected" : ""}
          onClick={() => onNavigate("calendar")}
          type="button"
        >
          Calendario
        </button>
      </div>
      <span className="avatar">RV</span>
    </header>
  )
}

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
        <strong>{activity.weight}</strong>
        <small>nota final</small>
      </div>
      <button className="outline-button small" type="button">
        Ver actividad
      </button>
    </article>
  )
}

function Activities() {
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
          <button className="primary-button" type="button">
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
          integradas de tus 5 cursos matriculados.
        </div>

        <div className="section-title">
          <h2>Todas mis actividades pendientes</h2>
          <span className="count-badge">9</span>
        </div>
        <p className="sin-fecha-linea">
          No incluye 6 actividades que aún no tienen fecha oficial.
          <a href="../../diego-hu03-hu05/tb2/#/actividades/sin-fecha">
            Ver <img src={icons.chevron} alt="" />
          </a>
        </p>

        <div className="filters">
          <label>
            <span className="sr-only">Curso</span>
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
            >
              <option>Todos los cursos</option>
              <option>Matemática Discreta</option>
              <option>Diseño UX</option>
              <option>Base de Datos</option>
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
            Todos los pendientes (9)
          </button>
          <button
            className={filter === "week" ? "active" : ""}
            onClick={() => setFilter("week")}
            role="tab"
            type="button"
          >
            Por entregar esta semana (3)
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
  )
}

function Switch({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={enabled}
      className={`switch ${enabled ? "on" : ""}`}
      onClick={onChange}
      type="button"
    >
      <span />
    </button>
  )
}

function ProviderCard({
  name,
  account,
  enabled,
  onToggle,
}: {
  name: string
  account: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <article className="provider-card">
      <header>
        <div className="provider-info">
          <span className="provider-icon">
            <img src={icons.calendarMd} alt="" />
          </span>
          <span>
            <strong>{name}</strong>
            <small>{account}</small>
          </span>
        </div>
        <div className="provider-actions">
          <span className="status connected">Conectado</span>
          <Switch
            enabled={enabled}
            onChange={onToggle}
            label={`${enabled ? "Desactivar" : "Activar"} ${name}`}
          />
        </div>
      </header>
      <ul>
        <li>
          <img src={icons.success} alt="" />
          Sincronizar fechas límite de entrega (Tareas y Trabajos)
        </li>
        <li>
          <img src={icons.success} alt="" />
          Sincronizar fechas y horas de exámenes/evaluaciones
        </li>
        <li>
          <img src={icons.success} alt="" />
          Recordatorio automático 24 horas antes del vencimiento
        </li>
      </ul>
    </article>
  )
}

function Calendar({ onConnect }: { onConnect: () => void }) {
  const [google, setGoogle] = useState(true)
  const [outlook, setOutlook] = useState(true)
  const days = [
    ["LUN", "05"],
    ["MAR", "06"],
    ["MIÉ", "07"],
    ["JUE", "08"],
    ["VIE", "09"],
    ["SÁB", "10"],
    ["DOM", "11"],
  ]

  return (
    <main className="content">
      <section className="page-heading">
        <div>
          <h1>Calendario</h1>
          <p>
            Conecta y sincroniza automáticamente tus tareas y evaluaciones
            académicas con tus calendarios personales.
          </p>
        </div>
      </section>

      <section className="page-body calendar-body">
        <div className="sync-banner">
          <span>
            <img src={icons.success} alt="" />
            Sincronización activa · Sincronización automática activada · Última
            actualización: Hoy a las 18:00
          </span>
          <button type="button">
            Sincronizar ahora
            <img src={icons.syncChevron} alt="" />
          </button>
        </div>

        <h2 className="calendar-title">Integraciones de calendario</h2>
        <div className="providers">
          <ProviderCard
            name="Google Calendar"
            account="Cuenta: ruben.vargas@gmail.com"
            enabled={google}
            onToggle={() => setGoogle(!google)}
          />
          <ProviderCard
            name="Microsoft Outlook / Teams"
            account="Cuenta conectada"
            enabled={outlook}
            onToggle={() => setOutlook(!outlook)}
          />
          <article className="provider-card compact">
            <header>
              <div className="provider-info">
                <span className="provider-icon">
                  <img src={icons.calendarMd} alt="" />
                </span>
                <span>
                  <strong>Apple Calendar (iCal)</strong>
                  <small>Disponible para conexión</small>
                </span>
              </div>
              <div className="provider-actions">
                <span className="status">Disponible</span>
                <button
                  className="outline-button small"
                  onClick={onConnect}
                  type="button"
                >
                  Conectar
                </button>
              </div>
            </header>
          </article>
        </div>

        <section className="calendar-preview">
          <header>
            <strong>Vista previa de calendario semanal</strong>
            <span className="status connected">Semana 41</span>
          </header>
          <div className="week-grid">
            {days.map(([day, date]) => (
              <div key={day}>
                <small>{day}</small>
                <strong>{date}</strong>
              </div>
            ))}
          </div>
          <article className="calendar-event">
            <strong>
              <img src={icons.addCalendar} alt="" />
              Entrega TB1 - Diseño UX
            </strong>
            <small>Viernes 9 de octubre · 23:59</small>
          </article>
        </section>
      </section>
    </main>
  )
}

function AppleModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="apple-modal-title"
        aria-modal="true"
        className="modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header>
          <div className="apple-heading">
            <span>
              <img src={icons.apple} alt="" />
            </span>
            <strong>Apple Calendar</strong>
          </div>
          <button aria-label="Cerrar" onClick={onClose} type="button">
            ×
          </button>
        </header>
        <div className="modal-copy">
          <h2 id="apple-modal-title">Conectar con Apple Calendar</h2>
          <p>
            Inicia sesión con tu Apple ID para sincronizar tus tareas y
            evaluaciones académicas.
          </p>
        </div>
        <form onSubmit={(event) => event.preventDefault()}>
          <label>
            Apple ID / Correo electrónico
            <input defaultValue="ruben.vargas@icloud.com" type="email" />
          </label>
          <label>
            Contraseña
            <input defaultValue="123456789012" type="password" />
          </label>
          <label className="permission">
            <input defaultChecked type="checkbox" />
            <span>
              Permitir que la plataforma lea y añada eventos a tu calendario
              académico.
            </span>
          </label>
          <div className="modal-actions">
            <button className="primary-button" type="submit">
              Iniciar sesión
            </button>
            <button className="outline-button" onClick={onClose} type="button">
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("activities")
  const [showAppleModal, setShowAppleModal] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar screen={screen} onNavigate={setScreen} />
      <MobileHeader screen={screen} onNavigate={setScreen} />
      {screen === "activities" ? (
        <Activities />
      ) : (
        <Calendar onConnect={() => setShowAppleModal(true)} />
      )}
      {showAppleModal && (
        <AppleModal onClose={() => setShowAppleModal(false)} />
      )}
    </div>
  )
}
