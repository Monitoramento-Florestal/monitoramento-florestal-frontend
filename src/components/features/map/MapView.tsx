"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, ZoomControl, useMapEvents } from "react-leaflet";

import { MapClusterLayer } from "./MapClusterLayer";
import type {
  MapTreeCluster,
  MapTreeCollectionMode,
  MapTreePreview,
  MapViewport,
} from "@/types/map";

const UFRPE = { lat: -8.0175, lng: -34.9447 };
const MAX_ZOOM = 20;
const TILE_MAX_NATIVE_ZOOM = 19;

export interface MapViewProps {
  mode?: MapTreeCollectionMode;
  clusters?: MapTreeCluster[];
  trees: MapTreePreview[];
  selectedTreeId?: string | null;
  focusTreeId?: string | null;
  className?: string;
  onSelect?: (tree: MapTreePreview) => void;
  onViewportChange?: (viewport: MapViewport) => void;
}

export default function MapView({
  mode = "trees",
  clusters = [],
  trees,
  selectedTreeId = null,
  focusTreeId = null,
  className = "",
  onSelect,
  onViewportChange,
}: MapViewProps) {
  return (
    <MapContainer
      center={UFRPE}
      zoom={16}
      minZoom={15}
      maxZoom={MAX_ZOOM}
      zoomControl={false}
      attributionControl={false}
      className={`leaflet-arbor h-full w-full ${className}`}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={MAX_ZOOM}
        maxNativeZoom={TILE_MAX_NATIVE_ZOOM}
      />
      <ZoomControl position="bottomleft" />
      <MapViewportTracker onViewportChange={onViewportChange} />
      <MapClusterLayer
        mode={mode}
        clusters={clusters}
        trees={trees}
        selectedTreeId={selectedTreeId}
        focusTreeId={focusTreeId}
        onSelect={onSelect}
      />
    </MapContainer>
  );
}

function MapViewportTracker({
  onViewportChange,
}: {
  onViewportChange?: (viewport: MapViewport) => void;
}) {
  const map = useMapEvents({
    moveend: emitViewport,
    zoomend: emitViewport,
  });

  useEffect(() => {
    emitViewport();
    // The map instance is stable during the component lifetime, so a single
    // initial emission plus the event handlers above is enough here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function emitViewport() {
    if (!onViewportChange) {
      return;
    }

    const bounds = map.getBounds();

    onViewportChange({
      minLat: bounds.getSouth(),
      minLng: bounds.getWest(),
      maxLat: bounds.getNorth(),
      maxLng: bounds.getEast(),
      zoom: map.getZoom(),
    });
  }

  return null;
}
