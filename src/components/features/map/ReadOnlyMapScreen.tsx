"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { DashboardCard } from "@/components/features/dashboard";
import { getManagedTree, listManagedTrees } from "@/services/trees/treeService";
import type { Tree, TreePreview } from "@/types/trees";
import {
  isSessionInvalidationError,
  normalizeApiError,
} from "@/utils/apiFunctions";
import { TREE_STATUS_COLORS } from "./mapIcons";
import { TreeDetailPanel } from "./treeDetail/TreeDetailPanel";

const MapView = dynamic(() => import("@/components/features/map/MapView"), {
  ssr: false,
  loading: () => <p className="p-6 text-rosewood">Carregando mapa...</p>,
});

interface ReadOnlyMapScreenProps {
  mapHeightClassName?: string;
  variant?: "dashboard" | "public";
}

export function ReadOnlyMapScreen({
  mapHeightClassName = "h-[calc(100dvh-16rem)]",
  variant = "dashboard",
}: ReadOnlyMapScreenProps) {
  const [trees, setTrees] = useState<TreePreview[]>([]);
  const [isLoadingTrees, setIsLoadingTrees] = useState(true);
  const [mapErrorMessage, setMapErrorMessage] = useState<string | null>(null);
  const [selectedTreePreview, setSelectedTreePreview] =
    useState<TreePreview | null>(null);
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [isLoadingSelectedTree, setIsLoadingSelectedTree] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadTrees() {
      try {
        setIsLoadingTrees(true);
        setMapErrorMessage(null);
        const nextTrees = await listManagedTrees();

        if (!isMounted) {
          return;
        }

        setTrees(nextTrees);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (isSessionInvalidationError(error)) {
          return;
        }

        setMapErrorMessage(normalizeApiError(error).message);
      } finally {
        if (isMounted) {
          setIsLoadingTrees(false);
        }
      }
    }

    void loadTrees();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedTreePreview) {
      setSelectedTree(null);
      return;
    }

    let isMounted = true;
    const selectedTreeId = selectedTreePreview.id;

    async function loadSelectedTree() {
      try {
        setIsLoadingSelectedTree(true);
        const nextTree = await getManagedTree(selectedTreeId);

        if (!isMounted) {
          return;
        }

        setSelectedTree(nextTree);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (isSessionInvalidationError(error)) {
          return;
        }

        setMapErrorMessage(normalizeApiError(error).message);
        setSelectedTree(null);
      } finally {
        if (isMounted) {
          setIsLoadingSelectedTree(false);
        }
      }
    }

    void loadSelectedTree();

    return () => {
      isMounted = false;
    };
  }, [selectedTreePreview]);

  const georeferencedTrees = useMemo(
    () =>
      trees.filter(
        (tree) => Number.isFinite(tree.lat) && Number.isFinite(tree.lng),
      ),
    [trees],
  );

  const hasCoordinateCoverage = georeferencedTrees.length > 0;
  const isPublicVariant = variant === "public";

  return (
    <div className="space-y-4">
      {isPublicVariant ? (
        <div className="pointer-events-none absolute left-4 top-4 right-4 z-[800] flex items-start justify-end gap-3">
          <div className="pointer-events-auto flex max-w-xl flex-wrap items-center gap-4 rounded-lg border border-rosewood/20 bg-cream/95 px-4 py-3.5 text-xs text-burgundy/80 shadow-[0_8px_24px_rgb(9_30_5_/_0.12)] backdrop-blur">
            <Legend
              color={TREE_STATUS_COLORS.saudavel.fill}
              label="Saudavel"
            />
            <Legend
              color={TREE_STATUS_COLORS.injuria.fill}
              label="Com injuria"
            />
            <Legend
              color={TREE_STATUS_COLORS.cortada.fill}
              label="Cortada"
            />
            <span className="text-rosewood/75">
              {trees.length} arvore(s) disponivel(is) para consulta
            </span>
          </div>
        </div>
      ) : (
        <DashboardCard className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-4 text-xs text-burgundy/80">
              <Legend
                color={TREE_STATUS_COLORS.saudavel.fill}
                label="Saudavel"
              />
              <Legend
                color={TREE_STATUS_COLORS.injuria.fill}
                label="Com injuria"
              />
              <Legend
                color={TREE_STATUS_COLORS.cortada.fill}
                label="Cortada"
              />
            </div>
            <p className="text-xs leading-5 text-rosewood/80">
              {hasCoordinateCoverage
                ? `${georeferencedTrees.length} arvore(s) com geolocalizacao disponivel para navegacao no mapa.`
                : "As arvores ja podem ser consultadas, mas a geolocalizacao publica ainda esta em expansao."}
            </p>
          </div>

          <p className="text-xs text-rosewood/75">
            {trees.length} arvore(s) disponivel(is) para consulta
          </p>
        </DashboardCard>
      )}

      <div className={`relative overflow-hidden ${mapHeightClassName}`}>
        {mapErrorMessage ? (
          <div className="absolute inset-x-4 top-4 z-[700] rounded-xl border border-burgundy/15 bg-cream/95 px-4 py-3 text-sm text-rosewood shadow-sm">
            {mapErrorMessage}
          </div>
        ) : null}

        {isLoadingTrees || isLoadingSelectedTree ? (
          <div className="absolute inset-x-4 top-4 z-[700] rounded-xl border border-rosewood/12 bg-cream/95 px-4 py-3 text-sm text-rosewood shadow-sm">
            Carregando dados do mapa...
          </div>
        ) : null}

        {!hasCoordinateCoverage && !isLoadingTrees ? (
          <div className="absolute inset-x-4 top-4 z-[700] rounded-xl border border-sage/20 bg-cream/95 px-4 py-3 text-sm text-rosewood shadow-sm">
            Ainda nao ha coordenadas publicas suficientes para posicionar as
            arvores no mapa. Voce pode consultar os detalhes pela lista abaixo.
          </div>
        ) : null}

        <MapView
          trees={trees}
          selectedTreeId={selectedTreePreview?.id ?? null}
          onSelect={setSelectedTreePreview}
          className="absolute inset-0"
        />
      </div>

      {!hasCoordinateCoverage && trees.length > 0 ? (
        <DashboardCard
          className={
            isPublicVariant
              ? "mx-auto max-w-7xl space-y-3 px-5 py-5"
              : "space-y-3 px-5 py-5"
          }
        >
          <div>
            <h3 className="text-lg tracking-tight text-burgundy">
              Arvores disponiveis para consulta
            </h3>
            <p className="mt-1 text-sm leading-6 text-rosewood/80">
              Enquanto a geolocalizacao publica e ampliada, voce ainda pode
              abrir os detalhes completos de cada arvore por aqui.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {trees.map((tree) => {
              const isSelected = selectedTreePreview?.id === tree.id;

              return (
                <button
                  type="button"
                  key={tree.id}
                  onClick={() => setSelectedTreePreview(tree)}
                  className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "border-sage/40 bg-sage/10"
                      : "border-rosewood/12 bg-secondary/30 hover:bg-secondary/55"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/65">
                    {tree.codigo}
                  </p>
                  <h4 className="mt-1 text-base text-burgundy">
                    {tree.nomeComum}
                  </h4>
                  <p className="text-sm italic text-rosewood">{tree.especie}</p>
                  <p className="mt-2 text-sm text-rosewood/80">
                    {tree.localizacao.bairro} · {tree.localizacao.rua}
                  </p>
                </button>
              );
            })}
          </div>
        </DashboardCard>
      ) : null}

      <TreeDetailPanel
        mode="readOnly"
        tree={selectedTree}
        onClose={() => {
          setSelectedTreePreview(null);
          setSelectedTree(null);
        }}
      />
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}
