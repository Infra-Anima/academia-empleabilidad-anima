import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/mis-talleres")({
  head: () => ({ meta: [{ title: "Mis talleres · Academia" }] }),
  component: MisTalleres,
});

const NAV = [
  { to: "/perfil", label: "Mi perfil" },
  { to: "/mis-talleres", label: "Talleres" },
  { to: "/oportunidades", label: "Oportunidades" },
];

type Taller = { id: string; nombre: string; tematicas: string | null; profesional: string | null; modalidad: string; carga_horaria: number };
type Insc = { taller_id: string; estado: string; horas_completadas: number };

function MisTalleres() {
  const { user } = useSession();
  const [talleres, setTalleres] = useState<Taller[]>([]);
  const [insc, setInsc] = useState<Insc[]>([]);

  async function load() {
    if (!user) return;
    const [t, i] = await Promise.all([
      supabase.from("talleres").select("*").eq("activo", true),
      supabase.from("taller_inscripciones").select("taller_id,estado,horas_completadas").eq("user_id", user.id),
    ]);
    setTalleres(t.data ?? []);
    setInsc(i.data ?? []);
  }
  useEffect(() => { void load(); }, [user]);

  async function inscribir(id: string) {
    if (!user) return;
    const { error } = await supabase.from("taller_inscripciones").insert({ taller_id: id, user_id: user.id });
    if (error) toast.error("No se pudo inscribir"); else { toast.success("¡Inscripción confirmada!"); load(); }
  }

  const horas = insc.reduce((s, i) => s + i.horas_completadas, 0);
  const pct = Math.min(100, Math.round((horas / 30) * 100));

  return (
    <AppShell nav={NAV}>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">Itinerario de formación</h1>
        <div className="mt-6 rounded-2xl bg-anima-blue p-6 text-white">
          <div className="flex items-baseline justify-between">
            <div><div className="text-xs uppercase tracking-wider text-anima-lime">Tu progreso</div><div className="mt-1 text-2xl font-bold">{horas} / 30 horas</div></div>
            <div className="text-sm text-white/80">{pct}%</div>
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/20"><div className="h-full bg-anima-lime transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {talleres.map((t) => {
            const mine = insc.find((i) => i.taller_id === t.id);
            return (
              <article key={t.id} className="rounded-2xl border border-border bg-white p-5">
                <h3 className="text-lg font-bold leading-snug">{t.nombre}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.tematicas}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{t.carga_horaria}h · {t.modalidad}</div>
                <div className="mt-4 flex items-center justify-between">
                  {mine ? (
                    <span className="rounded-full bg-anima-teal/10 px-3 py-1 text-xs font-semibold text-anima-teal capitalize">{mine.estado.replace("_", " ")} · {mine.horas_completadas}h</span>
                  ) : (
                    <button onClick={() => inscribir(t.id)} className="rounded-full bg-anima-blue px-4 py-1.5 text-xs font-semibold text-white">Inscribirme</button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}