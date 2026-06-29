import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ReactNode } from "react";
import animaLogo from "@/assets/anima-logo.png.asset.json";
import embassy from "@/assets/us-embassy.jpg.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";

export function AppShell({ nav, children }: { nav: { to: string; label: string }[]; children: ReactNode }) {
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={animaLogo.url} alt="ÁNIMA" className="h-8 w-auto" />
            <span className="hidden text-sm font-semibold text-anima-ink/70 sm:inline">Academia de Empleabilidad</span>
          </Link>
          <nav className="hidden gap-1 md:flex">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? "bg-anima-blue text-white" : "text-anima-ink/70 hover:bg-muted"}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-anima-ink/80 hover:bg-muted"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
        <div className="border-t border-border md:hidden">
          <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-2 py-2">
            {nav.map((n) => {
              const active = path === n.to;
              return (
                <Link key={n.to} to={n.to} className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium ${active ? "bg-anima-blue text-white" : "text-anima-ink/70"}`}>
                  {n.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      <footer className="border-t border-border bg-white py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:px-6">
          <span>© {new Date().getFullYear()} ÁNIMA Formación Dual</span>
          <div className="flex items-center gap-2">
            <span>Financiado por</span>
            <img src={embassy.url} alt="U.S. Embassy Montevideo" className="h-7 w-auto" />
          </div>
        </div>
      </footer>
    </div>
  );
}