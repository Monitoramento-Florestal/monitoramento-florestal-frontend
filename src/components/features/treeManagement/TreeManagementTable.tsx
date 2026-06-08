'use client'

import { Eye, Pencil, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { TREE_STATUS_COLORS } from '@/components/features/map/mapIcons'
import { UserRole } from '@/constants/roles'
import { getTreeHistoryRoute } from '@/constants/routes'
import type { TreePreview } from '@/types/trees'
import { formatDate } from '@/utils/format'
import {
  getTreeManagementStatusLabel,
  type TreeManagementPolicy,
} from '@/utils/treeManagement'

interface TreeManagementTableProps {
  onDeleteTree?: (tree: TreePreview) => void
  onEditTree?: (tree: TreePreview) => void
  policy: TreeManagementPolicy
  role: UserRole
  trees: TreePreview[]
}

export function TreeManagementTable({
  onDeleteTree,
  onEditTree,
  policy,
  role,
  trees,
}: TreeManagementTableProps) {
  return (
    <>
      <div className="divide-y divide-rosewood/8 md:hidden">
        {trees.map((tree) => {
          const statusColor = TREE_STATUS_COLORS[tree.status]
          const historyHref = getTreeHistoryRoute(
            role as UserRole.RESEARCHER | UserRole.MANAGER | UserRole.ADMIN,
            tree.id
          )

          return (
            <article key={tree.id} className="space-y-4 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-rosewood/75">
                    {tree.codigo}
                  </p>
                  <h3 className="mt-1 text-base tracking-tight text-burgundy">
                    {tree.nomeComum}
                  </h3>
                  <p className="mt-1 text-sm text-rosewood">{tree.especie}</p>
                  <p className="mt-1 text-xs leading-5 text-rosewood/80">
                    {tree.localizacao.bairro} · {tree.localizacao.rua}
                  </p>
                </div>

                <span
                  className="inline-flex shrink-0 rounded-full border px-2.5 py-1 text-xs"
                  style={{
                    borderColor: `${statusColor.stroke}35`,
                    backgroundColor: `${statusColor.fill}18`,
                    color: statusColor.stroke,
                  }}
                >
                  {getTreeManagementStatusLabel(tree.status)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-2xl bg-secondary/35 px-3 py-3">
                <MetricItem label="Altura" value={`${tree.dimensoes.alturaM} m`} />
                <MetricItem label="DAP" value={`${tree.dimensoes.dapCm} cm`} />
                <MetricItem label="Copa" value={`${tree.dimensoes.copaM} m`} />
              </div>

              {tree.registro.ultimaMedicao ? (
                <p className="text-xs text-rosewood/75">
                  Última medição: {formatDate(tree.registro.ultimaMedicao)}
                </p>
              ) : null}

              <div className="grid gap-2">
                {policy.canOpenDetails ? (
                  <Button
                    href={historyHref}
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    iconSide="left"
                    className="h-10 justify-start rounded-xl border border-rosewood/12 bg-card/70 text-rosewood hover:bg-secondary"
                  >
                    Ver histórico
                  </Button>
                ) : null}

                <div className="grid gap-2 sm:grid-cols-2">
                  {policy.canDirectEdit && onEditTree ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={Pencil}
                      iconSide="left"
                      className="h-10 justify-start rounded-xl border border-rosewood/12 bg-card/70 text-rosewood hover:bg-secondary"
                      onClick={() => onEditTree(tree)}
                    >
                      Editar
                    </Button>
                  ) : null}

                  {policy.canDelete && onDeleteTree ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={Trash2}
                      iconSide="left"
                      className="h-10 justify-start rounded-xl border border-burgundy/10 bg-burgundy/4 text-burgundy hover:bg-burgundy/6"
                      onClick={() => onDeleteTree(tree)}
                    >
                      Excluir
                    </Button>
                  ) : null}
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="text-left text-[10px] uppercase tracking-[0.18em] text-rosewood/75">
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              Código
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              Espécie
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              Altura
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              DAP
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              Copa
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 font-medium">
              Status
            </th>
            <th className="border-b border-rosewood/10 px-4 py-4 text-right font-medium">
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {trees.map((tree) => {
            const statusColor = TREE_STATUS_COLORS[tree.status]
            const historyHref = getTreeHistoryRoute(
              role as UserRole.RESEARCHER | UserRole.MANAGER | UserRole.ADMIN,
              tree.id
            )

            return (
              <tr
                key={tree.id}
                className="transition-colors hover:bg-secondary/45"
              >
                <td className="border-b border-rosewood/8 px-4 py-5 text-sm text-rosewood">
                  {tree.codigo}
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5">
                  <div className="text-base tracking-tight text-burgundy">
                    {tree.nomeComum}
                  </div>
                  <div className="mt-1 text-sm text-rosewood">
                    {tree.especie}
                    <span className="block text-xs text-rosewood/70">
                      {tree.localizacao.bairro} · {tree.localizacao.rua}
                    </span>
                  </div>
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5 text-sm tabular-nums text-burgundy">
                  {tree.dimensoes.alturaM} m
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5 text-sm tabular-nums text-burgundy">
                  {tree.dimensoes.dapCm} cm
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5 text-sm tabular-nums text-burgundy">
                  {tree.dimensoes.copaM} m
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5">
                  <span
                    className="inline-flex rounded-full border px-2.5 py-1 text-xs"
                    style={{
                      borderColor: `${statusColor.stroke}35`,
                      backgroundColor: `${statusColor.fill}18`,
                      color: statusColor.stroke,
                    }}
                  >
                    {getTreeManagementStatusLabel(tree.status)}
                  </span>
                  {tree.registro.ultimaMedicao ? (
                    <div className="mt-2 text-xs text-rosewood/75">
                      Última medição: {formatDate(tree.registro.ultimaMedicao)}
                    </div>
                  ) : null}
                </td>
                <td className="border-b border-rosewood/8 px-4 py-5">
                  <div className="flex justify-end gap-2">
                    {policy.canOpenDetails ? (
                      <Button
                        href={historyHref}
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        iconSide="left"
                        className="text-rosewood hover:bg-secondary"
                      >
                        Ver histórico
                      </Button>
                    ) : null}

                    {policy.canDirectEdit && onEditTree ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={Pencil}
                        iconSide="left"
                        className="text-rosewood hover:bg-secondary"
                        onClick={() => onEditTree(tree)}
                      >
                        Editar
                      </Button>
                    ) : null}

                    {policy.canDelete && onDeleteTree ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        icon={Trash2}
                        iconSide="left"
                        className="text-burgundy hover:bg-burgundy/6"
                        onClick={() => onDeleteTree(tree)}
                      >
                        Excluir
                      </Button>
                    ) : null}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        </table>
      </div>
    </>
  )
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.16em] text-rosewood/70">
        {label}
      </p>
      <p className="mt-1 text-sm tabular-nums text-burgundy">{value}</p>
    </div>
  )
}
