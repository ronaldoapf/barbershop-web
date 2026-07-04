import { Percent, Scissors, UserPlus, type LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
}

interface EmployeesStatsProps {
  total: number
  averageCommission: number
  newThisMonth: number
}

function StatCard({ icon: Icon, label, value }: StatCardProps): React.JSX.Element {
  return (
    <Card>
      <CardContent className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg leading-tight font-semibold tabular-nums text-foreground">
            {value}
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function EmployeesStats({ total, averageCommission, newThisMonth }: EmployeesStatsProps): React.JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard icon={Scissors} label="Funcionários cadastrados" value={String(total)} />
      <StatCard icon={Percent} label="Comissão média" value={`${averageCommission.toFixed(1)}%`} />
      <StatCard icon={UserPlus} label="Novos este mês" value={String(newThisMonth)} />
    </div>
  )
}
