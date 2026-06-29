import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Briefcase } from "lucide-react";

export const Route = createFileRoute("/_authenticated/oportunidades")({
  head: () => ({ meta: [{ title: "Oportunidades laborales · Academia" }] }),
  component: Oportunidades,
});

const NAV = [
  { to: "/perfil", label: "Mi perfil" },
  { to: "/mis-talleres", label: "Talleres" },
  { to: "/oportunidades", label: "Oportunidades" },
];

type Op = { id: string; titulo: string; descripcion: string | null; requisitos: string | null; modalidad: string | null; area: string | null; nivel_experiencia: string | null; remuneracion: string | null; fecha_limite: string | null; empresa_id: string };
type Empresa = { id: string; nombre: string };
type Postul = { oportunidad_id: string; estado: string };

function Oportunidades() {
  const { user } = useSession();
  const [ops, setOps] = useState<Op[]>([]);
  const [emp, setEmp] = useState<Record<string, Empresa>>({});
  const [mine, setMine] = useState<Postul[]>([]);
  const [filter, setFilter] = useState("");

  async function load() {
    const [o, e, p] = await Promise.all([
      supabase.from("oportunidades").select("*").eq("status", "activa").order("created_at", { ascending: false }),
      supabase.from("empresas").select("id,nombre"),
      user ? supabase.from("postulaciones").select("oportunidad_id,estado").eq("user_id", user.id) : Promise.resolve({ data: [] as Postul[] }),
    ]);
    setOps(o.data ?? []);
    setEmp(Object.fromEntries((e.data ?? []).map((x) => [x.id, x])));
    setMine((p as { data: Postul[] }).data ?? []);
  }
  useEffect(() => { void load(); }, [user]);

  async function postular(opId: string) {
    if (!user) return;
    const { error } = await supabase.from("postulaciones").insert({ oportunidad_id: opId, user_id: user.id });
    if (error) toast.error(error.message); else { toast.success("¡Postulación enviada!"); load(); }
  }

  const filtered = ops.filter((o) => !filter || o.titulo.toLowerCase().includes(filter.toLowerCase()) || (o.area ?? "").toLowerCase().includes(filter.toLowerCase()));

  return (
    <AppShell nav={NAV}>
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Oportunidades laborales</h1>
            <p className="mt-1 text-muted-foreground">Postulate con un clic usando tu perfil cargado.</p>
          </div>
          <input placeholder="Buscar por título o área…" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm sm:w-72" />
        </div>
        <div className="mt-8 space-y-4">
          {filtered.length === 0 && <p className="rounded-2xl border border-dashed border-border bg-white p-8 text-center text-muted-foreground">Todavía no hay oportunidades. ¡Pronto se publicarán nuevas!</p>}
          {filtered.map((o) => {
            const mineP = mine.find((m) => m.oportunidad_id === o.id);
            return (
              <article key={o.id} className="rounded-2xl border border-border bg-white p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wider text-anima-teal">{emp[o.empresa_id]?.nombre ?? "Empresa"}</div>
                    <h3 className="mt-1 text-xl font-bold">{o.titulo}</h3>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {o.area && <span className="rounded-full bg-muted px-2.5 py-1">{o.area}</span>}
                      {o.modalidad && <span className="rounded-full bg-muted px-2.5 py-1 capitalize">{o.modalidad}</span>}
                      {o.nivel_experiencia && <span className="rounded-full bg-muted px-2.5 py-1">{o.nivel_experiencia}</span>}
                    </div>
                    {o.descripcion && <p className="mt-3 text-sm text-muted-foreground">{o.descripcion}</p>}
                  </div>
                  <div className="shrink-0">
                    {mineP ? (
                      <span className="inline-flex rounded-full bg-anima-blue/10 px-3 py-1.5 text-xs font-semibold text-anima-blue capitalize">{mineP.estado.replace("_", " ")}</span>
                    ) : (
                      <button onClick={() => postular(o.id)} className="inline-flex items-center gap-2 rounded-full bg-anima-blue px-4 py-2 text-sm font-semibold text-white"><Briefcase className="h-4 w-4" />Postularme</button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}