'use client'

import { useMemo, useState } from 'react'

export function usePagination(totalItems: number, pageSize = 10) {
  const [page, setPage] = useState(1)
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  )

  return { page, setPage, totalPages, pageSize }
}
