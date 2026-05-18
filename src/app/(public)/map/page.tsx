"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Plus } from "lucide-react";

import { TREE_STATUS_COLORS } from "@/components/features/map/mapIcons";
import { TreeDetailPanel } from "@/components/features/map/treeDetail/TreeDetailPanel";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { UserRole } from "@/constants/roles";
import { mockTrees } from "@/types/mockTrees";
import type { Tree } from "@/types/trees";

const MapDefaultRender = dynamic(() => import("@/components/features/map/MapView"), {
  ssr: false,
  loading: () => <p className="p-6 text-rosewood">Carregando mapa...</p>,
});

const REGISTER_ROLES = new Set<UserRole>([
  UserRole.RESEARCHER,
  UserRole.MANAGER,
  UserRole.ADMIN,
]);

function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}

export default function MapPage() {
  const { user } = useAuthContext();
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

  const canRegister = useMemo(
    () => (user ? REGISTER_ROLES.has(user.role as UserRole) : false),
    [user]
  );

  return (
    <section className="relative h-screen w-screen overflow-hidden bg-cream">
      <MapDefaultRender
        trees={mockTrees}
        selectedTreeId={selectedTree?.id ?? null}
        onSelect={setSelectedTree}
        className="absolute inset-0"
      />

      <div className="pointer-events-none absolute top-4 left-4 right-4 z-[800] flex items-center justify-between gap-3">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2.5 rounded-lg border-hair bg-cream/95 px-3 py-2 backdrop-blur transition-colors hover:bg-cream"
        >
          <ArrowLeft size={14} strokeWidth={1.5} className="text-rosewood" />
          <Logo size={22} withWordmark />
        </Link>

        <div className="pointer-events-auto flex items-center gap-4 rounded-lg border border-rosewood/20 bg-cream/95 px-4 py-3.5 text-xs text-burgundy/80 shadow-[0_8px_24px_rgb(9_30_5_/_0.12)] backdrop-blur">
          <Legend color={TREE_STATUS_COLORS.saudavel.fill} label="Saudável" />
          <Legend color={TREE_STATUS_COLORS.injuria.fill} label="Com injúria" />
          <Legend color={TREE_STATUS_COLORS.cortada.fill} label="Cortada" />
        </div>
      </div>

      {canRegister ? (
        <Button
          type="button"
          size="lg"
          className="absolute right-4 bottom-6 z-[800] bg-sage px-8 text-cream shadow-md hover:bg-sage/90"
          icon={Plus}
          iconSide="left"
        >
          Registrar árvore
        </Button>
      ) : null}

      <TreeDetailPanel tree={selectedTree} onClose={() => setSelectedTree(null)} />
    </section>
  );
}
