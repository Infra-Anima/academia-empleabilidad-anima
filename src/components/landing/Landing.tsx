import { Link } from "@tanstack/react-router";
import animaLogo from "@/assets/anima-logo.png.asset.json";
import animaLogoWhite from "@/assets/anima-logo-white.png.asset.json";
import embassy from "@/assets/us-embassy.jpg.asset.json";
import hero from "@/assets/hero-classroom-real.jpg.asset.json";
import heroBg from "@/assets/hero-bg-overlay.png.asset.json";
import {
  ArrowRight,
  Users,
  GraduationCap,
  Briefcase,
  Sparkles,
  UserRound,
  Building2,
  ShieldCheck,
  Calendar,
  Heart,
  Award,
  Code,
  Languages,
  LineChart,
  Megaphone,
} from "lucide-react";

const ejes = [
  {
    icon: GraduationCap,
    title: "Cursos y formaciones",
    desc: "Cursos y talleres orientados al desarrollo de competencias laborales que buscan las empresas. Acreditaciones reconocidas que valoran tu formación y experiencia en el mercado laboral.",
    tone: "blue" as const,
  },
  {
    icon: Heart,
    title: "Acompañamiento personalizado",
    desc: "Acompañamiento personalizado para identificar tus objetivos y planificar tu trayectoria.",
    tone: "teal" as const,
  },
  {
    icon: Briefcase,
    title: "Oportunidades laborales",
    desc: "Conexión con empleadores y organizaciones que buscan talento como el tuyo.",
    tone: "lime" as const,
  },
];

const aliados = [
  "INEFOP",
  "Endless",
  "LAiB",
  "ZetaSoftware",
  "Alianza Cultural",
  "BASF",
  "ManpowerGroup",
  "Scotiabank",
];

type Tone = "blue" | "teal" | "lime";

const toneStyles: Record<Tone, string> = {
  blue: "bg-anima-blue text-white",
  teal: "bg-anima-teal text-white",
  lime: "bg-anima-lime text-anima-ink",
};
const iconChip: Record<Tone, string> = {
  blue: "bg-white/15 text-white",
  teal: "bg-white/15 text-white",
  lime: "bg-anima-ink/10 text-anima-ink",
};

function PanelCard({
  to,
  eyebrow,
  title,
  desc,
  tone,
  icon: Icon,
  cta = "Ingresar",
}: {
  to: string;
  eyebrow: string;
  title: string;
  desc: string;
  tone: Tone;
  icon: React.ComponentType<{ className?: string }>;
  cta?: string;
}) {
  return (
    <Link
      to={to}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${toneStyles[tone]}`}
    >
      <div>
        <div
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${iconChip[tone]}`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="mt-5 text-xs font-semibold uppercase tracking-widest opacity-80">
          {eyebrow}
        </div>
        <h3 className="mt-1 text-2xl font-extrabold leading-tight">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed opacity-95">{desc}</p>
      </div>
      <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">
        {cta}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

const formaciones = [
  {
    icon: Code,
    title: "Tecnología & Datos",
    desc: "Fundamentos digitales, planillas de cálculo, introducción a programación y análisis de datos.",
    tone: "blue" as const,
  },
  {
    icon: Languages,
    title: "Inglés laboral",
    desc: "Comunicación efectiva en entornos profesionales y entrevistas en inglés.",
    tone: "teal" as const,
  },
  {
    icon: LineChart,
    title: "Gestión & Finanzas",
    desc: "Educación financiera personal, gestión de proyectos y herramientas de productividad.",
    tone: "lime" as const,
  },
  {
    icon: Megaphone,
    title: "Habilidades para el trabajo",
    desc: "Comunicación, trabajo en equipo, resolución de problemas y armado de CV.",
    tone: "blue" as const,
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <img src={animaLogo.url} alt="ÁNIMA" className="h-9 w-auto sm:h-10" />
            <div className="hidden h-8 w-px bg-border sm:block" />
            <img
              src={embassy.url}
              alt="U.S. Embassy Montevideo"
              className="hidden h-10 w-auto sm:block"
            />
          </div>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/auth"
              className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted sm:inline-flex"
            >
              Ingresar
            </Link>
            <Link
              to="/inscripcion"
              className="inline-flex items-center gap-2 rounded-full bg-anima-blue px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Quiero participar <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-anima-blue text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 mix-blend-luminosity"
          style={{ backgroundImage: `url(${heroBg.url})` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-anima-blue/70 via-anima-blue/60 to-anima-blue/85"
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5 text-anima-lime" />
              Programa 2026 · ÁNIMA
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Academia de{" "}
              <span className="relative inline-block">
                <span className="relative z-10">Empleabilidad</span>
                <span className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-anima-lime/80" />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/90">
              Itinerarios formativos, acompañamiento e intermediación para la inserción y
              reconversión laboral de jóvenes y adultos en Uruguay.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/inscripcion"
                className="inline-flex items-center gap-2 rounded-full bg-anima-lime px-6 py-3 text-base font-semibold text-anima-ink transition hover:brightness-105"
              >
                Quiero participar <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#programa"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/10"
              >
                Conocé el programa
              </a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 text-sm">
              <div>
                <div className="text-3xl font-bold text-anima-lime">+100</div>
                <div className="text-white/80">participantes activos</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-anima-lime">3</div>
                <div className="text-white/80">pilares de impacto</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-anima-lime">2026</div>
                <div className="text-white/80">edición vigente</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border-4 border-white/10 shadow-2xl">
              <img
                src={hero.url}
                alt="Participantes en clase"
                width={1600}
                height={1200}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-0 bg-anima-blue/15 mix-blend-multiply" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-anima-lime p-4 text-anima-ink shadow-xl sm:block">
              <div className="text-xs font-semibold uppercase">Financiado por</div>
              <div className="mt-1 text-sm font-bold">U.S. Embassy Montevideo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Paneles de acceso */}
      <section id="accesos" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-wider text-anima-teal">
              Tu espacio en la Academia
            </div>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Elegí cómo querés ingresar
            </h2>
            <p className="mt-3 text-muted-foreground">
              Tres paneles, una misma comunidad. Conocé el espacio que te corresponde.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <PanelCard
              to="/perfil"
              eyebrow="Acceder como"
              title="Soy participante"
              desc="Completá tu perfil, sumate a cursos y postulate a oportunidades reales."
              tone="blue"
              icon={UserRound}
              cta="Entrar al panel"
            />
            <PanelCard
              to="/empresa"
              eyebrow="Acceder como"
              title="Soy empresa"
              desc="Publicá oportunidades, gestioná postulaciones y conectá con talento formado."
              tone="teal"
              icon={Building2}
              cta="Entrar al panel"
            />
            <PanelCard
              to="/admin"
              eyebrow="Acceder como"
              title="Equipo ÁNIMA"
              desc="Coordiná inscripciones, empresas, formaciones y publicá nuevas oportunidades."
              tone="lime"
              icon={ShieldCheck}
              cta="Entrar al panel"
            />
          </div>
        </div>
      </section>

      {/* Ejes */}
      <section id="programa" className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-wider text-anima-teal">
              Nuestro programa
            </div>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Itinerario Profesional: tres pilares que sostienen tu camino
            </h2>
            <p className="mt-4 text-muted-foreground">
              Combinamos formación, acompañamiento humano y conexión real con empresas para que
              cada paso sume valor a tu perfil.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {ejes.map((eje, i) => (
              <div
                key={eje.title}
                className="group relative overflow-hidden rounded-3xl border border-border bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                    i === 0 ? "bg-anima-blue text-white" : i === 1 ? "bg-anima-teal text-white" : "bg-anima-lime text-anima-ink"
                  }`}
                >
                  <eje.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold">{eje.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{eje.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cursos y formaciones (mismo estilo que paneles de acceso) */}
      <section id="formaciones" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="text-sm font-semibold uppercase tracking-wider text-anima-teal">
                Cursos y formaciones
              </div>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Itinerario formativo abierto
              </h2>
              <p className="mt-3 text-muted-foreground">
                Preinscribite a los cursos disponibles o a los próximos a abrir. La oferta se
                actualiza con nuevas propuestas durante el año.
              </p>
            </div>
            <Link
              to="/talleres"
              className="inline-flex items-center gap-2 rounded-full bg-anima-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Ver todos los cursos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {formaciones.map((f) => (
              <PanelCard
                key={f.title}
                to="/talleres"
                eyebrow="Área formativa"
                title={f.title}
                desc={f.desc}
                tone={f.tone}
                icon={f.icon}
                cta="Preinscribirme"
              />
            ))}
          </div>
          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-anima-lime/40 bg-anima-lime/15 p-5 text-sm text-anima-ink">
            <Award className="mt-0.5 h-5 w-5 shrink-0 text-anima-blue" />
            <p>
              <strong>Certificaciones:</strong> acreditaciones reconocidas que valoran tu formación
              y experiencia en el mercado laboral.
            </p>
          </div>
        </div>
      </section>

      {/* Acompañamiento personalizado */}
      <section id="acompanamiento" className="bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-wider text-anima-teal">
              Acompañamiento personalizado
            </div>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Agendá un espacio de 30 minutos
            </h2>
            <p className="mt-3 text-muted-foreground">
              Elegí el tipo de encuentro que mejor se ajusta a tu momento. Sin costo y 100% online
              o presencial en nuestras sedes.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <a
              href="https://calendly.com/leticiamartinez/30min"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-anima-blue p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Users className="h-6 w-6" />
                </div>
                <div className="mt-5 text-xs font-semibold uppercase tracking-widest opacity-80">
                  Turno 30 min · Google Calendar / Calendly
                </div>
                <h3 className="mt-1 text-2xl font-extrabold leading-tight">
                  Referente de Empleabilidad de ÁNIMA
                </h3>
                <p className="mt-3 text-sm leading-relaxed opacity-95">
                  Reunión con un/a referente para revisar tu CV, definir objetivos laborales y
                  trazar tu itinerario en la Academia.
                </p>
              </div>
              <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4" /> Agendar con un/a referente
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </a>
            <a
              href="https://forms.gle/nbxTKQ8Y5PTM2kbD9"
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-anima-teal p-7 text-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <Heart className="h-6 w-6" />
                </div>
                <div className="mt-5 text-xs font-semibold uppercase tracking-widest opacity-80">
                  Turno 30 min · Formulario de agenda
                </div>
                <h3 className="mt-1 text-2xl font-extrabold leading-tight">
                  Coaching ontológico — Academia Genera Social
                </h3>
                <p className="mt-3 text-sm leading-relaxed opacity-95">
                  Sesión de coaching para trabajar mirada, conversaciones y emociones en tu proceso
                  de búsqueda o desarrollo laboral.
                </p>
              </div>
              <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold">
                <Calendar className="h-4 w-4" /> Agendar sesión de coaching
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Aliados */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <div className="text-sm font-semibold uppercase tracking-wider text-anima-teal">
            Socios formadores
          </div>
          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            Organizaciones que forman junto a nosotros
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {aliados.map((a) => (
              <div
                key={a}
                className="flex h-16 items-center justify-center rounded-xl border border-border bg-white px-3 text-center text-sm font-semibold text-anima-ink/70"
              >
                {a}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Oportunidades laborales — vinculación */}
      <section id="oportunidades" className="bg-anima-ink py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wider text-anima-lime">
              Oportunidades laborales
            </div>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Conectamos talento con empresas que están contratando
            </h2>
            <p className="mt-4 max-w-xl text-white/80">
              Las empresas aliadas y el equipo ÁNIMA publican vacantes reales en la plataforma.
              Como participante, postulate desde tu panel; como empresa, gestioná tus búsquedas y
              postulantes en un solo lugar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/oportunidades"
                className="inline-flex items-center gap-2 rounded-full bg-anima-lime px-5 py-3 text-sm font-semibold text-anima-ink transition hover:brightness-105"
              >
                Ver oportunidades abiertas <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/empresa"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Publicar una oportunidad
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            <Link to="/empresa" className="group flex items-start gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/10">
              <Building2 className="h-7 w-7 shrink-0 text-anima-lime" />
              <div>
                <div className="text-lg font-bold">Soy Empresa</div>
                <p className="mt-1 text-sm text-white/75">
                  Publicá vacantes, definí requisitos y seguí el estado de cada postulación.
                </p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 self-center text-anima-lime transition group-hover:translate-x-1" />
            </Link>
            <Link to="/perfil" className="group flex items-start gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/10">
              <UserRound className="h-7 w-7 shrink-0 text-anima-lime" />
              <div>
                <div className="text-lg font-bold">Soy Participante</div>
                <p className="mt-1 text-sm text-white/75">
                  Postulate con un click usando tu perfil cargado y recibí seguimiento del proceso.
                </p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 self-center text-anima-lime transition group-hover:translate-x-1" />
            </Link>
            <Link to="/admin" className="group flex items-start gap-4 rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:bg-white/10">
              <ShieldCheck className="h-7 w-7 shrink-0 text-anima-lime" />
              <div>
                <div className="text-lg font-bold">Equipo ÁNIMA</div>
                <p className="mt-1 text-sm text-white/75">
                  Cargá oportunidades en nombre de socios formadores y derivá a participantes idóneos.
                </p>
              </div>
              <ArrowRight className="ml-auto h-5 w-5 self-center text-anima-lime transition group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-anima-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
          <div>
            <img src={animaLogoWhite.url} alt="ÁNIMA" className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Academia de Empleabilidad — Formación, acompañamiento e intermediación laboral en
              Uruguay.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-wider text-anima-lime">
              Contacto
            </div>
            <ul className="mt-4 space-y-2 text-sm text-white/80">
              <li>info@anima.edu.uy</li>
              <li>Montevideo, Uruguay</li>
              <li>anima.edu.uy</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-wider text-anima-lime">
              Financiado por
            </div>
            <div className="mt-4 inline-flex items-center gap-3 rounded-xl bg-white p-3">
              <img src={embassy.url} alt="U.S. Embassy Montevideo" className="h-12 w-auto" />
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-white/60 sm:px-6">
            © {new Date().getFullYear()} ÁNIMA Formación Dual · Todos los derechos reservados
          </div>
        </div>
      </footer>
    </div>
  );
}