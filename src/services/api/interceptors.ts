import type { AxiosError } from 'axios'

export function normalizeApiError(error: AxiosError) {
  return {
    status: error.response?.status ?? 500,
    message: error.message,
  }
}
