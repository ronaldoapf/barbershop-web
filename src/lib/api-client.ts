import axios, { type AxiosError, type AxiosInstance } from "axios"

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

const retriedRequests = new WeakSet<object>()

let refreshPromise: Promise<void> | null = null

async function refreshAccessToken(): Promise<void> {
  await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    {},
    { withCredentials: true },
  )
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
      await refreshPromise
      return apiClient(originalRequest)
    } catch (refreshError) {
      if (window.location.pathname.startsWith("/app")) {
        window.location.href = "/login"
      }
      return Promise.reject(refreshError)
    }
  },
)
