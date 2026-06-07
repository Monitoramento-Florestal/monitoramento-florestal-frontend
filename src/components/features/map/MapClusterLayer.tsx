"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

import {
  makeClusterIcon,
  makeTreeImageIcon,
} from "./mapIcons";
import type { TreePreview } from "@/types/trees";

type LeafletModule = typeof import("leaflet");
type LeafletImportModule = LeafletModule & { default?: LeafletModule };
type GlobalLeaflet = typeof globalThis & { L?: LeafletModule };

async function loadLeafletModule(): Promise<LeafletModule> {
  const leafletModule: LeafletImportModule = await import("leaflet");
  return leafletModule.default ?? leafletModule;
}

export interface MapClusterLayerProps {
  trees: TreePreview[];
  selectedTreeId?: string | null;
  focusTreeId?: string | null;
  onSelect?: (tree: TreePreview) => void;
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
  const treesByIdRef = useRef<Map<string, TreePreview>>(new Map());
  const previousSelectedTreeIdRef = useRef<string | null>(null);
  const [clusterReady, setClusterReady] = useState(false);
  const renderableTrees = trees.filter(
    (tree) => Number.isFinite(tree.lat) && Number.isFinite(tree.lng),
  );

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
      treesByIdRef.current.clear();
      leafletRef.current = null;
      previousSelectedTreeIdRef.current = null;
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
    treesByIdRef.current = new Map(renderableTrees.map((tree) => [tree.id, tree]));
    previousSelectedTreeIdRef.current = null;

    renderableTrees.forEach((tree) => {
      const marker = leaflet.marker([tree.lat!, tree.lng!], {
        icon: makeTreeImageIcon(leaflet, tree.status, { focused: false }),
      });

      if (onSelect) {
        marker.on("click", () => onSelect(tree));
      }

      clusterGroup.addLayer(marker);
      markersByTreeIdRef.current.set(tree.id, marker);
    });
  }, [clusterReady, onSelect, renderableTrees]);

  useEffect(() => {
    if (!clusterReady || !leafletRef.current) {
      return;
    }

    const leaflet = leafletRef.current;
    const previousSelectedTreeId = previousSelectedTreeIdRef.current;

    if (previousSelectedTreeId && previousSelectedTreeId !== selectedTreeId) {
      const previousTree = treesByIdRef.current.get(previousSelectedTreeId);
      const previousMarker = markersByTreeIdRef.current.get(previousSelectedTreeId);

      if (previousTree && previousMarker) {
        previousMarker.setIcon(
          makeTreeImageIcon(leaflet, previousTree.status, { focused: false })
        );
      }
    }

    if (selectedTreeId) {
      const selectedTree = treesByIdRef.current.get(selectedTreeId);
      const selectedMarker = markersByTreeIdRef.current.get(selectedTreeId);

      if (selectedTree && selectedMarker) {
        selectedMarker.setIcon(
          makeTreeImageIcon(leaflet, selectedTree.status, { focused: true })
        );
      }
    }

    previousSelectedTreeIdRef.current = selectedTreeId;
  }, [clusterReady, selectedTreeId, trees]);

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
