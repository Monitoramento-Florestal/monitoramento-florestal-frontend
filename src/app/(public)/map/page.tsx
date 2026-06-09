"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ReadOnlyMapScreen } from "@/components/features/map/ReadOnlyMapScreen";
import { Logo } from "@/components/ui/Logo";

export default function MapPage() {
  return (
    <section className="relative h-screen w-screen overflow-hidden bg-cream">
      <ReadOnlyMapScreen mapHeightClassName="h-screen" variant="public" />

      <div className="pointer-events-none absolute left-4 top-4 z-[810]">
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2.5 rounded-lg border-hair bg-cream/95 px-3 py-2 backdrop-blur transition-colors hover:bg-cream"
        >
          <ArrowLeft size={14} strokeWidth={1.5} className="text-rosewood" />
          <Logo size={22} withWordmark />
        </Link>
      </div>
    </section>
  );
}
