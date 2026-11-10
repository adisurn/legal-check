import { createFileRoute } from "@tanstack/react-router";
import { PlatformApp } from "../components/platform/platform-app";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    view: typeof search.view === "string" ? search.view : "overview",
  }),
  component: Home,
});

function Home() {
  const { view } = Route.useSearch();
  return <PlatformApp view={view} />;
}
