"use client";

import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import { MapClusterLayer } from "./MapClusterLayer";
import type { TreePreview } from "@/types/trees";

const UFRPE = { lat: -8.0175, lng: -34.9447 };

export interface MapViewProps {
  trees: TreePreview[];
  selectedTreeId?: string | null;
  focusTreeId?: string | null;
  className?: string;
  onSelect?: (tree: TreePreview) => void;
}

export default function MapView({
  trees,
  selectedTreeId = null,
  focusTreeId = null,
  className = "",
  onSelect,
}: MapViewProps) {
  return (
    <MapContainer
      center={UFRPE}
      zoom={16}
      minZoom={15}
      maxZoom={20}
      zoomControl={false}
      className={`leaflet-arbor h-full w-full ${className}`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomleft" />
      <MapClusterLayer
        trees={trees}
        selectedTreeId={selectedTreeId}
        focusTreeId={focusTreeId}
        onSelect={onSelect}
      />
    </MapContainer>
  );
}
