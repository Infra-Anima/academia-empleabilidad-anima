import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/perfil")({
  head: () => ({ meta: [{ title: "Mi perfil · Academia" }] }),
  component: PerfilPage,
});

const PARTICIPANT_NAV = [
  { to: "/perfil", label: "Mi perfil" },
  { to: "/mis-talleres", label: "Talleres" },
  { to: "/oportunidades", label: "Oportunidades" },
];

function PerfilPage() {
  const { user } = useSession();
  const [profile, setProfile] = useState({ full_name: "", phone: "" });
  const [pp, setPp] = useState({ formacion: "", experiencia: "", competencias_tecnicas: "", competencias_transversales: "", cv_url: "", linkedin_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name,phone").eq("id", user.id).maybeSingle().then(({ data }) => {
      if (data) setProfile({ full_name: data.full_name ?? "", phone: data.phone ?? "" });
    });
    supabase.from("participant_profiles").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) setPp({
        formacion: data.formacion ?? "",
        experiencia: data.experiencia ?? "",
        competencias_tecnicas: data.competencias_tecnicas ?? "",
        competencias_transversales: data.competencias_transversales ?? "",
        cv_url: data.cv_url ?? "",
        linkedin_url: data.linkedin_url ?? "",
      });
    });
  }, [user]);

  async function save() {
    if (!user) return;
    setSaving(true);
    const a = await supabase.from("profiles").update(profile).eq("id", user.id);
    const b = await supabase.from("participant_profiles").upsert({ user_id: user.id, ...pp });
    setSaving(false);
    if (a.error || b.error) toast.error("No se pudo guardar");
    else toast.success("¡Perfil actualizado!");
  }

  const input = "mt-1 w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm";
  return (
    <AppShell nav={PARTICIPANT_NAV}>
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Mi perfil profesional</h1>
        <p className="mt-2 text-muted-foreground">Mantené tu información al día para postularte a oportunidades.</p>
        <div className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Nombre completo</label><input className={input} value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Teléfono</label><input className={input} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
          </div>
          <div><label className="text-sm font-medium">Formación</label><textarea rows={3} className={input} value={pp.formacion} onChange={(e) => setPp({ ...pp, formacion: e.target.value })} /></div>
          <div><label className="text-sm font-medium">Experiencia laboral</label><textarea rows={3} className={input} value={pp.experiencia} onChange={(e) => setPp({ ...pp, experiencia: e.target.value })} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Competencias técnicas</label><textarea rows={3} className={input} value={pp.competencias_tecnicas} onChange={(e) => setPp({ ...pp, competencias_tecnicas: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Competencias transversales</label><textarea rows={3} className={input} value={pp.competencias_transversales} onChange={(e) => setPp({ ...pp, competencias_transversales: e.target.value })} /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="text-sm font-medium">Link a tu CV</label><input className={input} placeholder="https://…" value={pp.cv_url} onChange={(e) => setPp({ ...pp, cv_url: e.target.value })} /></div>
            <div><label className="text-sm font-medium">LinkedIn</label><input className={input} placeholder="https://linkedin.com/in/…" value={pp.linkedin_url} onChange={(e) => setPp({ ...pp, linkedin_url: e.target.value })} /></div>
          </div>
          <button onClick={save} disabled={saving} className="rounded-full bg-anima-blue px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Guardando…" : "Guardar cambios"}</button>
        </div>
      </div>
    </AppShell>
  );
}