'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ChevronDown, PlusCircle, Trash2 } from 'lucide-react'

import { DashboardCard } from '@/components/features/dashboard'
import { Button } from '@/components/ui/button'
import { UserRole } from '@/constants/roles'
import { APP_ROUTES, getTreeRecordCreateRoute } from '@/constants/routes'
import type { Tree, TreeMeasurementRecord } from '@/types/trees'
import { formatDate } from '@/utils/format'
import { formatTreeDate, formatTreeLabel } from '@/utils/treeDetailPanel'
import {
  getLatestRecord,
  getTreeHistorySummary,
  TREE_RECORD_STATUS_LABELS,
} from '@/utils/treeRecords'

interface TreeHistoryScreenProps {
  deletingRecordId?: string | null
  onDeleteRecord?: (record: TreeMeasurementRecord) => void | Promise<void>
  role: UserRole.RESEARCHER | UserRole.MANAGER | UserRole.ADMIN
  tree: Tree
}

function formatCoordinate(value: number | null) {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(5)
    : 'Indisponível'
}

export function TreeHistoryScreen({
  deletingRecordId = null,
  onDeleteRecord,
  role,
  tree,
}: TreeHistoryScreenProps) {
  const latestRecord = getLatestRecord(tree)
  const canDelete = role !== UserRole.RESEARCHER
  const orderedRecords = useMemo(() => tree.records.slice().reverse(), [tree.records])
  const [selectedRecordId, setSelectedRecordId] = useState(latestRecord.id)
  const selectedRecord =
    orderedRecords.find((record) => record.id === selectedRecordId) ??
    latestRecord
  const canDeleteSelectedRecord =
    canDelete && Boolean(onDeleteRecord) && !selectedRecord.isSynthetic
  const selectedRecordIndex = orderedRecords.findIndex(
    (record) => record.id === selectedRecord.id
  )
  const isSelectedCurrent = selectedRecordIndex === 0
  const managementHref = getTreeManagementRoute(role)

  function selectRecord(recordId: string) {
    setSelectedRecordId(recordId)
  }

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

          <div className="flex flex-wrap gap-2">
            <Button
              href={managementHref}
              icon={ArrowLeft}
              iconSide="left"
              variant="ghost"
            >
              Voltar
            </Button>
            <Button
              href={getTreeRecordCreateRoute(role, tree.id)}
              icon={PlusCircle}
              iconSide="left"
              variant="outline"
            >
              Novo registro
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <SummaryItem
            label="Histórico aprovado"
            value={getTreeHistorySummary(tree)}
          />
          <SummaryItem
            label="Registro atual"
            value={`v${latestRecord.version} - ${formatDate(latestRecord.registro.ultimaMedicao)}`}
          />
          <SummaryItem
            label="Coordenadas"
            value={`${formatCoordinate(tree.lat)}, ${formatCoordinate(tree.lng)}`}
          />
        </div>
      </DashboardCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(18rem,24rem)_1fr]">
        <details className="group xl:hidden" open>
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl border border-rosewood/10 bg-card px-4 py-4 text-left text-burgundy marker:hidden">
            <div>
              <p className="text-sm tracking-tight">Registros aprovados</p>
              <p className="mt-1 text-xs text-rosewood">
                {orderedRecords.length} versão(ões) disponível(is)
              </p>
            </div>
            <ChevronDown
              size={18}
              className="text-rosewood transition-transform group-open:rotate-180"
              strokeWidth={1.7}
            />
          </summary>

          <DashboardCard className="mt-3 space-y-3 self-start">
            <div>
              <h3 className="text-lg tracking-tight text-burgundy">
                Registros aprovados
              </h3>
              <p className="mt-1 text-sm leading-6 text-rosewood">
                Selecione uma versão para visualizar o registro completo.
              </p>
            </div>

            <div className="space-y-2">
              {orderedRecords.map((record, index) => (
                <RecordListItem
                  key={record.id}
                  isCurrent={index === 0}
                  isSelected={record.id === selectedRecord.id}
                  record={record}
                  onSelect={selectRecord}
                />
              ))}
            </div>
          </DashboardCard>
        </details>

        <DashboardCard className="hidden space-y-3 self-start xl:block">
          <div>
            <h3 className="text-lg tracking-tight text-burgundy">
              Registros aprovados
            </h3>
            <p className="mt-1 text-sm leading-6 text-rosewood">
              Selecione uma versão para visualizar o registro completo.
            </p>
          </div>

          <div className="space-y-2">
            {orderedRecords.map((record, index) => (
              <RecordListItem
                key={record.id}
                isCurrent={index === 0}
                isSelected={record.id === selectedRecord.id}
                record={record}
                onSelect={selectRecord}
              />
            ))}
          </div>
        </DashboardCard>

        <DashboardCard className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl tracking-tight text-burgundy">
                  Registro v{selectedRecord.version}
                </h3>
                {isSelectedCurrent ? (
                  <span className="rounded-full border border-sage/25 bg-sage/12 px-3 py-1 text-xs text-burgundy">
                    Registro atual
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm leading-6 text-rosewood">
                Registrado por {selectedRecord.registro.registradoPor} em{' '}
                {formatDate(selectedRecord.registro.registradoEm)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-rosewood/15 bg-card px-3 py-1 text-xs text-rosewood">
                {selectedRecord.kind === 'initial'
                  ? 'Registro inicial'
                  : 'Medição'}
              </span>
              <span className="rounded-full border border-sage/20 bg-sage/10 px-3 py-1 text-xs text-burgundy">
                {TREE_RECORD_STATUS_LABELS[selectedRecord.status]}
              </span>
              {canDeleteSelectedRecord ? (
                <Button
                  type="button"
                  icon={Trash2}
                  iconSide="left"
                  variant="ghost"
                  size="sm"
                  className="text-burgundy hover:bg-burgundy/6"
                  disabled={deletingRecordId === selectedRecord.id}
                  onClick={() => onDeleteRecord?.(selectedRecord)}
                >
                  {deletingRecordId === selectedRecord.id
                    ? 'Excluindo...'
                    : 'Excluir registro'}
                </Button>
              ) : null}
            </div>
          </div>

          {selectedRecord.isSynthetic ? (
            <div className="rounded-xl border border-amber-700/15 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Este histórico inicial foi reconstruído a partir do cadastro atual da árvore.
              Nenhum registro técnico vinculado foi encontrado no backend para esta árvore.
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-4">
            <SummaryItem
              label="Data da coleta"
              value={formatDate(selectedRecord.localizacao.dataColeta)}
            />
            <SummaryItem
              label="Equipe"
              value={selectedRecord.localizacao.equipe}
            />
            <SummaryItem
              label="Altura"
              value={`${selectedRecord.dimensoes.alturaM} m`}
            />
            <SummaryItem
              label="DAP"
              value={`${selectedRecord.dimensoes.dapCm} cm`}
            />
            <SummaryItem
              label="Copa"
              value={`${selectedRecord.dimensoes.copaM} m`}
            />
            <SummaryItem
              label="Vigor"
              value={formatTreeLabel(selectedRecord.condicao.vigor)}
            />
            <SummaryItem
              label="Ação"
              value={formatTreeLabel(selectedRecord.manejo.acao)}
            />
            <SummaryItem
              label="Prioridade"
              value={formatTreeLabel(selectedRecord.manejo.prioridade)}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-rosewood/10 pt-4">
            <p className="max-w-3xl text-sm leading-6 text-rosewood">
              {selectedRecord.observacoes ??
                'Sem observações adicionais registradas.'}
            </p>
          </div>

          <ExpandedRecordDetails record={selectedRecord} tree={tree} />
        </DashboardCard>
      </div>
    </div>
  )
}

function getTreeManagementRoute(
  role: UserRole.RESEARCHER | UserRole.MANAGER | UserRole.ADMIN
) {
  if (role === UserRole.RESEARCHER) {
    return APP_ROUTES.RESEARCHER_TREES
  }

  if (role === UserRole.MANAGER) {
    return APP_ROUTES.MANAGER_MANAGEMENT
  }

  return APP_ROUTES.ADMIN_MANAGEMENT
}

function RecordListItem({
  isCurrent,
  isSelected,
  onSelect,
  record,
}: {
  isCurrent: boolean
  isSelected: boolean
  onSelect: (recordId: string) => void
  record: TreeMeasurementRecord
}) {
  return (
    <button
      type="button"
      className={[
        'w-full rounded-lg border px-4 py-3 text-left transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2',
        isSelected
          ? 'border-sage/40 bg-sage/12'
          : 'border-rosewood/10 bg-card/55 hover:bg-secondary',
      ].join(' ')}
      onClick={() => onSelect(record.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-burgundy">
            Registro v{record.version}
          </p>
          <p className="mt-1 text-xs text-rosewood">
            {formatDate(record.registro.ultimaMedicao)}
          </p>
        </div>
        {isCurrent ? (
          <span className="rounded-full border border-sage/25 bg-sage/12 px-2 py-0.5 text-[10px] text-burgundy">
            Atual
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-rosewood/15 bg-white px-2 py-0.5 text-[10px] text-rosewood">
          {record.kind === 'initial' ? 'Inicial' : 'Medição'}
        </span>
        <span className="rounded-full border border-sage/20 bg-white px-2 py-0.5 text-[10px] text-burgundy">
          {TREE_RECORD_STATUS_LABELS[record.status]}
        </span>
      </div>
    </button>
  )
}

function ExpandedRecordDetails({
  record,
  tree,
}: {
  record: TreeMeasurementRecord
  tree: Tree
}) {
  const problemItems =
    record.condicao.problemas[0] === 'nenhum'
      ? ['Nenhum problema relatado']
      : record.condicao.problemas.map(formatTreeLabel)

  return (
    <div className="space-y-4 rounded-2xl border border-rosewood/10 bg-card/45 p-4">
      <DetailSection title="Identificação e localização">
        <DetailGrid>
          <SummaryItem label="Nome comum" value={tree.nomeComum} />
          <SummaryItem label="Espécie" value={tree.especie} />
          <SummaryItem label="Latitude" value={formatCoordinate(tree.lat)} />
          <SummaryItem label="Longitude" value={formatCoordinate(tree.lng)} />
          <SummaryItem label="Bairro" value={record.localizacao.bairro} />
          <SummaryItem label="Rua" value={record.localizacao.rua} />
          <SummaryItem
            label="Número"
            value={record.localizacao.numeroResidencia ?? 'Não informado'}
          />
          <SummaryItem label="Equipe" value={record.localizacao.equipe} />
          <SummaryItem
            label="Referência"
            value={record.localizacao.referencia ?? 'Não informada'}
          />
          <SummaryItem
            label="Data da coleta"
            value={formatTreeDate(record.localizacao.dataColeta)}
          />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Dimensões">
        <DetailGrid>
          <SummaryItem label="Altura" value={`${record.dimensoes.alturaM} m`} />
          <SummaryItem label="DAP" value={`${record.dimensoes.dapCm} cm`} />
          <SummaryItem label="Copa" value={`${record.dimensoes.copaM} m`} />
          <SummaryItem
            label="Tipo de medida"
            value={
              record.dimensoes.medidaEstimada
                ? 'Medida estimada'
                : 'Medida aferida'
            }
          />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Condição da árvore">
        <DetailGrid>
          <SummaryItem
            label="Estado geral"
            value={`${record.condicao.estadoGeral}/5`}
          />
          <SummaryItem
            label="Vigor"
            value={formatTreeLabel(record.condicao.vigor)}
          />
          <SummaryItem
            label="Posição do problema"
            value={
              record.condicao.posicaoProblema
                ? formatTreeLabel(record.condicao.posicaoProblema)
                : 'Não informada'
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
          <SummaryItem
            label="Tipo de via"
            value={formatTreeLabel(record.estruturaRisco.tipoVia)}
          />
        </DetailGrid>
        <TagRow
          label="Tronco"
          items={record.estruturaRisco.tronco.map(formatTreeLabel)}
        />
        <TagRow
          label="Base / colo"
          items={record.estruturaRisco.baseColo.map(formatTreeLabel)}
        />
        <TagRow
          label="Copa"
          items={record.estruturaRisco.copa.map(formatTreeLabel)}
        />
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
          <SummaryItem
            label="Fiação"
            value={formatTreeLabel(record.conflitos.fiacao)}
          />
          <SummaryItem
            label="Calçada"
            value={formatTreeLabel(record.conflitos.calcada)}
          />
          <SummaryItem
            label="Iluminação"
            value={formatTreeLabel(record.conflitos.iluminacao)}
          />
          <SummaryItem
            label="Edificação"
            value={formatTreeLabel(record.conflitos.edificacao)}
          />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Manejo">
        <DetailGrid>
          <SummaryItem
            label="Ação"
            value={formatTreeLabel(record.manejo.acao)}
          />
          <SummaryItem
            label="Prioridade"
            value={formatTreeLabel(record.manejo.prioridade)}
          />
        </DetailGrid>
      </DetailSection>

      <DetailSection title="Registro">
        <DetailGrid>
          <SummaryItem
            label="Última medição"
            value={formatTreeDate(record.registro.ultimaMedicao)}
          />
          <SummaryItem
            label="Registrado em"
            value={formatTreeDate(record.registro.registradoEm)}
          />
          <SummaryItem
            label="Registrado por"
            value={record.registro.registradoPor}
          />
          <SummaryItem
            label="Aprovação"
            value={formatTreeLabel(record.registro.aprovacao)}
          />
          <SummaryItem
            label="Fotos anexadas"
            value={String(record.registro.fotos.length)}
          />
        </DetailGrid>
        {record.registro.motivoRejeicao ? (
          <p className="text-sm leading-6 text-rosewood">
            <span className="font-medium text-burgundy">
              Motivo da rejeição:
            </span>{' '}
            {record.registro.motivoRejeicao}
          </p>
        ) : null}
      </DetailSection>

      <DetailSection title="Observações">
        <p className="text-sm leading-6 text-rosewood">
          {record.observacoes ?? 'Sem observações adicionais registradas.'}
        </p>
      </DetailSection>
    </div>
  )
}

function DetailSection({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <details className="group rounded-xl border border-rosewood/10 bg-white/40 p-3 md:rounded-none md:border-0 md:bg-transparent md:p-0" open>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 md:hidden">
        <span className="text-sm font-medium uppercase tracking-[0.18em] text-rosewood/80">
          {title}
        </span>
        <ChevronDown
          size={16}
          className="text-rosewood transition-transform group-open:rotate-180"
          strokeWidth={1.7}
        />
      </summary>
      <section className="mt-3 space-y-3 md:mt-0">
        <h4 className="hidden text-sm font-medium uppercase tracking-[0.18em] text-rosewood/80 md:block">
          {title}
        </h4>
        {children}
      </section>
    </details>
  )
}

function DetailGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{children}</div>
  )
}

function TagRow({ items, label }: { items: string[]; label: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/75">
        {label}
      </p>
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
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-rosewood/10 bg-card/55 px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/75">
        {label}
      </p>
      <p className="mt-2 text-sm text-burgundy">{value}</p>
    </div>
  )
}
