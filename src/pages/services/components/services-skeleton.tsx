import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function ServiceRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b px-4 py-3 last:border-b-0">
      <Skeleton className="h-9 w-9 rounded-md" />
      <div className="flex flex-1 flex-col gap-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-10" />
      <div className="flex -space-x-2">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
      <Skeleton className="h-5 w-9 rounded-full" />
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-4" />
    </div>
  )
}

function ServicesStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="flex items-center gap-3">
            <Skeleton className="size-9 shrink-0 rounded-md" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-3 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function ServicesSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>

      <ServicesStatsSkeleton />

      <div className="flex items-center gap-3">
        <Skeleton className="h-11 flex-1 rounded-full" />
        <Skeleton className="h-11 w-28 rounded-md" />
        <Skeleton className="h-11 w-44 rounded-md" />
      </div>

      <div className="rounded-lg border">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <Skeleton className="h-4 w-4" />
        </div>
        {Array.from({ length: 8 }).map((_, index) => (
          <ServiceRowSkeleton key={index} />
        ))}
      </div>
    </div>
  )
}
