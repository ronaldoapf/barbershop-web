import axios, { type AxiosError, type AxiosInstance } from "axios"
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "./auth-storage"

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const retriedRequests = new WeakSet<object>()

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw new Error("Missing refresh token")
  }

  const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    { refreshToken },
  )

  saveTokens(data.accessToken, data.refreshToken)
  return data.accessToken
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest.url?.includes("/auth/refresh") ||
      retriedRequests.has(originalRequest)
    ) {
      return Promise.reject(error)
    }

    retriedRequests.add(originalRequest)

    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const accessToken = await refreshPromise
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      clearTokens()
      window.location.href = "/login"
      return Promise.reject(refreshError)
    }
  },
)
