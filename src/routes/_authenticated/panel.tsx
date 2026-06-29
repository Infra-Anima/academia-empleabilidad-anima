import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useSession, useUserRoles } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/panel")({
  head: () => ({ meta: [{ title: "Mi panel · Academia" }] }),
  component: PanelDispatcher,
});

function PanelDispatcher() {
  const { user, loading } = useSession();
  const { roles, loading: rolesLoading, isCompany, isTeam } = useUserRoles(user?.id);
  const navigate = useNavigate();
  useEffect(() => {
    if (loading || rolesLoading) return;
    if (isTeam) navigate({ to: "/admin" });
    else if (isCompany) navigate({ to: "/empresa" });
    else navigate({ to: "/perfil" });
  }, [loading, rolesLoading, isTeam, isCompany, navigate, roles]);
  return <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">Cargando tu panel…</div>;
}