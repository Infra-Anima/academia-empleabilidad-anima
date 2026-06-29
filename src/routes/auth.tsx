import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import animaLogo from "@/assets/anima-logo.png.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Ingresar · Academia de Empleabilidad" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin + "/panel",
          },
        });
        if (error) throw error;
        toast.success("¡Listo! Revisá tu correo para confirmar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/panel" });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Algo salió mal");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/panel" });
    if (result.error) toast.error("No se pudo iniciar sesión con Google");
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-anima-blue p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/"><img src={animaLogo.url} alt="ÁNIMA" className="h-10 w-auto brightness-0 invert" /></Link>
        <div>
          <h1 className="text-4xl font-bold leading-tight">Academia de Empleabilidad</h1>
          <p className="mt-4 max-w-md text-white/80">Tu espacio para formarte, conectar con empresas y dar el próximo paso laboral.</p>
        </div>
        <div className="text-sm text-white/60">© {new Date().getFullYear()} ÁNIMA</div>
      </div>
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden"><img src={animaLogo.url} alt="ÁNIMA" className="mb-8 h-10 w-auto" /></Link>
          <h2 className="text-3xl font-bold">{mode === "login" ? "Ingresar" : "Crear cuenta"}</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login" ? "Bienvenido/a de vuelta a la Academia." : "Sumate a la Academia y empezá tu camino."}
          </p>

          <button
            onClick={handleGoogle}
            type="button"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold transition hover:bg-muted"
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.6z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.34 0-4.32-1.58-5.03-3.7H.95v2.33A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.95A8.99 8.99 0 0 0 0 9c0 1.45.35 2.83.95 4.05l3.02-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 .95 4.95l3.02 2.33C4.68 5.16 6.66 3.58 9 3.58z"/></svg>
            Continuar con Google
          </button>

          <div className="my-6 flex items-center gap-3 text-xs uppercase text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> o con email <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-medium">Nombre completo</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-anima-blue focus:ring-2 focus:ring-anima-blue/20" />
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-anima-blue focus:ring-2 focus:ring-anima-blue/20" />
            </div>
            <div>
              <label className="text-sm font-medium">Contraseña</label>
              <input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-anima-blue focus:ring-2 focus:ring-anima-blue/20" />
            </div>
            <button disabled={loading} type="submit" className="w-full rounded-xl bg-anima-blue px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60">
              {loading ? "Procesando…" : mode === "login" ? "Ingresar" : "Crear cuenta"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "¿Aún no tenés cuenta?" : "¿Ya tenés cuenta?"}{" "}
            <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-semibold text-anima-blue hover:underline">
              {mode === "login" ? "Crear cuenta" : "Ingresar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}