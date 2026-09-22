import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Contact, Scissors, Users, type LucideIcon } from "lucide-react"
import { Link } from "react-router-dom"

interface NavMainItem {
  title: string
  icon: LucideIcon
  href: string
}

const navMainItems: NavMainItem[] = [
  { title: "Serviços", icon: Scissors, href:'/app/services' },
  { title: "Clientes", icon: Contact, href:'/app/customers' },
  { title: "Profissionais", icon: Users, href:'/app/professionals' },
]

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Gestão Operacional</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        {navMainItems.map(({ title, icon: Icon, href }) => (
          <SidebarMenu key={title}>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={title} className="flex items-center gap-2" asChild>
                <Link to={href}>
                  <Icon />
                  <span>{title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}