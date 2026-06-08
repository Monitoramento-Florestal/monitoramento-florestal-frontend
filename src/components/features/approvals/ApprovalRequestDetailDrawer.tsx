"use client";

import { Check, ChevronDown, X, X as CloseIcon } from "lucide-react";

import { DashboardCard } from "@/components/features/dashboard";
import { TREE_STATUS_COLORS } from "@/components/features/map/mapIcons";
import { Button } from "@/components/ui/button";
import type { TreeApprovalRequest } from "@/types/trees";
import {
  getApprovalRecordCode,
  getApprovalRecordName,
  getApprovalRecordStatusLabel,
  getApprovalRecordTypeLabel,
} from "@/utils/approvals";
import { formatDate } from "@/utils/format";

import { ApprovalRequestContextSummary } from "./ApprovalRequestContextSummary";
import { ApprovalRequestRecordDetails } from "./ApprovalRequestRecordDetails";

interface ApprovalRequestDetailDrawerProps {
  onApprove: (id: string) => void;
  onClose: () => void;
  onReject: (id: string) => void;
  open: boolean;
  request: TreeApprovalRequest | null;
  canReview?: boolean;
  isActing?: boolean;
}

export function ApprovalRequestDetailDrawer({
  canReview = true,
  isActing = false,
  onApprove,
  onClose,
  onReject,
  open,
  request,
}: ApprovalRequestDetailDrawerProps) {
  if (!open || !request) {
    return null;
  }

  const statusColor = TREE_STATUS_COLORS[request.record.status];

  return (
    <div className="fixed inset-0 z-[930] bg-forest/30 backdrop-blur-[2px]">
      <button
        type="button"
        aria-label="Fechar detalhes"
        className="absolute inset-0"
        onClick={onClose}
      />

      <aside className="absolute inset-y-0 right-0 w-full max-w-4xl overflow-y-auto border-l border-rosewood/12 bg-cream shadow-[0_24px_64px_rgb(9_30_5_/_0.16)]">
        <div className="flex min-h-full flex-col">
          <div className="sticky top-0 z-10 border-b border-rosewood/10 bg-cream/95 px-5 py-5 backdrop-blur sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/80">
                  {getApprovalRecordCode(request)}
                </p>
                <h2 className="mt-1 text-2xl tracking-tight text-burgundy">
                  {getApprovalRecordName(request)}
                </h2>
                <p className="mt-2 text-sm leading-6 text-rosewood">
                  Solicitacao enviada por{" "}
                  <span className="text-burgundy">{request.submittedBy}</span> em{" "}
                  {formatDate(request.submittedAt)}.
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={CloseIcon}
                onClick={onClose}
                className="shrink-0"
              >
                Fechar
              </Button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex rounded-full border border-rosewood/12 bg-card px-2.5 py-1 text-xs text-rosewood">
                {getApprovalRecordTypeLabel(request)}
              </span>
              <span
                className="inline-flex rounded-full border px-2.5 py-1 text-xs"
                style={{
                  borderColor: `${statusColor.stroke}35`,
                  backgroundColor: `${statusColor.fill}18`,
                  color: statusColor.stroke,
                }}
              >
                {getApprovalRecordStatusLabel(request)}
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-5 px-5 py-5 sm:px-6">
            <DrawerSectionCard
              title="Contexto da solicitacao"
              description="Use este bloco para entender se voce esta aprovando uma criacao de arvore ou um novo registro em uma arvore existente."
              defaultOpen
            >
              <ApprovalRequestContextSummary request={request} />
            </DrawerSectionCard>

            <DrawerSectionCard
              title="Registro submetido"
              description="Revise todos os campos tecnicos antes de aprovar ou rejeitar esta solicitacao."
              defaultOpen
            >
              <ApprovalRequestRecordDetails request={request} />
            </DrawerSectionCard>
          </div>

          <div className="sticky bottom-0 z-10 border-t border-rosewood/10 bg-cream/95 px-5 py-4 backdrop-blur sm:px-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                icon={X}
                iconSide="left"
                className="border-burgundy/30 px-8 py-5 text-burgundy hover:bg-burgundy/5"
                disabled={!canReview || isActing}
                onClick={() => onReject(request.id)}
              >
                Rejeitar
              </Button>
              <Button
                type="button"
                icon={Check}
                iconSide="left"
                className="px-8 py-5"
                disabled={!canReview || isActing}
                onClick={() => onApprove(request.id)}
              >
                {isActing ? "Processando..." : "Aprovar"}
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function DrawerSectionCard({
  children,
  defaultOpen = false,
  description,
  title,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
  description?: string;
  title: string;
}) {
  return (
    <details className="group" open={defaultOpen}>
      <DashboardCard className="space-y-4">
        <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
          <div>
            <h3 className="text-base tracking-tight text-burgundy">{title}</h3>
            {description ? (
              <p className="mt-1 text-sm text-rosewood">{description}</p>
            ) : null}
          </div>
          <ChevronDown
            size={18}
            className="mt-1 shrink-0 text-rosewood transition-transform group-open:rotate-180 md:hidden"
            strokeWidth={1.7}
          />
        </summary>

        <div className="space-y-4">{children}</div>
      </DashboardCard>
    </details>
  );
}
