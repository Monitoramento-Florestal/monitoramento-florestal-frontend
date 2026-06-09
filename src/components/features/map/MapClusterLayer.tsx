"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";

import {
  makeClusterIcon,
  makeStaticClusterIcon,
  makeTreeImageIcon,
} from "./mapIcons";
import type {
  MapTreeCluster,
  MapTreeCollectionMode,
  MapTreePreview,
} from "@/types/map";

type LeafletModule = typeof import("leaflet");
type LeafletImportModule = LeafletModule & { default?: LeafletModule };
type GlobalLeaflet = typeof globalThis & { L?: LeafletModule };

async function loadLeafletModule(): Promise<LeafletModule> {
  const leafletModule: LeafletImportModule = await import("leaflet");
  return leafletModule.default ?? leafletModule;
}

export interface MapClusterLayerProps {
  mode: MapTreeCollectionMode;
  clusters?: MapTreeCluster[];
  trees: MapTreePreview[];
  selectedTreeId?: string | null;
  focusTreeId?: string | null;
  onSelect?: (tree: MapTreePreview) => void;
}

export function MapClusterLayer({
  mode,
  clusters = [],
  trees,
  selectedTreeId = null,
  focusTreeId = null,
  onSelect,
}: MapClusterLayerProps) {
  const map = useMap();
  const leafletRef = useRef<LeafletModule | null>(null);
  const clusterGroupRef = useRef<import("leaflet").MarkerClusterGroup | null>(null);
  const staticClusterLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const markersByTreeIdRef = useRef<Map<string, import("leaflet").Marker>>(new Map());
  const treesByIdRef = useRef<Map<string, MapTreePreview>>(new Map());
  const previousSelectedTreeIdRef = useRef<string | null>(null);
  const [clusterReady, setClusterReady] = useState(false);
  const renderableTrees = trees.filter(
    (tree) => Number.isFinite(tree.lat) && Number.isFinite(tree.lng),
  );

  useEffect(() => {
    let active = true;
    const markersByTreeId = markersByTreeIdRef.current;
    const treesById = treesByIdRef.current;

    async function setupClusterGroup() {
      const leaflet = await loadLeafletModule();

      (globalThis as GlobalLeaflet).L = leaflet;
      await import("leaflet.markercluster");

      if (!active || clusterGroupRef.current || staticClusterLayerRef.current) {
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
      staticClusterLayerRef.current = leaflet.layerGroup().addTo(map);
      setClusterReady(true);
    }

    void setupClusterGroup();

    return () => {
      active = false;

      if (clusterGroupRef.current) {
        map.removeLayer(clusterGroupRef.current);
        clusterGroupRef.current = null;
      }

      if (staticClusterLayerRef.current) {
        map.removeLayer(staticClusterLayerRef.current);
        staticClusterLayerRef.current = null;
      }

      markersByTreeId.clear();
      treesById.clear();
      leafletRef.current = null;
      previousSelectedTreeIdRef.current = null;
      setClusterReady(false);
    };
  }, [map]);

  useEffect(() => {
    if (
      !clusterReady ||
      !clusterGroupRef.current ||
      !staticClusterLayerRef.current ||
      !leafletRef.current
    ) {
      return;
    }

    const leaflet = leafletRef.current;
    const clusterGroup = clusterGroupRef.current;
    const staticClusterLayer = staticClusterLayerRef.current;

    clusterGroup.clearLayers();
    staticClusterLayer.clearLayers();
    markersByTreeIdRef.current.clear();
    treesByIdRef.current = new Map(renderableTrees.map((tree) => [tree.id, tree]));
    previousSelectedTreeIdRef.current = null;

    if (mode === "cluster") {
      clusters.forEach((cluster) => {
        const marker = leaflet.marker([cluster.lat, cluster.lng], {
          icon: makeStaticClusterIcon(leaflet, cluster.count),
        });

        marker.on("click", () => {
          map.flyTo([cluster.lat, cluster.lng], Math.max(map.getZoom() + 2, 16), {
            duration: 0.8,
          });
        });

        staticClusterLayer.addLayer(marker);
      });

      return;
    }

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
  }, [clusterReady, clusters, map, mode, onSelect, renderableTrees]);

  useEffect(() => {
    if (!clusterReady || !leafletRef.current || mode !== "trees") {
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
  }, [clusterReady, mode, selectedTreeId, trees]);

  useEffect(() => {
    if (!clusterReady || !clusterGroupRef.current || !focusTreeId || mode !== "trees") {
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
  }, [clusterReady, focusTreeId, map, mode]);

  return null;
}
