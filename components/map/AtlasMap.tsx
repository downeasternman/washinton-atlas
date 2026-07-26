"use client";

import Map, { NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { WASHINGTON_COUNTY_BBOX } from "@/lib/geo/county";
import { bboxToFitBounds } from "@/lib/geo/bbox";
import { buildAtlasStyle } from "@/lib/map/style";

export function AtlasMap() {
  const style = buildAtlasStyle();
  const initialBounds = bboxToFitBounds(WASHINGTON_COUNTY_BBOX);

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
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
}
