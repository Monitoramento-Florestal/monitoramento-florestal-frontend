import Image from "next/image";
import { Check, Image as ImageIcon, X } from "lucide-react";

import { DashboardCard } from "@/components/features/dashboard";
import { Button } from "@/components/ui/button";
import {
  getApprovalRecordImage,
  getApprovalRecordMetrics,
  getApprovalRecordStatusLabel,
} from "@/utils/approvals";
import { formatDate } from "@/utils/format";
import { TREE_STATUS_COLORS } from "@/components/features/map/mapIcons";
import type { Tree } from "@/types/trees";

interface ApprovalRecordCardProps {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  tree: Tree;
}

export function ApprovalRecordCard({
  onApprove,
  onReject,
  tree,
}: ApprovalRecordCardProps) {
  const image = getApprovalRecordImage(tree);
  const metrics = getApprovalRecordMetrics(tree);
  const statusColor = TREE_STATUS_COLORS[tree.status];
  const statusLabel = getApprovalRecordStatusLabel(tree);

  return (
    <DashboardCard className="grain px-5 py-5">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="relative h-24 w-full overflow-hidden rounded-lg border border-rosewood/10 bg-secondary sm:w-24">
          {image ? (
            <Image
              src={image}
              alt={`Registro de ${tree.nomeComum}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-rosewood">
              <ImageIcon size={20} strokeWidth={1.5} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/80">
                {tree.codigo}
              </p>
              <h3 className="mt-1 text-lg tracking-tight text-burgundy">
                {tree.nomeComum}
              </h3>
              <p className="mt-1 text-sm italic text-rosewood">
                {tree.especie}
              </p>
            </div>

            <span
              className="inline-flex w-fit rounded-full border px-2.5 py-1 text-xs"
              style={{
                borderColor: `${statusColor.stroke}35`,
                backgroundColor: `${statusColor.fill}18`,
                color: statusColor.stroke,
              }}
            >
              {statusLabel}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label}>
                <div className="text-[10px] uppercase tracking-[0.16em] text-rosewood/75">
                  {metric.label}
                </div>
                <div className="mt-1 text-sm tabular-nums text-burgundy">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm leading-6 text-rosewood">
            Registrado por{" "}
            <span className="text-burgundy">{tree.registro.registradoPor}</span>{" "}
            em {formatDate(tree.registro.registradoEm)}.
          </p>
        </div>

        <div className="flex gap-2 sm:w-40 sm:flex-col sm:justify-center">
          <Button
            type="button"
            icon={Check}
            iconSide="left"
            className="flex-1"
            onClick={() => onApprove(tree.id)}
          >
            Aprovar
          </Button>
          <Button
            type="button"
            variant="outline"
            icon={X}
            iconSide="left"
            className="flex-1 border-burgundy/30 text-burgundy hover:bg-burgundy/5"
            onClick={() => onReject(tree.id)}
          >
            Rejeitar
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
