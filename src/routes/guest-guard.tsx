import { Navigate, Outlet } from "react-router-dom"
import { Loading } from "@/components/loading"
import { useAuth } from "@/hooks/use-auth"

export function GuestGuard() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loading />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }

  return <Outlet />
}
