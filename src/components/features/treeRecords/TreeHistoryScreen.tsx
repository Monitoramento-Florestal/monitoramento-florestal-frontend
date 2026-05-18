"use client";

import { Clock3, History, Pencil, PlusCircle, Trash2 } from "lucide-react";

import { DashboardCard } from "@/components/features/dashboard";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/constants/roles";
import {
  getTreeHistoryRoute,
  getTreeRecordCreateRoute,
  getTreeRecordEditRoute,
} from "@/constants/routes";
import { formatDate } from "@/utils/format";
import {
  getLatestRecord,
  getPendingRequestsForTree,
  getTreeHistorySummary,
  TREE_RECORD_STATUS_LABELS,
  TREE_REQUEST_TYPE_LABELS,
} from "@/utils/treeRecords";
import type { Tree, TreeApprovalRequest } from "@/types/trees";

interface TreeHistoryScreenProps {
  approvalRequests: TreeApprovalRequest[];
  role: UserRole.RESEARCHER | UserRole.MANAGER | UserRole.ADMIN;
  tree: Tree;
}

export function TreeHistoryScreen({
  approvalRequests,
  role,
  tree,
}: TreeHistoryScreenProps) {
  const latestRecord = getLatestRecord(tree);
  const pendingRequests = getPendingRequestsForTree(approvalRequests, tree.id);
  const canDirectEdit = role !== UserRole.RESEARCHER;
  const canDelete = role !== UserRole.RESEARCHER;

  return (
    <div className="space-y-6">
      <DashboardCard className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/70">
              {tree.codigo}
            </p>
            <h2 className="mt-1 text-2xl tracking-tight text-burgundy">
              {tree.nomeComum}
            </h2>
            <p className="mt-1 text-sm italic text-rosewood">{tree.especie}</p>
          </div>

          <Button
            href={getTreeRecordCreateRoute(role, tree.id)}
            icon={PlusCircle}
            iconSide="left"
            variant="outline"
          >
            Novo registro
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <SummaryItem label="Historico aprovado" value={getTreeHistorySummary(tree)} />
          <SummaryItem label="Registro atual" value={`v${latestRecord.version} - ${formatDate(latestRecord.registro.ultimaMedicao)}`} />
          <SummaryItem label="Coordenadas" value={`${tree.lat.toFixed(5)}, ${tree.lng.toFixed(5)}`} />
        </div>
      </DashboardCard>

      {pendingRequests.length > 0 ? (
        <DashboardCard className="border-rosewood/18 bg-secondary/40">
          <div className="flex items-start gap-3">
            <Clock3 className="mt-1 text-rosewood" size={18} />
            <div>
              <h3 className="text-base tracking-tight text-burgundy">
                Solicitacoes pendentes relacionadas a esta arvore
              </h3>
              <p className="mt-1 text-sm leading-6 text-rosewood">
                A fila de aprovacoes ja concentra essas analises, mas deixamos o contexto aqui para facilitar a leitura do historico.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {pendingRequests.map((request) => (
                  <span
                    key={request.id}
                    className="rounded-full border border-rosewood/15 bg-white px-3 py-1 text-xs text-rosewood"
                  >
                    {TREE_REQUEST_TYPE_LABELS[request.type]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </DashboardCard>
      ) : null}

      <div className="space-y-4">
        {tree.records
          .slice()
          .reverse()
          .map((record, index) => {
            const isCurrent = index === 0;

            return (
              <DashboardCard key={record.id} className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg tracking-tight text-burgundy">
                        Registro v{record.version}
                      </h3>
                      {isCurrent ? (
                        <span className="rounded-full border border-sage/25 bg-sage/12 px-3 py-1 text-xs text-burgundy">
                          Registro atual
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-rosewood">
                      Registrado por {record.registro.registradoPor} em {formatDate(record.registro.registradoEm)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-rosewood/15 bg-card px-3 py-1 text-xs text-rosewood">
                      {record.kind === "initial" ? "Registro inicial" : "Medicao"}
                    </span>
                    <span className="rounded-full border border-sage/20 bg-sage/10 px-3 py-1 text-xs text-burgundy">
                      {TREE_RECORD_STATUS_LABELS[record.status]}
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <SummaryItem label="Data da coleta" value={formatDate(record.localizacao.dataColeta)} />
                  <SummaryItem label="Equipe" value={record.localizacao.equipe} />
                  <SummaryItem label="Altura" value={`${record.dimensoes.alturaM} m`} />
                  <SummaryItem label="DAP" value={`${record.dimensoes.dapCm} cm`} />
                  <SummaryItem label="Copa" value={`${record.dimensoes.copaM} m`} />
                  <SummaryItem label="Vigor" value={record.condicao.vigor} />
                  <SummaryItem label="Acao" value={record.manejo.acao} />
                  <SummaryItem label="Prioridade" value={record.manejo.prioridade} />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm leading-6 text-rosewood">
                    {record.observacoes ?? "Sem observacoes adicionais registradas."}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      href={getTreeRecordEditRoute(role, tree.id, record.id)}
                      icon={Pencil}
                      iconSide="left"
                      variant="outline"
                    >
                      {canDirectEdit ? "Editar" : "Solicitar edicao"}
                    </Button>
                    {canDelete ? (
                      <Button
                        type="button"
                        icon={Trash2}
                        iconSide="left"
                        variant="ghost"
                        className="text-burgundy hover:bg-burgundy/6"
                      >
                        Excluir
                      </Button>
                    ) : null}
                  </div>
                </div>
              </DashboardCard>
            );
          })}
      </div>

      <DashboardCard className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base tracking-tight text-burgundy">Navegacao complementar</h3>
          <p className="mt-1 text-sm text-rosewood">
            Esta tela e a referencia principal para registros aprovados. O mapa deve encaminhar para ela quando o usuario pedir historico.
          </p>
        </div>
        <Button
          href={getTreeHistoryRoute(role, tree.id)}
          icon={History}
          iconSide="left"
          variant="ghost"
        >
          Recarregar historico
        </Button>
      </DashboardCard>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-rosewood/10 bg-card/55 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/75">
        {label}
      </p>
      <p className="mt-2 text-sm text-burgundy">{value}</p>
    </div>
  );
}
