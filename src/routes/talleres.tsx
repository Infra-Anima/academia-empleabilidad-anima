import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import animaLogo from "@/assets/anima-logo.png.asset.json";
import { Clock, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/talleres")({
  head: () => ({ meta: [{ title: "Itinerario formativo · Academia" }] }),
  component: TalleresPublic,
});

type Taller = { id: string; nombre: string; tematicas: string | null; profesional: string | null; modalidad: string; carga_horaria: number; descripcion: string | null };

function TalleresPublic() {
  const [talleres, setTalleres] = useState<Taller[]>([]);
  useEffect(() => {
    supabase.from("talleres").select("*").eq("activo", true).order("created_at").then(({ data }) => setTalleres(data ?? []));
  }, []);
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/"><img src={animaLogo.url} alt="ÁNIMA" className="h-9 w-auto" /></Link>
          <Link to="/inscripcion" className="rounded-full bg-anima-blue px-4 py-2 text-sm font-semibold text-white">Quiero participar</Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-sm font-semibold uppercase tracking-wider text-anima-teal">Itinerario formativo</div>
          <h1 className="mt-2 text-4xl font-bold">Catálogo de talleres</h1>
          <p className="mt-3 text-muted-foreground">Cursos y talleres orientados al desarrollo de competencias laborales que buscan las empresas. Preinscribite a los abiertos o próximos a abrir.</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {talleres.map((t) => (
            <article key={t.id} className="flex flex-col rounded-2xl border border-border bg-white p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-anima-lime text-anima-ink"><GraduationCap className="h-5 w-5" /></div>
              <h3 className="mt-4 text-lg font-bold leading-snug">{t.nombre}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.tematicas}</p>
              <div className="mt-4 space-y-1.5 text-sm">
                <div><span className="font-semibold">A cargo de:</span> {t.profesional}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{t.carga_horaria}h · {t.modalidad}</div>
              </div>
              <Link to="/inscripcion" className="mt-6 inline-flex rounded-full bg-anima-blue px-4 py-2 text-sm font-semibold text-white">Inscribirme</Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}