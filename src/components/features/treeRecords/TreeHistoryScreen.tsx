"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Pencil,
  PlusCircle,
  Trash2,
} from "lucide-react";

import { DashboardCard } from "@/components/features/dashboard";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/constants/roles";
import { getTreeRecordCreateRoute, getTreeRecordEditRoute } from "@/constants/routes";
import type { Tree, TreeMeasurementRecord } from "@/types/trees";
import { formatDate } from "@/utils/format";
import { formatTreeDate, formatTreeLabel } from "@/utils/treeDetailPanel";
import {
  getLatestRecord,
  getTreeHistorySummary,
  TREE_RECORD_STATUS_LABELS,
} from "@/utils/treeRecords";

interface TreeHistoryScreenProps {
  role: UserRole.RESEARCHER | UserRole.MANAGER | UserRole.ADMIN;
  tree: Tree;
}

export function TreeHistoryScreen({ role, tree }: TreeHistoryScreenProps) {
  const latestRecord = getLatestRecord(tree);
  const canDirectEdit = role !== UserRole.RESEARCHER;
  const canDelete = role !== UserRole.RESEARCHER;
  const orderedRecords = useMemo(() => tree.records.slice().reverse(), [tree.records]);
  const [expandedRecordIds, setExpandedRecordIds] = useState<string[]>([latestRecord.id]);

  function toggleRecord(recordId: string) {
    setExpandedRecordIds((current) =>
      current.includes(recordId)
        ? current.filter((id) => id !== recordId)
        : [...current, recordId]
    );
  }

  return (
    <div className="space-y-6">
      <DashboardCard className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/70">
              {tree.codigo}
            </p>
            <h2 className="mt-1 text-2xl tracking-tight text-burgundy">{tree.nomeComum}</h2>
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
          <SummaryItem label="Histórico aprovado" value={getTreeHistorySummary(tree)} />
          <SummaryItem
            label="Registro atual"
            value={`v${latestRecord.version} - ${formatDate(latestRecord.registro.ultimaMedicao)}`}
          />
          <SummaryItem
            label="Coordenadas"
            value={`${tree.lat.toFixed(5)}, ${tree.lng.toFixed(5)}`}
          />
        </div>
      </DashboardCard>

      <div className="space-y-4">
        {orderedRecords.map((record, index) => {
          const isCurrent = index === 0;
          const isExpanded = expandedRecordIds.includes(record.id);

          return (
            <DashboardCard key={record.id} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg tracking-tight text-burgundy">Registro v{record.version}</h3>
                    {isCurrent ? (
                      <span className="rounded-full border border-sage/25 bg-sage/12 px-3 py-1 text-xs text-burgundy">
                        Registro atual
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-rosewood">
                    Registrado por {record.registro.registradoPor} em{" "}
                    {formatDate(record.registro.registradoEm)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-rosewood/15 bg-card px-3 py-1 text-xs text-rosewood">
                    {record.kind === "initial" ? "Registro inicial" : "Medição"}
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
                <SummaryItem label="Vigor" value={formatTreeLabel(record.condicao.vigor)} />
                <SummaryItem label="Ação" value={formatTreeLabel(record.manejo.acao)} />
                <SummaryItem label="Prioridade" value={formatTreeLabel(record.manejo.prioridade)} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rosewood/10 pt-4">
                <p className="max-w-3xl text-sm leading-6 text-rosewood">
                  {record.observacoes ?? "Sem observações adicionais registradas."}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    icon={isExpanded ? ChevronUp : ChevronDown}
                    iconSide="left"
                    onClick={() => toggleRecord(record.id)}
                  >
                    {isExpanded ? "Ocultar detalhes" : "Ver detalhes"}
                  </Button>
                  <Button
                    href={getTreeRecordEditRoute(role, tree.id, record.id)}
                    icon={Pencil}
                    iconSide="left"
                    variant="outline"
                  >
                    {canDirectEdit ? "Editar" : "Solicitar edição"}
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

              {isExpanded ? <ExpandedRecordDetails record={record} tree={tree} /> : null}
            </DashboardCard>
          );
        })}
      </div>
    </div>
  );
}

function ExpandedRecordDetails({
  record,
  tree,
}: {
  record: TreeMeasurementRecord;
  tree: Tree;
}) {
  const problemItems =
    record.condicao.problemas[0] === "nenhum"
      ? ["Nenhum problema relatado"]
      : record.condicao.problemas.map(formatTreeLabel);

  return (
    <div className="space-y-4 rounded-2xl border border-rosewood/10 bg-card/45 p-4">
      <DetailSection title="Identificação e localização">
        <DetailGrid>
          <SummaryItem label="Nome comum" value={tree.nomeComum} />
          <SummaryItem label="Espécie" value={tree.especie} />
          <SummaryItem label="Latitude" value={tree.lat.toFixed(5)} />
          <SummaryItem label="Longitude" value={tree.lng.toFixed(5)} />
          <SummaryItem label="Bairro" value={record.localizacao.bairro} />
          <SummaryItem label="Rua" value={record.localizacao.rua} />
          <SummaryItem
            label="Número"
            value={record.localizacao.numeroResidencia ?? "Não informado"}
          />
          <SummaryItem label="Equipe" value={record.localizacao.equipe} />
          <SummaryItem
            label="Referência"
            value={record.localizacao.referencia ?? "Não informada"}
          />
          <SummaryItem label="Data da coleta" value={formatTreeDate(record.localizacao.dataColeta)} />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Dimensões">
        <DetailGrid>
          <SummaryItem label="Altura" value={`${record.dimensoes.alturaM} m`} />
          <SummaryItem label="DAP" value={`${record.dimensoes.dapCm} cm`} />
          <SummaryItem label="Copa" value={`${record.dimensoes.copaM} m`} />
          <SummaryItem
            label="Tipo de medida"
            value={record.dimensoes.medidaEstimada ? "Medida estimada" : "Medida aferida"}
          />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Condição da árvore">
        <DetailGrid>
          <SummaryItem label="Estado geral" value={`${record.condicao.estadoGeral}/5`} />
          <SummaryItem label="Vigor" value={formatTreeLabel(record.condicao.vigor)} />
          <SummaryItem
            label="Posição do problema"
            value={
              record.condicao.posicaoProblema
                ? formatTreeLabel(record.condicao.posicaoProblema)
                : "Não informada"
            }
          />
        </DetailGrid>
        <TagRow label="Problemas" items={problemItems} />
      </DetailSection>

      <DetailSection title="Estrutura e risco">
        <DetailGrid>
          <SummaryItem
            label="Inclinação do tronco"
            value={formatTreeLabel(record.estruturaRisco.inclinacaoTronco)}
          />
          <SummaryItem
            label="Ancoragem radicular"
            value={formatTreeLabel(record.estruturaRisco.ancoragemRadicular)}
          />
          <SummaryItem
            label="Fluxo de veículos"
            value={formatTreeLabel(record.estruturaRisco.fluxoVeiculos)}
          />
          <SummaryItem
            label="Fluxo de pedestres"
            value={formatTreeLabel(record.estruturaRisco.fluxoPedestres)}
          />
          <SummaryItem label="Tipo de via" value={formatTreeLabel(record.estruturaRisco.tipoVia)} />
        </DetailGrid>
        <TagRow label="Tronco" items={record.estruturaRisco.tronco.map(formatTreeLabel)} />
        <TagRow label="Base / colo" items={record.estruturaRisco.baseColo.map(formatTreeLabel)} />
        <TagRow label="Copa" items={record.estruturaRisco.copa.map(formatTreeLabel)} />
        <TagRow
          label="Alvos potenciais"
          items={record.estruturaRisco.alvosPotenciais.map(formatTreeLabel)}
        />
        <TagRow
          label="Alvos sensíveis"
          items={record.estruturaRisco.alvosSensiveis.map(formatTreeLabel)}
        />
      </DetailSection>

      <DetailSection title="Conflitos">
        <DetailGrid>
          <SummaryItem label="Fiação" value={formatTreeLabel(record.conflitos.fiacao)} />
          <SummaryItem label="Calçada" value={formatTreeLabel(record.conflitos.calcada)} />
          <SummaryItem label="Iluminação" value={formatTreeLabel(record.conflitos.iluminacao)} />
          <SummaryItem label="Edificação" value={formatTreeLabel(record.conflitos.edificacao)} />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Manejo">
        <DetailGrid>
          <SummaryItem label="Ação" value={formatTreeLabel(record.manejo.acao)} />
          <SummaryItem label="Prioridade" value={formatTreeLabel(record.manejo.prioridade)} />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Registro">
        <DetailGrid>
          <SummaryItem label="Última medição" value={formatTreeDate(record.registro.ultimaMedicao)} />
          <SummaryItem label="Registrado em" value={formatTreeDate(record.registro.registradoEm)} />
          <SummaryItem label="Registrado por" value={record.registro.registradoPor} />
          <SummaryItem label="Aprovação" value={formatTreeLabel(record.registro.aprovacao)} />
          <SummaryItem label="Fotos anexadas" value={String(record.registro.fotos.length)} />
        </DetailGrid>
        {record.registro.motivoRejeicao ? (
          <p className="text-sm leading-6 text-rosewood">
            <span className="font-medium text-burgundy">Motivo da rejeição:</span>{" "}
            {record.registro.motivoRejeicao}
          </p>
        ) : null}
      </DetailSection>

      <DetailSection title="Observações">
        <p className="text-sm leading-6 text-rosewood">
          {record.observacoes ?? "Sem observações adicionais registradas."}
        </p>
      </DetailSection>
    </div>
  );
}

function DetailSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="space-y-3">
      <h4 className="text-sm font-medium uppercase tracking-[0.18em] text-rosewood/80">
        {title}
      </h4>
      {children}
    </section>
  );
}

function DetailGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{children}</div>;
}

function TagRow({
  items,
  label,
}: {
  items: string[];
  label: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/75">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={`${label}-${item}`}
            className="rounded-full border border-rosewood/15 bg-white px-3 py-1 text-xs text-rosewood"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-rosewood/10 bg-card/55 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/75">{label}</p>
      <p className="mt-2 text-sm text-burgundy">{value}</p>
    </div>
  );
}
