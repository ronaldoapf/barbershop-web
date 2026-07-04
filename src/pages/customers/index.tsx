import { useSearchParams } from "react-router-dom"

import { useListCustomers } from "@/api/users/hooks"
import { CreateCustomerSheet } from "./components/create-customer-sheet"
import { CustomersError } from "./components/customers-error"
import { CustomersSkeleton } from "./components/customers-skeleton"
import { CustomersStats } from "./components/customers-stats"
import { CustomersTable } from "./components/customers-table"

const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 10

export function Customers() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page") ?? DEFAULT_PAGE)
  const limit = Number(searchParams.get("per_page") ?? DEFAULT_LIMIT)

  const {
    data: customersData,
    isLoading: isLoadingCustomers,
    isFetching: isFetchingCustomers,
    error: errorCustomers,
    refetch: refetchCustomers,
  } = useListCustomers({ page, limit })

  const now = new Date()
  const withLoyaltyPointsCount =
    customersData?.data.filter((customer) => customer.loyaltyPoints > 0).length ?? 0
  const newThisMonthCount =
    customersData?.data.filter((customer) => {
      const createdAt = new Date(customer.createdAt)
      return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
    }).length ?? 0

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

  if (isLoadingCustomers) {
    return <CustomersSkeleton />
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie a base de clientes cadastrados na barbearia.
          </p>
        </div>
        <CreateCustomerSheet />
      </div>

      {errorCustomers ? (
        <CustomersError onRetry={refetchCustomers} isRetrying={isFetchingCustomers} />
      ) : (
        <>
          <CustomersStats
            total={customersData?.total ?? 0}
            withLoyaltyPoints={withLoyaltyPointsCount}
            newThisMonth={newThisMonthCount}
          />

          <CustomersTable
            page={page}
            limit={limit}
            setParam={setParam}
            searchParams={searchParams}
            data={customersData?.data ?? []}
            rowCount={customersData?.total ?? 0}
            pageCount={customersData ? Math.ceil(customersData.total / customersData.limit) : 0}
          />
        </>
      )}
    </div>
  )
}
