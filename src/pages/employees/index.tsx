import { useSearchParams } from "react-router-dom"

import { useListBarbers } from "@/api/users/hooks"
import { CreateEmployeeSheet } from "./components/create-employee-sheet"
import { EmployeesError } from "./components/employees-error"
import { EmployeesSkeleton } from "./components/employees-skeleton"
import { EmployeesStats } from "./components/employees-stats"
import { EmployeesTable } from "./components/employees-table"

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export function Employees() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page") ?? DEFAULT_PAGE)
  const limit = Number(searchParams.get("per_page") ?? DEFAULT_LIMIT)

  const {
    data: employeesData,
    isLoading: isLoadingEmployees,
    isFetching: isFetchingEmployees,
    error: errorEmployees,
    refetch: refetchEmployees,
  } = useListBarbers({ page, limit })

  const now = new Date()
  const newThisMonthCount =
    employeesData?.data.filter((employee) => {
      const createdAt = new Date(employee.createdAt)
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
    }).length ?? 0

  const averageCommission = employeesData?.data.length
    ? employeesData.data.reduce((sum, employee) => sum + employee.commissionPercentage, 0) /
      employeesData.data.length
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

  if (isLoadingEmployees) {
    return <EmployeesSkeleton />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Funcionários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie a equipe de barbeiros que atende na barbearia.
          </p>
        </div>
        <CreateEmployeeSheet />
      </div>

      {errorEmployees ? (
        <EmployeesError onRetry={refetchEmployees} isRetrying={isFetchingEmployees} />
      ) : (
        <>
          <EmployeesStats
            total={employeesData?.total ?? 0}
            averageCommission={averageCommission}
            newThisMonth={newThisMonthCount}
          />

          <EmployeesTable
            page={page}
            limit={limit}
            setParam={setParam}
            searchParams={searchParams}
            data={employeesData?.data ?? []}
            rowCount={employeesData?.total ?? 0}
            pageCount={employeesData ? Math.ceil(employeesData.total / employeesData.limit) : 0}
          />
        </>
      )}
    </div>
  )
}
