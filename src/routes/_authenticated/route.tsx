import { createFileRoute, Outlet } from "@tanstack/react-router";

// Auth temporalmente desactivada: los paneles son accesibles sin login para exploración.
// El diseño del login se mantiene en /auth como referencia visual.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: () => <Outlet />,
});