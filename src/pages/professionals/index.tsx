import { useSearchParams } from "react-router-dom"

import { useListActiveBarbers } from "@/api/barbers/hooks"
import { CreateProfessionalSheet } from "./components/create-professional-sheet"
import { ProfessionalsError } from "./components/professionals-error"
import { ProfessionalsSkeleton } from "./components/professionals-skeleton"
import { ProfessionalsStats } from "./components/professionals-stats"
import { ProfessionalsTable } from "./components/professionals-table"

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export function Professionals(): React.JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page") ?? DEFAULT_PAGE)
  const limit = Number(searchParams.get("per_page") ?? DEFAULT_LIMIT)

  const {
    data: professionalsData,
    isLoading: isLoadingProfessionals,
    isFetching: isFetchingProfessionals,
    error: errorProfessionals,
    refetch: refetchProfessionals,
  } = useListActiveBarbers()

  const now = new Date()
  const newThisMonthCount =
    professionalsData?.data.filter((professional) => {
      const createdAt = new Date(professional.createdAt)
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
    }).length ?? 0

  const averageCommission = professionalsData?.data.length
    ? professionalsData.data.reduce((sum, professional) => sum + professional.commissionPercentage, 0) /
      professionalsData.data.length
    : 0

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

  if (isLoadingProfessionals) {
    return <ProfessionalsSkeleton />
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Profissionais</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie a equipe de profissionais que atendem na barbearia.
          </p>
        </div>
        <CreateProfessionalSheet />
      </div>

      {errorProfessionals ? (
        <ProfessionalsError onRetry={refetchProfessionals} isRetrying={isFetchingProfessionals} />
      ) : (
        <>
          <ProfessionalsStats
            total={professionalsData?.total ?? 0}
            averageCommission={averageCommission}
            newThisMonth={newThisMonthCount}
          />

          <ProfessionalsTable
            page={page}
            limit={limit}
            setParam={setParam}
            searchParams={searchParams}
            data={professionalsData?.data ?? []}
            rowCount={professionalsData?.total ?? 0}
            pageCount={professionalsData ? Math.ceil(professionalsData.total / professionalsData.limit) : 0}
          />
        </>
      )}
    </section>
  )
}
