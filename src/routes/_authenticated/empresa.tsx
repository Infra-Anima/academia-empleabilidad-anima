import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Plus, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/empresa")({
  head: () => ({ meta: [{ title: "Panel empresa · Academia" }] }),
  component: EmpresaPanel,
});

const NAV = [{ to: "/empresa", label: "Mi empresa" }];

type Empresa = { id: string; nombre: string; rubro: string | null; descripcion: string | null; contacto: string | null; sitio_web: string | null };
type Op = { id: string; titulo: string; descripcion: string | null; modalidad: string | null; status: string; created_at: string };
type Post = { id: string; estado: string; user_id: string; oportunidad_id: string; profile?: { full_name: string | null; email: string | null } };

function EmpresaPanel() {
  const { user } = useSession();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [form, setForm] = useState({ nombre: "", rubro: "", descripcion: "", contacto: "", sitio_web: "" });
  const [ops, setOps] = useState<Op[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [newOp, setNewOp] = useState({ titulo: "", descripcion: "", requisitos: "", area: "", modalidad: "hibrida", nivel_experiencia: "", remuneracion: "", fecha_limite: "" });
  const [showOp, setShowOp] = useState(false);

  async function load() {
    if (!user) return;
    const { data: e } = await supabase.from("empresas").select("*").eq("user_id", user.id).maybeSingle();
    setEmpresa(e);
    if (e) {
      setForm({ nombre: e.nombre, rubro: e.rubro ?? "", descripcion: e.descripcion ?? "", contacto: e.contacto ?? "", sitio_web: e.sitio_web ?? "" });
      const { data: o } = await supabase.from("oportunidades").select("*").eq("empresa_id", e.id).order("created_at", { ascending: false });
      setOps(o ?? []);
      const opIds = (o ?? []).map((x) => x.id);
      if (opIds.length) {
        const { data: p } = await supabase.from("postulaciones").select("id,estado,user_id,oportunidad_id").in("oportunidad_id", opIds);
        const userIds = [...new Set((p ?? []).map((x) => x.user_id))];
        const { data: profs } = userIds.length ? await supabase.from("profiles").select("id,full_name,email").in("id", userIds) : { data: [] as { id: string; full_name: string | null; email: string | null }[] };
        const profMap = Object.fromEntries((profs ?? []).map((x) => [x.id, x]));
        setPosts((p ?? []).map((x) => ({ ...x, profile: profMap[x.user_id] })));
      }
    }
  }
  useEffect(() => { void load(); }, [user]);

  async function saveEmpresa() {
    if (!user) return;
    if (empresa) {
      const { error } = await supabase.from("empresas").update(form).eq("id", empresa.id);
      if (error) toast.error(error.message); else { toast.success("Perfil actualizado"); load(); }
    } else {
      // Necesita rol company. Si no lo tiene, le agregamos uno (esto debería gestionar el equipo idealmente)
      await supabase.from("user_roles").insert({ user_id: user.id, role: "company" });
      const { error } = await supabase.from("empresas").insert({ ...form, user_id: user.id });
      if (error) toast.error(error.message); else { toast.success("¡Empresa creada!"); load(); }
    }
  }

  async function publicar() {
    if (!empresa) return;
    const { error } = await supabase.from("oportunidades").insert({
      empresa_id: empresa.id,
      titulo: newOp.titulo,
      descripcion: newOp.descripcion || null,
      requisitos: newOp.requisitos || null,
      area: newOp.area || null,
      modalidad: (newOp.modalidad || null) as "presencial" | "virtual" | "hibrida" | null,
      nivel_experiencia: newOp.nivel_experiencia || null,
      remuneracion: newOp.remuneracion || null,
      fecha_limite: newOp.fecha_limite || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Oportunidad publicada"); setShowOp(false); setNewOp({ titulo: "", descripcion: "", requisitos: "", area: "", modalidad: "hibrida", nivel_experiencia: "", remuneracion: "", fecha_limite: "" }); load(); }
  }

  async function updatePost(id: string, estado: Post["estado"]) {
    const { error } = await supabase.from("postulaciones").update({ estado: estado as never }).eq("id", id);
    if (error) toast.error(error.message); else load();
  }

  const input = "mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm";

  return (
    <AppShell nav={NAV}>
      <div className="mx-auto max-w-5xl space-y-10">
        <section>
          <h1 className="text-3xl font-bold">Perfil de empresa</h1>
          <div className="mt-4 grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
            <div><label className="text-sm font-medium">Nombre *</label><input className={input} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Rubro</label><input className={input} value={form.rubro} onChange={(e) => setForm({ ...form, rubro: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className="text-sm font-medium">Descripción</label><textarea rows={3} className={input} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Contacto</label><input className={input} value={form.contacto} onChange={(e) => setForm({ ...form, contacto: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Sitio web</label><input className={input} value={form.sitio_web} onChange={(e) => setForm({ ...form, sitio_web: e.target.value })} /></div>
            <button onClick={saveEmpresa} className="rounded-full bg-anima-blue px-6 py-2.5 text-sm font-semibold text-white sm:col-span-2 sm:w-fit">{empresa ? "Guardar cambios" : "Crear empresa"}</button>
          </div>
        </section>

        {empresa && (
          <>
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Mis oportunidades</h2>
                <button onClick={() => setShowOp(!showOp)} className="inline-flex items-center gap-2 rounded-full bg-anima-blue px-4 py-2 text-sm font-semibold text-white"><Plus className="h-4 w-4" />Publicar oportunidad</button>
              </div>
              {showOp && (
                <div className="mt-4 grid gap-4 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2">
                  <div className="sm:col-span-2"><label className="text-sm font-medium">Título *</label><input className={input} value={newOp.titulo} onChange={(e) => setNewOp({ ...newOp, titulo: e.target.value })} /></div>
                  <div className="sm:col-span-2"><label className="text-sm font-medium">Descripción</label><textarea rows={3} className={input} value={newOp.descripcion} onChange={(e) => setNewOp({ ...newOp, descripcion: e.target.value })} /></div>
                  <div className="sm:col-span-2"><label className="text-sm font-medium">Requisitos</label><textarea rows={2} className={input} value={newOp.requisitos} onChange={(e) => setNewOp({ ...newOp, requisitos: e.target.value })} /></div>
                  <div><label className="text-sm font-medium">Área</label><input className={input} value={newOp.area} onChange={(e) => setNewOp({ ...newOp, area: e.target.value })} /></div>
                  <div><label className="text-sm font-medium">Modalidad</label><select className={input} value={newOp.modalidad} onChange={(e) => setNewOp({ ...newOp, modalidad: e.target.value })}><option value="presencial">Presencial</option><option value="virtual">Virtual</option><option value="hibrida">Híbrida</option></select></div>
                  <div><label className="text-sm font-medium">Nivel de experiencia</label><input className={input} value={newOp.nivel_experiencia} onChange={(e) => setNewOp({ ...newOp, nivel_experiencia: e.target.value })} /></div>
                  <div><label className="text-sm font-medium">Remuneración (opcional)</label><input className={input} value={newOp.remuneracion} onChange={(e) => setNewOp({ ...newOp, remuneracion: e.target.value })} /></div>
                  <div><label className="text-sm font-medium">Fecha límite</label><input type="date" className={input} value={newOp.fecha_limite} onChange={(e) => setNewOp({ ...newOp, fecha_limite: e.target.value })} /></div>
                  <button onClick={publicar} className="rounded-full bg-anima-teal px-6 py-2.5 text-sm font-semibold text-white sm:col-span-2 sm:w-fit">Publicar</button>
                </div>
              )}
              <div className="mt-6 space-y-3">
                {ops.map((o) => (
                  <div key={o.id} className="flex items-center justify-between rounded-2xl border border-border bg-white p-4">
                    <div><div className="font-semibold">{o.titulo}</div><div className="text-xs text-muted-foreground capitalize">{o.modalidad} · {o.status}</div></div>
                    <span className="text-sm text-muted-foreground">{posts.filter((p) => p.oportunidad_id === o.id).length} postulaciones</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold">Postulaciones recibidas</h2>
              <div className="mt-4 space-y-3">
                {posts.length === 0 && <p className="rounded-2xl border border-dashed border-border bg-white p-6 text-sm text-muted-foreground">Aún no hay postulaciones.</p>}
                {posts.map((p) => {
                  const op = ops.find((o) => o.id === p.oportunidad_id);
                  return (
                    <div key={p.id} className="rounded-2xl border border-border bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-anima-blue/10 text-anima-blue"><Users className="h-5 w-5" /></div>
                          <div>
                            <div className="font-semibold">{p.profile?.full_name ?? p.profile?.email ?? "Participante"}</div>
                            <div className="text-xs text-muted-foreground">Postulación a “{op?.titulo}”</div>
                          </div>
                        </div>
                        <select value={p.estado} onChange={(e) => updatePost(p.id, e.target.value)} className="rounded-xl border border-border bg-white px-3 py-1.5 text-sm">
                          <option value="enviada">Enviada</option><option value="en_revision">En revisión</option><option value="entrevista">Entrevista agendada</option><option value="seleccionado">Seleccionado/a</option><option value="no_avanza">No avanza</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </AppShell>
  );
}