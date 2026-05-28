import Image from "next/image";
import { Check, Image as ImageIcon, X } from "lucide-react";

import { DashboardCard } from "@/components/features/dashboard";
import { Button } from "@/components/ui/button";
import {
  getApprovalRecordCode,
  getApprovalRecordImage,
  getApprovalRecordMetrics,
  getApprovalRecordName,
  getApprovalRecordSpecies,
  getApprovalRecordStatusLabel,
  getApprovalRecordTypeLabel,
} from "@/utils/approvals";
import { formatDate } from "@/utils/format";
import { TREE_STATUS_COLORS } from "@/components/features/map/mapIcons";
import type { TreeApprovalRequest } from "@/types/trees";

interface ApprovalRecordCardProps {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  request: TreeApprovalRequest;
}

export function ApprovalRecordCard({
  onApprove,
  onReject,
  request,
}: ApprovalRecordCardProps) {
  const image = getApprovalRecordImage(request);
  const metrics = getApprovalRecordMetrics(request);
  const statusColor = TREE_STATUS_COLORS[request.record.status];
  const statusLabel = getApprovalRecordStatusLabel(request);
  const typeLabel = getApprovalRecordTypeLabel(request);

  return (
    <DashboardCard className="grain px-5 py-5">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="relative h-24 w-full overflow-hidden rounded-lg border border-rosewood/10 bg-secondary sm:w-24">
          {image ? (
            <Image
              src={image}
              alt={`Registro de ${getApprovalRecordName(request)}`}
              fill
              sizes="96px"
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
                {getApprovalRecordCode(request)}
              </p>
              <h3 className="mt-1 text-lg tracking-tight text-burgundy">
                {getApprovalRecordName(request)}
              </h3>
              <p className="mt-1 text-sm italic text-rosewood">
                {getApprovalRecordSpecies(request)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex w-fit rounded-full border border-rosewood/12 bg-card px-2.5 py-1 text-xs text-rosewood">
                {typeLabel}
              </span>
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
            <span className="text-burgundy">{request.submittedBy}</span>{" "}
            em {formatDate(request.submittedAt)}.
          </p>
        </div>

        <div className="flex gap-2 sm:w-40 sm:flex-col sm:justify-center">
          <Button
            type="button"
            icon={Check}
            iconSide="left"
            className="flex-1"
            onClick={() => onApprove(request.id)}
          >
            Aprovar
          </Button>
          <Button
            type="button"
            variant="outline"
            icon={X}
            iconSide="left"
            className="flex-1 border-burgundy/30 text-burgundy hover:bg-burgundy/5"
            onClick={() => onReject(request.id)}
          >
            Rejeitar
          </Button>
        </div>
      </div>
    </DashboardCard>
  );
}
