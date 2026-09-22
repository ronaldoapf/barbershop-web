import { apiClient } from "@/lib/api-client"
import type { ListActiveBarbersResponse } from "./types"

const baseURL = 'barbers'

export const BarbersApi = {
  listActiveBarbers: async (): Promise<ListActiveBarbersResponse> => {
    const { data } = await apiClient.get(`/${baseURL}`)
    return data
  },
}
