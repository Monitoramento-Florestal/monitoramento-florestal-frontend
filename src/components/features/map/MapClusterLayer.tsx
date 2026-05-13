"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

import {
  makeClusterIcon,
  makeTreeImageIcon,
} from "./mapIcons";
import type { Tree } from "@/types/trees";

type LeafletModule = typeof import("leaflet");
type LeafletImportModule = LeafletModule & { default?: LeafletModule };
type GlobalLeaflet = typeof globalThis & { L?: LeafletModule };

async function loadLeafletModule(): Promise<LeafletModule> {
  const leafletModule: LeafletImportModule = await import("leaflet");
  return leafletModule.default ?? leafletModule;
}

export interface MapClusterLayerProps {
  trees: Tree[];
  selectedTreeId?: string | null;
  focusTreeId?: string | null;
  onSelect?: (tree: Tree) => void;
}

export function MapClusterLayer({
  trees,
  selectedTreeId = null,
  focusTreeId = null,
  onSelect,
}: MapClusterLayerProps) {
  const map = useMap();
  const leafletRef = useRef<LeafletModule | null>(null);
  const clusterGroupRef = useRef<import("leaflet").MarkerClusterGroup | null>(null);
  const markersByTreeIdRef = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const [clusterReady, setClusterReady] = useState(false);

  useEffect(() => {
    let active = true;

    async function setupClusterGroup() {
      // Leaflet.markercluster is a legacy side-effect plugin: it expects
      // Leaflet to exist on the client global scope when the plugin executes.
      // We therefore load Leaflet and the plugin lazily inside the client effect
      // to avoid SSR evaluation and to guarantee the correct initialization order.
      const leaflet = await loadLeafletModule();

      (globalThis as GlobalLeaflet).L = leaflet;
      await import("leaflet.markercluster");

      if (!active || clusterGroupRef.current) {
        return;
      }

      leafletRef.current = leaflet;

      const clusterGroup = leaflet.markerClusterGroup({
        iconCreateFunction: (cluster) => makeClusterIcon(leaflet, cluster),
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        removeOutsideVisibleBounds: true,
        chunkedLoading: true,
        maxClusterRadius: 64,
      });

      clusterGroup.addTo(map);
      clusterGroupRef.current = clusterGroup;
      setClusterReady(true);
    }

    setupClusterGroup();

    return () => {
      active = false;

      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }

      markersByTreeIdRef.current.clear();
      leafletRef.current = null;
      setClusterReady(false);
    };
  }, [map]);

  useEffect(() => {
    if (!clusterReady || !clusterGroupRef.current || !leafletRef.current) {
      return;
    }

    const leaflet = leafletRef.current;
    const clusterGroup = clusterGroupRef.current;
    clusterGroup.clearLayers();
    markersByTreeIdRef.current.clear();

    trees.forEach((tree) => {
      const marker = leaflet.marker([tree.lat, tree.lng], {
        icon: makeTreeImageIcon(leaflet, tree.status, {
          focused: tree.id === selectedTreeId,
        }),
      });

      if (onSelect) {
        marker.on("click", () => onSelect(tree));
      }

      clusterGroup.addLayer(marker);
      markersByTreeIdRef.current.set(tree.id, marker);
    });
  }, [clusterReady, onSelect, selectedTreeId, trees]);

  useEffect(() => {
    if (!clusterReady || !clusterGroupRef.current || !focusTreeId) {
      return;
    }

    const marker = markersByTreeIdRef.current.get(focusTreeId);
    if (!marker) {
      return;
    }

    clusterGroupRef.current.zoomToShowLayer(marker, () => {
      const latLng = marker.getLatLng();
      map.flyTo(latLng, Math.max(map.getZoom(), 18), { duration: 0.8 });
    });
  }, [clusterReady, focusTreeId, map]);

  return null;
}
