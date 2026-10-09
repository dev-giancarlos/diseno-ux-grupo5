// Pantalla de Rubén (HU-09 · Calendario), copiada de ruben-hu01-hu09/src/App.tsx con su lógica.
// Cambio: usa el sidebar de la app; el estado del modal de Apple, que en su app vivía en App,
// vive aquí.
import { useState } from "react"
import { backend } from "@/backend"
import { cursoPorId, semanaDeFecha } from "@/data"
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
  // Semana de "hoy" (lunes a domingo), con los datos del backend.
  const { hoy, calendario } = backend
  const lunes = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - ((hoy.getDay() + 6) % 7))
  const days = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"].map((day, i) => {
    const d = new Date(lunes.getFullYear(), lunes.getMonth(), lunes.getDate() + i)
    return [day, String(d.getDate()).padStart(2, "0")]
  })
  const hora = (d: Date) => `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
  const evento = backend.pendientes.find(
    (p) => p.cursoId === calendario.eventoDestacado.cursoId && p.titulo === calendario.eventoDestacado.titulo,
  )!
  const DIAS_LARGOS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

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
            actualización: Hoy a las {hora(calendario.ultimaSincronizacion)}
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
            account={`Cuenta: ${calendario.cuentas.google}`}
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
            <span className="status connected">Semana {semanaDeFecha(hoy)}</span>
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
              Entrega {evento.titulo.split(" - ")[0]} - {cursoPorId(evento.cursoId).nombre}
            </strong>
            <small>
              {DIAS_LARGOS[evento.vence.getDay()]} {evento.vence.getDate()} de {MESES_LARGOS[evento.vence.getMonth()]} · {hora(evento.vence)}
            </small>
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
            <input defaultValue={backend.calendario.cuentas.apple.correo} type="email" />
          </label>
          <label>
            Contraseña
            <input defaultValue={backend.calendario.cuentas.apple.contrasena} type="password" />
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

export default function CalendarioRuben() {
  const [showAppleModal, setShowAppleModal] = useState(false)

  return (
    <div className="ruben">
      <Calendar onConnect={() => setShowAppleModal(true)} />
      {showAppleModal && (
        <AppleModal onClose={() => setShowAppleModal(false)} />
      )}
    </div>
  )
}
