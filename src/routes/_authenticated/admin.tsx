import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Users, Building2, GraduationCap, TrendingUp, Download, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Panel ÁNIMA · Academia" }] }),
  component: AdminPanel,
});

const NAV = [{ to: "/admin", label: "Panel ÁNIMA" }];

type Inscripcion = { id: string; full_name: string; email: string; status: string; vinculo: string; situacion: string; created_at: string };
type ParticipantRow = { user_id: string; etapa: string; situacion: string | null; vinculo: string | null; profile?: { full_name: string | null; email: string | null } };

function AdminPanel() {
  // Acceso libre temporal: cualquier visitante puede explorar el panel del Equipo ÁNIMA.
  const [tab, setTab] = useState<"metrics" | "inscripciones" | "participantes" | "empresas" | "talleres" | "publicar">("metrics");
  const [ins, setIns] = useState<Inscripcion[]>([]);
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [empresas, setEmpresas] = useState<{ id: string; nombre: string; rubro: string | null }[]>([]);
  const [opsCount, setOpsCount] = useState(0);
  const [insertados, setInsertados] = useState(0);

  async function load() {
    const [i, p, profs, e, o, ins2] = await Promise.all([
      supabase.from("inscripciones").select("*").order("created_at", { ascending: false }),
      supabase.from("participant_profiles").select("user_id,etapa,situacion,vinculo"),
      supabase.from("profiles").select("id,full_name,email"),
      supabase.from("empresas").select("id,nombre,rubro"),
      supabase.from("oportunidades").select("id", { count: "exact", head: true }).eq("status", "activa"),
      supabase.from("participant_profiles").select("user_id", { count: "exact", head: true }).eq("etapa", "insertado"),
    ]);
    setIns(i.data ?? []);
    const profMap = Object.fromEntries((profs.data ?? []).map((x) => [x.id, x]));
    setParticipants((p.data ?? []).map((x) => ({ ...x, profile: profMap[x.user_id] })));
    setEmpresas(e.data ?? []);
    setOpsCount(o.count ?? 0);
    setInsertados(ins2.count ?? 0);
  }
  useEffect(() => { void load(); }, []);

  async function actualizarInscripcion(id: string, status: "aprobada" | "rechazada") {
    const { error } = await supabase.from("inscripciones").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Actualizado"); load(); }
  }

  function exportCSV<T extends Record<string, unknown>>(rows: T[], filename: string) {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
  }

  return (
    <AppShell nav={NAV}>
      <h1 className="text-3xl font-bold">Panel ÁNIMA</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Participantes activos" value={`${participants.length} / 100`} tone="blue" />
        <Stat icon={Building2} label="Empresas registradas" value={String(empresas.length)} tone="teal" />
        <Stat icon={GraduationCap} label="Oportunidades activas" value={String(opsCount)} tone="lime" />
        <Stat icon={TrendingUp} label="Insertados/as" value={String(insertados)} tone="blue" />
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-border">
        {(["metrics","inscripciones","participantes","empresas","talleres","publicar"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold capitalize ${tab === t ? "border-anima-blue text-anima-blue" : "border-transparent text-muted-foreground hover:text-anima-ink"}`}>
            {t === "metrics" ? "Métricas" : t === "publicar" ? "Publicar oportunidad" : t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "metrics" && (
          <div className="rounded-2xl bg-white p-6 shadow-sm text-sm text-muted-foreground">
            <p>Vista resumida arriba. Próximamente: gráficos de satisfacción por taller, evolución de inscripciones y tasa de inserción detallada.</p>
          </div>
        )}

        {tab === "inscripciones" && (
          <div className="rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-bold">Inscripciones recibidas ({ins.length})</h2>
              <button onClick={() => exportCSV(ins, "inscripciones.csv")} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm"><Download className="h-4 w-4" />Exportar CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs uppercase text-muted-foreground"><tr><th className="p-3">Nombre</th><th className="p-3">Email</th><th className="p-3">Vínculo</th><th className="p-3">Situación</th><th className="p-3">Estado</th><th className="p-3">Acciones</th></tr></thead>
                <tbody>
                  {ins.map((r) => (
                    <tr key={r.id} className="border-t border-border">
                      <td className="p-3 font-medium">{r.full_name}</td>
                      <td className="p-3 text-muted-foreground">{r.email}</td>
                      <td className="p-3 text-xs">{r.vinculo}</td>
                      <td className="p-3 text-xs">{r.situacion}</td>
                      <td className="p-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.status === "aprobada" ? "bg-anima-teal/10 text-anima-teal" : r.status === "rechazada" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>{r.status}</span></td>
                      <td className="p-3 text-xs">
                        {r.status === "pendiente" && (
                          <div className="flex gap-2">
                            <button onClick={() => actualizarInscripcion(r.id, "aprobada")} className="rounded-full bg-anima-teal px-2.5 py-1 text-white">Aprobar</button>
                            <button onClick={() => actualizarInscripcion(r.id, "rechazada")} className="rounded-full border border-border px-2.5 py-1">Rechazar</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "participantes" && (
          <div className="rounded-2xl bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border p-4">
              <h2 className="font-bold">Participantes ({participants.length})</h2>
              <button onClick={() => exportCSV(participants.map((p) => ({ nombre: p.profile?.full_name, email: p.profile?.email, etapa: p.etapa, situacion: p.situacion, vinculo: p.vinculo })), "participantes.csv")} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm"><Download className="h-4 w-4" />Exportar CSV</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted text-left text-xs uppercase text-muted-foreground"><tr><th className="p-3">Nombre</th><th className="p-3">Email</th><th className="p-3">Etapa</th><th className="p-3">Situación</th></tr></thead>
                <tbody>
                  {participants.map((p) => (
                    <tr key={p.user_id} className="border-t border-border">
                      <td className="p-3 font-medium">{p.profile?.full_name ?? "—"}</td>
                      <td className="p-3 text-muted-foreground">{p.profile?.email ?? "—"}</td>
                      <td className="p-3 text-xs">{p.etapa}</td>
                      <td className="p-3 text-xs">{p.situacion ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "empresas" && (
          <div className="rounded-2xl bg-white shadow-sm">
            <div className="border-b border-border p-4"><h2 className="font-bold">Empresas ({empresas.length})</h2></div>
            <div className="divide-y divide-border">
              {empresas.map((e) => (<div key={e.id} className="flex items-center justify-between p-4"><div><div className="font-semibold">{e.nombre}</div><div className="text-xs text-muted-foreground">{e.rubro}</div></div></div>))}
              {empresas.length === 0 && <div className="p-6 text-sm text-muted-foreground">Aún no hay empresas registradas.</div>}
            </div>
          </div>
        )}

        {tab === "talleres" && <TalleresTab />}
        {tab === "publicar" && <PublicarTab empresas={empresas} onPublicado={load} />}
      </div>
    </AppShell>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone: "blue" | "teal" | "lime" }) {
  const bg = tone === "blue" ? "bg-anima-blue text-white" : tone === "teal" ? "bg-anima-teal text-white" : "bg-anima-lime text-anima-ink";
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}><Icon className="h-5 w-5" /></div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function TalleresTab() {
  const [talleres, setTalleres] = useState<{ id: string; nombre: string; carga_horaria: number; modalidad: string }[]>([]);
  const [insc, setInsc] = useState<{ taller_id: string; user_id: string }[]>([]);
  useEffect(() => {
    supabase.from("talleres").select("id,nombre,carga_horaria,modalidad").then(({ data }) => setTalleres(data ?? []));
    supabase.from("taller_inscripciones").select("taller_id,user_id").then(({ data }) => setInsc(data ?? []));
  }, []);
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="font-bold">Talleres</h2>
      <div className="mt-4 grid gap-3">
        {talleres.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-xl border border-border p-3">
            <div><div className="font-semibold text-sm">{t.nombre}</div><div className="text-xs text-muted-foreground capitalize">{t.modalidad} · {t.carga_horaria}h</div></div>
            <span className="text-sm font-semibold text-anima-blue">{insc.filter((i) => i.taller_id === t.id).length} inscriptos</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PublicarTab({ empresas, onPublicado }: { empresas: { id: string; nombre: string; rubro: string | null }[]; onPublicado: () => void }) {
  const [form, setForm] = useState({ empresa_id: "", titulo: "", descripcion: "", requisitos: "", area: "", modalidad: "hibrida", nivel_experiencia: "", remuneracion: "", fecha_limite: "" });
  const [saving, setSaving] = useState(false);
  const input = "mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm";
  async function publicar() {
    if (!form.empresa_id || !form.titulo) { toast.error("Empresa y título son obligatorios"); return; }
    setSaving(true);
    const { error } = await supabase.from("oportunidades").insert({
      empresa_id: form.empresa_id,
      titulo: form.titulo,
      descripcion: form.descripcion || null,
      requisitos: form.requisitos || null,
      area: form.area || null,
      modalidad: (form.modalidad || null) as "presencial" | "virtual" | "hibrida" | null,
      nivel_experiencia: form.nivel_experiencia || null,
      remuneracion: form.remuneracion || null,
      fecha_limite: form.fecha_limite || null,
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else { toast.success("¡Oportunidad publicada!"); setForm({ empresa_id: "", titulo: "", descripcion: "", requisitos: "", area: "", modalidad: "hibrida", nivel_experiencia: "", remuneracion: "", fecha_limite: "" }); onPublicado(); }
  }
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2"><Plus className="h-5 w-5 text-anima-blue" /><h2 className="font-bold">Publicar oportunidad en nombre de una empresa aliada</h2></div>
      <p className="mt-1 text-sm text-muted-foreground">El equipo ÁNIMA puede cargar vacantes para acelerar la vinculación con participantes.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><label className="text-sm font-medium">Empresa *</label><select className={input} value={form.empresa_id} onChange={(e) => setForm({ ...form, empresa_id: e.target.value })}><option value="">Seleccionar empresa…</option>{empresas.map((e) => (<option key={e.id} value={e.id}>{e.nombre}</option>))}</select></div>
        <div className="sm:col-span-2"><label className="text-sm font-medium">Título *</label><input className={input} value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className="text-sm font-medium">Descripción</label><textarea rows={3} className={input} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className="text-sm font-medium">Requisitos</label><textarea rows={2} className={input} value={form.requisitos} onChange={(e) => setForm({ ...form, requisitos: e.target.value })} /></div>
        <div><label className="text-sm font-medium">Área</label><input className={input} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} /></div>
        <div><label className="text-sm font-medium">Modalidad</label><select className={input} value={form.modalidad} onChange={(e) => setForm({ ...form, modalidad: e.target.value })}><option value="presencial">Presencial</option><option value="virtual">Virtual</option><option value="hibrida">Híbrida</option></select></div>
        <div><label className="text-sm font-medium">Nivel de experiencia</label><input className={input} value={form.nivel_experiencia} onChange={(e) => setForm({ ...form, nivel_experiencia: e.target.value })} /></div>
        <div><label className="text-sm font-medium">Remuneración</label><input className={input} value={form.remuneracion} onChange={(e) => setForm({ ...form, remuneracion: e.target.value })} /></div>
        <div><label className="text-sm font-medium">Fecha límite</label><input type="date" className={input} value={form.fecha_limite} onChange={(e) => setForm({ ...form, fecha_limite: e.target.value })} /></div>
        <button onClick={publicar} disabled={saving} className="rounded-full bg-anima-blue px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60 sm:col-span-2 sm:w-fit">{saving ? "Publicando…" : "Publicar oportunidad"}</button>
      </div>
    </div>
  );
}