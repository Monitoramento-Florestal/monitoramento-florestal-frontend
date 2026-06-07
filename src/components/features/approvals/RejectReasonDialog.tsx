"use client";

import { DashboardCard } from "@/components/features/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RejectReasonDialogProps {
  errorMessage?: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onChangeReason: (value: string) => void;
  onConfirm: () => void;
  open: boolean;
  reason: string;
  treeName?: string;
}

export function RejectReasonDialog({
  errorMessage,
  isSubmitting = false,
  onCancel,
  onChangeReason,
  onConfirm,
  open,
  reason,
  treeName,
}: RejectReasonDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[940] flex items-center justify-center bg-forest/30 px-4 backdrop-blur-[2px]">
      <DashboardCard className="w-full max-w-md p-0">
        <div className="border-b border-rosewood/10 px-6 py-5">
          <h2 className="text-lg tracking-tight text-burgundy">Motivo da Rejeicao</h2>
          <p className="mt-2 text-sm leading-6 text-rosewood">
            {treeName
              ? `Explique por que o registro de ${treeName} nao pode seguir na fila.`
              : "Explique por que este registro nao pode seguir na fila."}
          </p>
        </div>

        <div className="space-y-4 px-6 py-5">
          <Input
            value={reason}
            onChange={(event) => onChangeReason(event.target.value)}
            placeholder="Ex.: medicoes inconsistentes ou documentacao incompleta"
            className="h-11 bg-cream"
          />

          {errorMessage ? <p className="text-sm text-burgundy">{errorMessage}</p> : null}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" disabled={isSubmitting} onClick={onCancel}>
              Cancelar
            </Button>
            <Button
              type="button"
              className="bg-burgundy text-cream hover:bg-burgundy/90"
              disabled={isSubmitting}
              onClick={onConfirm}
            >
              {isSubmitting ? "Enviando..." : "Confirmar Rejeicao"}
            </Button>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
