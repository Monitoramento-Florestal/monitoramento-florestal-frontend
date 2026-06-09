"use client";

import type { TreeApprovalRequest } from "@/types/trees";
import { formatTreeDate, formatTreeLabel } from "@/utils/treeDetailPanel";
import {
  getApprovalRecordName,
  getApprovalRecordSpecies,
} from "@/utils/approvals";

interface ApprovalRequestRecordDetailsProps {
  request: TreeApprovalRequest;
}

function formatCoordinate(value: number | null) {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toFixed(5)
    : "Indisponível";
}

export function ApprovalRequestRecordDetails({
  request,
}: ApprovalRequestRecordDetailsProps) {
  const { record, treeDraft, treeMeta } = request;
  const treeInfo = treeDraft ?? treeMeta;
  const commonName = getApprovalRecordName(request);
  const species = getApprovalRecordSpecies(request);
  const problemItems =
    record.condicao.problemas[0] === "nenhum"
      ? ["Nenhum problema relatado"]
      : record.condicao.problemas.map(formatTreeLabel);

  return (
    <div className="space-y-4 rounded-2xl border border-rosewood/10 bg-card/45 p-4">
      <DetailSection title="Identificação e localização">
        <DetailGrid>
          <SummaryItem label="Nome comum" value={commonName} />
          <SummaryItem label="Espécie" value={species} />
          <SummaryItem label="Latitude" value={formatCoordinate(treeInfo.lat)} />
          <SummaryItem label="Longitude" value={formatCoordinate(treeInfo.lng)} />
          <SummaryItem label="Bairro" value={record.localizacao.bairro || "Não informado"} />
          <SummaryItem label="Rua" value={record.localizacao.rua || "Não informado"} />
          <SummaryItem
            label="Número"
            value={record.localizacao.numeroResidencia ?? "Não informado"}
          />
          <SummaryItem label="Equipe" value={record.localizacao.equipe || "Não informado"} />
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
