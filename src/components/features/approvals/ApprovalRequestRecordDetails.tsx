"use client";

import type { TreeApprovalRequest } from "@/types/trees";
import { formatTreeDate, formatTreeLabel } from "@/utils/treeDetailPanel";

interface ApprovalRequestRecordDetailsProps {
  request: TreeApprovalRequest;
}

function formatCoordinate(value: number | null) {
  return typeof value === "number" && Number.isFinite(value)
    ? value.toFixed(5)
    : "Indisponivel";
}

export function ApprovalRequestRecordDetails({
  request,
}: ApprovalRequestRecordDetailsProps) {
  const { record, treeDraft, treeMeta } = request;
  const treeInfo = treeDraft ?? treeMeta;
  const problemItems =
    record.condicao.problemas[0] === "nenhum"
      ? ["Nenhum problema relatado"]
      : record.condicao.problemas.map(formatTreeLabel);

  return (
    <div className="space-y-4 rounded-2xl border border-rosewood/10 bg-card/45 p-4">
      <DetailSection title="Identificacao e Localizacao">
        <DetailGrid>
          <SummaryItem label="Nome Comum" value={treeInfo.nomeComum || "Nao informado"} />
          <SummaryItem label="Especie" value={treeInfo.especie || "Nao informado"} />
          <SummaryItem label="Latitude" value={formatCoordinate(treeInfo.lat)} />
          <SummaryItem label="Longitude" value={formatCoordinate(treeInfo.lng)} />
          <SummaryItem label="Bairro" value={record.localizacao.bairro || "Nao informado"} />
          <SummaryItem label="Rua" value={record.localizacao.rua || "Nao informado"} />
          <SummaryItem
            label="Numero"
            value={record.localizacao.numeroResidencia ?? "Nao informado"}
          />
          <SummaryItem label="Equipe" value={record.localizacao.equipe || "Nao informado"} />
          <SummaryItem
            label="Referencia"
            value={record.localizacao.referencia ?? "Nao informada"}
          />
          <SummaryItem label="Data da Coleta" value={formatTreeDate(record.localizacao.dataColeta)} />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Dimensoes">
        <DetailGrid>
          <SummaryItem label="Altura" value={`${record.dimensoes.alturaM} m`} />
          <SummaryItem label="DAP" value={`${record.dimensoes.dapCm} cm`} />
          <SummaryItem label="Copa" value={`${record.dimensoes.copaM} m`} />
          <SummaryItem
            label="Tipo de Medida"
            value={record.dimensoes.medidaEstimada ? "Medida estimada" : "Medida aferida"}
          />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Condicao da Arvore">
        <DetailGrid>
          <SummaryItem label="Estado Geral" value={`${record.condicao.estadoGeral}/5`} />
          <SummaryItem label="Vigor" value={formatTreeLabel(record.condicao.vigor)} />
          <SummaryItem
            label="Posicao do Problema"
            value={
              record.condicao.posicaoProblema
                ? formatTreeLabel(record.condicao.posicaoProblema)
                : "Nao informada"
            }
          />
        </DetailGrid>
        <TagRow label="Problemas" items={problemItems} />
      </DetailSection>

      <DetailSection title="Estrutura e Risco">
        <DetailGrid>
          <SummaryItem
            label="Inclinacao do Tronco"
            value={formatTreeLabel(record.estruturaRisco.inclinacaoTronco)}
          />
          <SummaryItem
            label="Ancoragem Radicular"
            value={formatTreeLabel(record.estruturaRisco.ancoragemRadicular)}
          />
          <SummaryItem
            label="Fluxo de Veiculos"
            value={formatTreeLabel(record.estruturaRisco.fluxoVeiculos)}
          />
          <SummaryItem
            label="Fluxo de Pedestres"
            value={formatTreeLabel(record.estruturaRisco.fluxoPedestres)}
          />
          <SummaryItem label="Tipo de Via" value={formatTreeLabel(record.estruturaRisco.tipoVia)} />
        </DetailGrid>
        <TagRow label="Tronco" items={record.estruturaRisco.tronco.map(formatTreeLabel)} />
        <TagRow label="Base / Colo" items={record.estruturaRisco.baseColo.map(formatTreeLabel)} />
        <TagRow label="Copa" items={record.estruturaRisco.copa.map(formatTreeLabel)} />
        <TagRow
          label="Alvos Potenciais"
          items={record.estruturaRisco.alvosPotenciais.map(formatTreeLabel)}
        />
        <TagRow
          label="Alvos Sensiveis"
          items={record.estruturaRisco.alvosSensiveis.map(formatTreeLabel)}
        />
      </DetailSection>

      <DetailSection title="Conflitos">
        <DetailGrid>
          <SummaryItem label="Fiacao" value={formatTreeLabel(record.conflitos.fiacao)} />
          <SummaryItem label="Calcada" value={formatTreeLabel(record.conflitos.calcada)} />
          <SummaryItem label="Iluminacao" value={formatTreeLabel(record.conflitos.iluminacao)} />
          <SummaryItem label="Edificacao" value={formatTreeLabel(record.conflitos.edificacao)} />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Manejo">
        <DetailGrid>
          <SummaryItem label="Acao" value={formatTreeLabel(record.manejo.acao)} />
          <SummaryItem label="Prioridade" value={formatTreeLabel(record.manejo.prioridade)} />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Registro">
        <DetailGrid>
          <SummaryItem label="Ultima Medicao" value={formatTreeDate(record.registro.ultimaMedicao)} />
          <SummaryItem label="Registrado em" value={formatTreeDate(record.registro.registradoEm)} />
          <SummaryItem label="Registrado por" value={record.registro.registradoPor} />
          <SummaryItem label="Aprovacao" value={formatTreeLabel(record.registro.aprovacao)} />
          <SummaryItem label="Fotos Anexadas" value={String(record.registro.fotos.length)} />
        </DetailGrid>
        {record.registro.motivoRejeicao ? (
          <p className="text-sm leading-6 text-rosewood">
            <span className="font-medium text-burgundy">Motivo da Rejeicao:</span>{" "}
            {record.registro.motivoRejeicao}
          </p>
        ) : null}
      </DetailSection>

      <DetailSection title="Observacoes">
        <p className="text-sm leading-6 text-rosewood">
          {record.observacoes ?? "Sem observacoes adicionais registradas."}
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
