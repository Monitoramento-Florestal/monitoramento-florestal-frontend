"use client"

import { useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Plus } from "lucide-react";

import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { UserRole } from "@/constants/roles";
import { mockTrees } from "@/types/mockTrees";
import type { Tree } from "@/types/trees";

const MapDefaultRender= dynamic(() => import("@/components/features/map/MapView"), {
  ssr: false,
  loading: () => <p className="p-6 text-rosewood">Carregando mapa...</p>,
});

const REGISTER_ROLES = new Set<UserRole>([
  UserRole.RESEARCHER,
  UserRole.MANAGER,
  UserRole.ADMIN,
]);


function Legend({
  colorClass,
  label,
}: {
  colorClass: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`size-2 rounded-full ${colorClass}`} />
      <span>{label}</span>
    </div>
  );
}


export default function MapPage() {
  const { user } = useAuthContext();
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);

  const canRegister = true

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
          className="px-4 pointer-events-auto flex items-center gap-4 rounded-lg border-hair bg-cream/95 px-3 py-2 backdrop-blur transition-colors hover:bg-cream"
        >
          <ArrowLeft size={18} strokeWidth={1.5} className="text-rosewood" />
          <Logo size={26} withWordmark />
        </Link>

        <div className="pointer-events-none  inset-x-4 bottom-4  flex justify-center">
            <div className="pointer-events-auto flex items-center gap-4 rounded-lg border border-rosewood/20 bg-cream/95 px-4 py-3.5 text-xs text-burgundy/80 shadow-[0_8px_24px_rgb(9_30_5_/_0.12)] backdrop-blur">
                <Legend colorClass="bg-forest" label="Saudável" />
                <Legend colorClass="bg-rosewood" label="Com injúria" />
                <Legend colorClass="bg-burgundy" label="Cortada" />
            </div>
        </div>
      </div>

      {canRegister ? (
        <Button
          type="button"
          size="lg"
          className="absolute right-4 bottom-6 z-[800] bg-sage text-cream shadow-md hover:bg-sage/90 px-8"
          icon={Plus}
          iconSide="left"
        >
          Registrar árvore
        </Button>
      ) : null}
    </section>
  );
}

