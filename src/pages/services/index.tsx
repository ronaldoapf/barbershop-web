import { useListServices } from "@/api/services/hooks";
import { ServicesTable } from "./components/services-table";
import { useSearchParams } from "react-router-dom";
import { ServiceStatus } from "@/api/services/types";
import { ServicesError } from "./components/services-error";
import { ServicesSkeleton } from "./components/services-skeleton";
import { CreateServiceSheet } from "./components/create-service-sheet";
import { useEffect } from "react";

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export function Services() {

  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page") ?? DEFAULT_PAGE)
  const limit = Number(searchParams.get("per_page") ?? DEFAULT_LIMIT)

  const status = searchParams.get("status") as ServiceStatus
  
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (!next.has("status")) {
        next.set("status", "ACTIVE")
      }
      return next
    })
  }, [])

  const { 
    data: servicesData, 
    isLoading: isLoadingServices, 
    isFetching: isFetchingServices, 
    error: errorServices,
    refetch: refetchServices 
  } = useListServices({ 
    limit,
    page,
    status
  })

  if (isLoadingServices) {
    return <ServicesSkeleton />
  }

  function setParam(key: string, value: string | null): void {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value === null) {
        next.delete(key)
      } else {
        next.set(key, value)
      }
      if (key !== "page" && key !== "per_page") {
        next.delete("page")
      }
      return next
    })
  }

  return (
    <section className="space-y-6t">
      <header className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Serviços</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie o catálogo de serviços oferecidos aos clientes da barbearia.
          </p>
        </div>

        <CreateServiceSheet order={servicesData?.total ?? 0} />
      </header>

      {errorServices ? (
        <ServicesError onRetry={refetchServices} isRetrying={isFetchingServices} />
      ) : (
        <ServicesTable
          page={page}
          limit={limit}
          setParam={setParam}
          searchParams={searchParams}
          data={servicesData?.data ?? []}
          rowCount={servicesData?.total ?? 0}
          pageCount={servicesData ? Math.ceil(servicesData.total / servicesData.limit) : 0}
        />
      )}
    </section>
  )
}