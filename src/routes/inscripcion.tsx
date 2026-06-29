import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import animaLogo from "@/assets/anima-logo.png.asset.json";
import embassy from "@/assets/us-embassy.jpg.asset.json";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/inscripcion")({
  head: () => ({
    meta: [
      { title: "Inscripción · Academia de Empleabilidad" },
      { name: "description", content: "Completá tu inscripción a la Academia de Empleabilidad de ÁNIMA." },
    ],
  }),
  component: InscripcionPage,
});

const TALLERES = [
  "Enfoque STEM, IA, Big Data y Desarrollo Web",
  "Reclutamiento, selección y software para empleo",
  "Emprendedurismo + Finanzas profesionales y personales",
  "Inglés para tecnológicos",
  "Tecnología y salud mental",
  "Competencias transversales para el trabajo",
];

function InscripcionPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    birth_date: "",
    vinculo: "" as "" | "egresado_academia" | "egresado_finest" | "egresado_bachillerato" | "sin_vinculo",
    situacion: "" as "" | "sin_empleo" | "empleo_informal" | "empleo_formal_mejorar" | "empleo_formal_satisfactorio",
    area_interes: "",
    talleres_interes: [] as string[],
    phone: "",
    email: "",
    consent: false,
  });

  function toggleTaller(t: string) {
    setForm((f) => ({
      ...f,
      talleres_interes: f.talleres_interes.includes(t) ? f.talleres_interes.filter((x) => x !== t) : [...f.talleres_interes, t],
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.consent) return toast.error("Necesitamos tu consentimiento para usar los datos.");
    if (!form.vinculo || !form.situacion) return toast.error("Completá los campos obligatorios.");
    setLoading(true);
    const { data, error } = await supabase
      .from("inscripciones")
      .insert({
        full_name: form.full_name,
        birth_date: form.birth_date,
        vinculo: form.vinculo,
        situacion: form.situacion,
        area_interes: form.area_interes || null,
        talleres_interes: form.talleres_interes,
        phone: form.phone || null,
        email: form.email,
        consent: form.consent,
      })
      .select("id")
      .single();
    setLoading(false);
    if (error) return toast.error("No pudimos enviar tu inscripción. Intentá de nuevo.");
    toast.success("¡Listo! Tu inscripción fue recibida.");
    setSubmitted(data.id);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-anima-teal" />
        <h1 className="mt-6 text-3xl font-bold">¡Listo! Tu inscripción fue recibida.</h1>
        <p className="mt-3 text-muted-foreground">
          Pronto nos ponemos en contacto con vos. Mientras tanto, te invitamos a completar una breve encuesta para
          conocerte mejor.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => navigate({ to: "/encuesta", search: { ins: submitted } as never })} className="rounded-full bg-anima-blue px-6 py-3 text-sm font-semibold text-white">
            Completar encuesta
          </button>
          <Link to="/" className="rounded-full border border-border px-6 py-3 text-sm font-semibold">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const input = "mt-1 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-anima-blue focus:ring-2 focus:ring-anima-blue/20";
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/"><img src={animaLogo.url} alt="ÁNIMA" className="h-9 w-auto" /></Link>
          <img src={embassy.url} alt="U.S. Embassy Montevideo" className="hidden h-10 w-auto sm:block" />
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="rounded-3xl bg-anima-blue p-8 text-white">
          <div className="text-xs font-semibold uppercase tracking-wider text-anima-lime">Academia de Empleabilidad</div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Quiero participar</h1>
          <p className="mt-2 max-w-xl text-white/90">Contanos un poco sobre vos. Es el primer paso para sumarte al programa.</p>
        </div>
        <form onSubmit={onSubmit} className="mt-6 space-y-5 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Nombre completo *</label>
              <input required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className={input} />
            </div>
            <div>
              <label className="text-sm font-medium">Fecha de nacimiento *</label>
              <input required type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} className={input} />
            </div>
            <div>
              <label className="text-sm font-medium">Vínculo con ÁNIMA *</label>
              <select required value={form.vinculo} onChange={(e) => setForm({ ...form, vinculo: e.target.value as typeof form.vinculo })} className={input}>
                <option value="">Elegí una opción</option>
                <option value="egresado_academia">Egresado/a de Academia de Empleabilidad</option>
                <option value="egresado_finest">Egresado/a de FINEST</option>
                <option value="egresado_bachillerato">Egresado/a de Bachillerato Tecnológico</option>
                <option value="sin_vinculo">Sin vínculo previo con ÁNIMA</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Situación laboral actual *</label>
              <select required value={form.situacion} onChange={(e) => setForm({ ...form, situacion: e.target.value as typeof form.situacion })} className={input}>
                <option value="">Elegí una opción</option>
                <option value="sin_empleo">Sin empleo</option>
                <option value="empleo_informal">Empleo informal</option>
                <option value="empleo_formal_mejorar">Empleo formal que quiero mejorar</option>
                <option value="empleo_formal_satisfactorio">Empleo formal satisfactorio</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Área de interés profesional</label>
              <input value={form.area_interes} onChange={(e) => setForm({ ...form, area_interes: e.target.value })} placeholder="Ej: desarrollo web, atención al cliente, marketing…" className={input} />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Talleres de interés</label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {TALLERES.map((t) => (
                  <label key={t} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${form.talleres_interes.includes(t) ? "border-anima-blue bg-anima-blue/5" : "border-border hover:bg-muted"}`}>
                    <input type="checkbox" checked={form.talleres_interes.includes(t)} onChange={() => toggleTaller(t)} className="mt-0.5 h-4 w-4 accent-[var(--anima-blue)]" />
                    <span>{t}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Teléfono de contacto</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
            </div>
            <div>
              <label className="text-sm font-medium">Correo electrónico *</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-muted p-4 text-sm">
            <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-0.5 h-4 w-4 accent-[var(--anima-blue)]" />
            <span>Autorizo a ÁNIMA a usar mis datos para gestionar mi participación en el programa.</span>
          </label>
          <button disabled={loading} type="submit" className="w-full rounded-full bg-anima-blue px-6 py-3.5 text-base font-semibold text-white transition hover:brightness-110 disabled:opacity-60">
            {loading ? "Enviando…" : "Enviar mi inscripción"}
          </button>
        </form>
      </div>
    </div>
  );
}