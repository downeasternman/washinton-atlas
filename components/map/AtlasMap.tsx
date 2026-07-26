"use client";

import { useEffect, useMemo, useState } from "react";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import Map, { NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { WASHINGTON_COUNTY_BBOX } from "@/lib/geo/county";
import { bboxToFitBounds } from "@/lib/geo/bbox";
import { buildAtlasStyle } from "@/lib/map/style";
import { MapAttribution } from "./MapAttribution";

let protocolRegistered = false;

function ensurePmtilesProtocol() {
  if (protocolRegistered || typeof window === "undefined") return;
  const protocol = new Protocol();
  maplibregl.addProtocol("pmtiles", protocol.tile);
  protocolRegistered = true;
}

export function AtlasMap() {
  const [asOfDate, setAsOfDate] = useState<string | null>(null);
  const [origin, setOrigin] = useState<string | null>(null);

  useEffect(() => {
    ensurePmtilesProtocol();
    setOrigin(window.location.origin);
    fetch("/api/meta/map-sources")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { asOfDate?: string } | null) => {
        if (data?.asOfDate) setAsOfDate(data.asOfDate);
      })
      .catch(() => {
        // optional metadata endpoint
      });
  }, []);

  const style = useMemo(
    () => (origin ? buildAtlasStyle(origin) : null),
    [origin],
  );
  const initialBounds = useMemo(
    () => bboxToFitBounds(WASHINGTON_COUNTY_BBOX),
    [],
  );

  if (!style) {
    return (
      <div className="relative flex h-full w-full items-center justify-center bg-[var(--color-ocean-deep)] text-[var(--color-text-inverse)]">
        Loading map…
      </div>
    );
  }

  return (
    <div className="relative h-full w-full motion-fade-in">
      <Map
        initialViewState={{
          bounds: initialBounds,
          fitBoundsOptions: { padding: 40 },
        }}
        style={{ width: "100%", height: "100%" }}
        mapStyle={style}
        attributionControl={false}
      >
        <NavigationControl position="top-right" showCompass={false} />
      </Map>
      <MapAttribution asOfDate={asOfDate} />
    </div>
  );
}
