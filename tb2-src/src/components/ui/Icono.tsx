import {
  Activity,
  Award,
  Book,
  Calendar,
  CalendarCheck,
  CalendarPlus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  ClipboardCheck,
  Clock,
  FunnelX,
  House,
  Info,
  Menu,
  MessageCircle,
  Percent,
  TriangleAlert,
  X,
} from "lucide-react";

const ICONOS = {
  "calendario-mas": CalendarPlus,
  inicio: House,
  cursos: Book,
  actividad: Activity,
  evaluaciones: ClipboardCheck,
  calendario: Calendar,
  "calendar-check": CalendarCheck,
  calificaciones: Award,
  mensajes: MessageCircle,
  "chevron-down": ChevronDown,
  "chevron-right": ChevronRight,
  "chevron-izquierda": ChevronLeft,
  info: Info,
  quitar: X,
  percent: Percent,
  clock: Clock,
  warn: TriangleAlert,
  error: CircleAlert,
  success: CircleCheck,
  "filter-x": FunnelX,
  menu: Menu,
} as const;

export type IconoNombre = keyof typeof ICONOS;
export type IconoSize = "sm" | "md" | "lg";

const MEDIDAS: Record<IconoSize, { px: number; trazo: number }> = {
  sm: { px: 12, trazo: 2.5 },
  md: { px: 16, trazo: 2.25 },
  lg: { px: 32, trazo: 1.75 },
};

type IconoProps = { nombre: IconoNombre; size?: IconoSize };

export default function Icono({ nombre, size = "md" }: IconoProps) {
  const Componente = ICONOS[nombre];
  const { px, trazo } = MEDIDAS[size];
  return (
    <Componente
      aria-hidden="true"
      width={px}
      height={px}
      strokeWidth={trazo}
      className="shrink-0"
    />
  );
}
