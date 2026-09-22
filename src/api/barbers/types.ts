import type { PaginatedResponse } from "@/schemas/shared"

export interface ActiveBarber {
  id: string
  name: string
  avatarUrl: string | null
  commissionPercentage: number
  createdAt: string
}

export type ListActiveBarbersResponse = PaginatedResponse<ActiveBarber>
