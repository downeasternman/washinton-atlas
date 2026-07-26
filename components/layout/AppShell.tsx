import { Header } from "./Header";
import { AtlasMap } from "@/components/map/AtlasMap";

export function AppShell() {
  return (
    <div className="flex h-screen flex-col atlas-chrome-bg">
      <Header />
      <main className="map-container flex flex-1 flex-col">
        <AtlasMap />
      </main>
    </div>
  );
}
