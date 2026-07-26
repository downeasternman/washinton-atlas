import type { StyleSpecification } from "maplibre-gl";

/**
 * Build the MapLibre style for the atlas.
 * Phase A: minimal placeholder style with coastal palette.
 * Phase B: wire PMTiles sources for basemap and boundaries.
 */
export function buildAtlasStyle(): StyleSpecification {
  return {
    version: 8,
    name: "washington-county-atlas",
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {},
    layers: [
      {
        id: "background",
        type: "background",
        paint: {
          "background-color": "#e8e4d9",
        },
      },
      {
        id: "water-placeholder",
        type: "background",
        paint: {
          "background-color": "#2d5a6b",
        },
        layout: {
          visibility: "none",
        },
      },
    ],
  };
}
