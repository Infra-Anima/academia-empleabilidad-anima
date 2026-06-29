import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import animaLogo from "@/assets/anima-logo.png.asset.json";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/encuesta")({
  validateSearch: (s: Record<string, unknown>) => ({ ins: typeof s.ins === "string" ? s.ins : undefined }),
  head: () => ({ meta: [{ title: "Encuesta de intereses · Academia" }] }),
  component: Encuesta,
});

const AREAS = ["Tecnología", "Idiomas", "Gestión", "Emprendedurismo", "Otro"];

function Encuesta() {
  const { ins } = useSearch({ from: "/encuesta" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    nivel_digital: 3,
    fortalezas: [] as string[],
    mejorar: [] as string[],
    tiene_linkedin: "",
    tiene_cv: "",
    experiencia_previa: null as null | boolean,
    expectativas: "",
  });

  function toggle(field: "fortalezas" | "mejorar", v: string) {
    setForm((f) => ({ ...f, [field]: f[field].includes(v) ? f[field].filter((x) => x !== v) : [...f[field], v] }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from("encuestas").insert({
      email: form.email || null,
      inscripcion_id: ins ?? null,
      nivel_digital: form.nivel_digital,
      fortalezas: form.fortalezas,
      mejorar: form.mejorar,
      tiene_linkedin: form.tiene_linkedin || null,
      tiene_cv: form.tiene_cv || null,
      experiencia_previa: form.experiencia_previa,
      expectativas: form.expectativas || null,
    });
    setLoading(false);
    if (error) return toast.error("No pudimos enviar la encuesta.");
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-anima-teal" />
        <h1 className="mt-4 text-2xl font-bold">¡Gracias por completar la encuesta!</h1>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-anima-blue px-5 py-2.5 text-sm font-semibold text-white">Volver al inicio</Link>
      </div>
    );
  }

  const input = "mt-1 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-anima-blue focus:ring-2 focus:ring-anima-blue/20";
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6">
          <Link to="/"><img src={animaLogo.url} alt="ÁNIMA" className="h-9 w-auto" /></Link>
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold">Encuesta de intereses y competencias</h1>
        <p className="mt-2 text-muted-foreground">Nos ayuda a armar tu itinerario formativo. Te toma menos de 3 minutos.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-6 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          {!ins && (
            <div>
              <label className="text-sm font-medium">Correo electrónico</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
            </div>
          )}
          <div>
            <label className="text-sm font-medium">¿Cómo te llevás con las herramientas digitales? ({form.nivel_digital}/5)</label>
            <input type="range" min={1} max={5} value={form.nivel_digital} onChange={(e) => setForm({ ...form, nivel_digital: Number(e.target.value) })} className="mt-3 w-full accent-[var(--anima-blue)]" />
            <div className="mt-1 flex justify-between text-xs text-muted-foreground"><span>Recién empiezo</span><span>Lo manejo muy bien</span></div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <div className="text-sm font-medium">¿En qué te sentís fuerte?</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {AREAS.map((a) => (
                  <button type="button" key={a} onClick={() => toggle("fortalezas", a)} className={`rounded-full px-3 py-1.5 text-sm transition ${form.fortalezas.includes(a) ? "bg-anima-teal text-white" : "border border-border bg-white"}`}>{a}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">¿En qué te gustaría mejorar?</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {AREAS.map((a) => (
                  <button type="button" key={a} onClick={() => toggle("mejorar", a)} className={`rounded-full px-3 py-1.5 text-sm transition ${form.mejorar.includes(a) ? "bg-anima-blue text-white" : "border border-border bg-white"}`}>{a}</button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">¿Tenés perfil en LinkedIn?</label>
            <select value={form.tiene_linkedin} onChange={(e) => setForm({ ...form, tiene_linkedin: e.target.value })} className={input}>
              <option value="">Elegí una opción</option>
              <option>Sí</option><option>No</option><option>Lo tengo pero no lo uso</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">¿Tenés CV actualizado?</label>
            <select value={form.tiene_cv} onChange={(e) => setForm({ ...form, tiene_cv: e.target.value })} className={input}>
              <option value="">Elegí una opción</option>
              <option>Sí</option><option>No</option><option>Necesito ayuda para hacerlo</option>
            </select>
          </div>
          <div>
            <div className="text-sm font-medium">¿Tenés experiencia laboral previa?</div>
            <div className="mt-2 flex gap-2">
              {[["Sí", true],["No", false]].map(([label, val]) => (
                <button key={String(val)} type="button" onClick={() => setForm({ ...form, experiencia_previa: val as boolean })} className={`rounded-full px-4 py-1.5 text-sm transition ${form.experiencia_previa === val ? "bg-anima-blue text-white" : "border border-border bg-white"}`}>{label as string}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">¿Qué esperás del programa? (opcional)</label>
            <textarea rows={3} value={form.expectativas} onChange={(e) => setForm({ ...form, expectativas: e.target.value })} className={input} />
          </div>
          <button disabled={loading} className="w-full rounded-full bg-anima-blue px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? "Enviando…" : "Enviar encuesta"}</button>
        </form>
      </div>
    </div>
  );
}