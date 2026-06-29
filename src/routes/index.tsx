import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing/Landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Academia de Empleabilidad · ÁNIMA" },
      { name: "description", content: "Itinerarios formativos, acompañamiento e intermediación para la inserción y reconversión laboral de jóvenes y adultos en Uruguay." },
      { property: "og:title", content: "Academia de Empleabilidad · ÁNIMA" },
      { property: "og:description", content: "Formación profesional, talleres y oportunidades laborales reales junto a empresas aliadas." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Landing />;
}
