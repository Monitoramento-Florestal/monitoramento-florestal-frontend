"use client";

import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from "react-leaflet";

import L from "leaflet";

import type { Tree, TreeStatus } from "@/types/trees";

const UFRPE = { lat: -8.0175, lng: -34.9447 };

const STATUS_ICON_URL: Record<TreeStatus, string> = {
  saudavel: "/arbor_pin.png",
  injuria: "/arbor_pin2.png",
  cortada: "/arbor_pin3.png",
};

const STATUS_LABEL: Record<TreeStatus, string> = {
  saudavel: "Saudável",
  injuria: "Com injúria",
  cortada: "Cortada",
};

export interface MapViewProps {
  trees: Tree[];
  selectedTreeId?: string | null;
  className?: string;
  onSelect?: (tree: Tree) => void;
}

function createTreeIcon(status: TreeStatus, isSelected: boolean) {
  const iconSize: [number, number] = isSelected ? [68, 60] : [60, 54];
  const iconAnchor: [number, number] = isSelected ? [34, 60] : [30, 54];

  return L.icon({
    iconUrl: STATUS_ICON_URL[status],
    iconSize,
    iconAnchor,
    popupAnchor: [0, -56],
  });
}

export default function MapView({
  trees,
  selectedTreeId = null,
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

      {trees.map((tree) => (
        <Marker
          key={tree.id}
          position={[tree.lat, tree.lng]}
          icon={createTreeIcon(tree.status, tree.id === selectedTreeId)}
          eventHandlers={{
            click: () => onSelect?.(tree),
          }}
        >
          <Popup>
            <div className="space-y-1 text-sm">
              <div className="font-medium text-burgundy">{tree.nomeComum}</div>
              <div className="italic text-rosewood">{tree.especie}</div>
              <div className="text-rosewood/90">
                Status: {STATUS_LABEL[tree.status]}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
