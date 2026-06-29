import { type ReactNode, useState } from "react"
import { toast } from "sonner"
import {
  BellIcon,
  CheckIcon,
  EditIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react"

import {
  Stepper,
  StepperHeader,
  StepperNavigation,
  StepperPanel,
  useStepperContext,
} from "@/components/stepper"
import type { StepDefinition } from "@/components/stepper"

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { DatePicker } from "@/components/date-picker"
import { cn } from "@/lib/utils"

interface SectionProps {
  title: string
  description: string
  children: ReactNode
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-1 border-b border-border pb-3">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  )
}

interface PreviewProps {
  label: string
  children: ReactNode
  className?: string
}

function Preview({ label, children, className }: PreviewProps) {
  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 rounded-lg border border-border p-4",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

function DatePickerSection() {
  const [date, setDate] = useState<Date | undefined>()
  const [dateWithValue, setDateWithValue] = useState<Date | undefined>(new Date(2025, 5, 21))

  return (
    <Section
      title="Date Picker"
      description="Seletor de data com input mascarado e calendário popover."
    >
      <Preview label="Padrão" className="flex-col items-start gap-4">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label>Selecione uma data</Label>
          <DatePicker value={date} onChange={setDate} />
        </div>
      </Preview>
      <Preview label="Com valor inicial" className="flex-col items-start gap-4">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label>Data de início</Label>
          <DatePicker value={dateWithValue} onChange={setDateWithValue} />
        </div>
      </Preview>
      <Preview label="Desabilitado">
        <div className="w-full max-w-sm">
          <DatePicker value={new Date(2025, 0, 1)} disabled />
        </div>
      </Preview>
      <Preview label="Inválido" className="flex-col items-start gap-4">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label htmlFor="date-invalid">Data de nascimento</Label>
          <DatePicker invalid placeholder="dd/mm/aaaa" />
          <p className="text-[0.8rem] text-destructive">Data inválida.</p>
        </div>
      </Preview>
    </Section>
  )
}

const STEPPER_STEPS: StepDefinition[] = [
  { id: "pessoal", label: "Dados Pessoais", description: "Informações básicas" },
  { id: "endereco", label: "Endereço", description: "Localização e CEP" },
  { id: "pagamento", label: "Pagamento", description: "Forma de pagamento" },
  { id: "revisao", label: "Revisão", description: "Confirme os dados" },
]

function StepperPanelPessoal() {
  return (
    <div className="space-y-3">
      <div className="grid w-full gap-1.5">
        <Label>Nome completo</Label>
        <Input placeholder="Seu nome completo" />
      </div>
      <div className="grid w-full gap-1.5">
        <Label>E-mail</Label>
        <Input type="email" placeholder="voce@exemplo.com" />
      </div>
    </div>
  )
}

function StepperPanelEndereco() {
  const { currentStep, markStepError, clearStepError } = useStepperContext()
  return (
    <div className="space-y-3">
      <div className="grid w-full gap-1.5">
        <Label>CEP</Label>
        <Input placeholder="00000-000" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>Cidade</Label>
          <Input placeholder="São Paulo" />
        </div>
        <div className="grid gap-1.5">
          <Label>Estado</Label>
          <Input placeholder="SP" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => markStepError(currentStep)}
        >
          Simular erro
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => clearStepError(currentStep)}
        >
          Limpar erro
        </Button>
      </div>
    </div>
  )
}

function StepperPanelPagamento() {
  return (
    <div className="space-y-3">
      <div className="grid w-full gap-1.5">
        <Label>Número do cartão</Label>
        <Input placeholder="0000 0000 0000 0000" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="grid gap-1.5">
          <Label>Validade</Label>
          <Input placeholder="MM/AA" />
        </div>
        <div className="grid gap-1.5">
          <Label>CVV</Label>
          <Input placeholder="000" />
        </div>
      </div>
    </div>
  )
}

function StepperPanelRevisao() {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">Tudo pronto!</p>
      <p className="text-sm text-muted-foreground">
        Revise os dados acima e clique em Concluir para finalizar.
      </p>
    </div>
  )
}

function StepperSection() {
  return (
    <Section
      title="Stepper"
      description="Navegação em etapas para formulários e fluxos multi-step. No passo Endereço, use os botões para testar o estado de erro."
    >
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Padrão
        </p>
        <div className="rounded-lg border border-border p-6">
          <Stepper steps={STEPPER_STEPS}>
            <StepperHeader />
            <StepperPanel step={0}>
              <StepperPanelPessoal />
            </StepperPanel>
            <StepperPanel step={1}>
              <StepperPanelEndereco />
            </StepperPanel>
            <StepperPanel step={2}>
              <StepperPanelPagamento />
            </StepperPanel>
            <StepperPanel step={3}>
              <StepperPanelRevisao />
            </StepperPanel>
            <StepperNavigation />
          </Stepper>
        </div>
      </div>
    </Section>
  )
}

export function ComponentsPage() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl space-y-16 px-6 py-14">
          <header className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Design System / Referência
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Componentes
            </h1>
            <p className="max-w-xl leading-relaxed text-muted-foreground">
              Catálogo de todos os componentes disponíveis no projeto, com suas variantes e estados.
            </p>
          </header>

          <Section title="Button" description="Botão de ação com 6 variantes e 8 tamanhos.">
            <Preview label="Variantes">
              <Button variant="default">Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </Preview>
            <Preview label="Tamanhos">
              <Button size="xs">XS</Button>
              <Button size="sm">SM</Button>
              <Button size="default">Default</Button>
              <Button size="lg">LG</Button>
            </Preview>
            <Preview label="Ícone">
              <Button size="icon-xs" aria-label="Adicionar">
                <PlusIcon />
              </Button>
              <Button size="icon-sm" aria-label="Adicionar">
                <PlusIcon />
              </Button>
              <Button size="icon" aria-label="Adicionar">
                <PlusIcon />
              </Button>
              <Button size="icon-lg" aria-label="Adicionar">
                <PlusIcon />
              </Button>
            </Preview>
            <Preview label="Com ícone inline">
              <Button>
                <PlusIcon data-icon="inline-start" /> Criar
              </Button>
              <Button variant="outline">
                <EditIcon data-icon="inline-start" /> Editar
              </Button>
              <Button variant="destructive">
                <TrashIcon data-icon="inline-start" /> Excluir
              </Button>
            </Preview>
            <Preview label="Desabilitado">
              <Button disabled>Default</Button>
              <Button variant="outline" disabled>
                Outline
              </Button>
              <Button variant="secondary" disabled>
                Secondary
              </Button>
              <Button variant="ghost" disabled>
                Ghost
              </Button>
              <Button variant="destructive" disabled>
                Destructive
              </Button>
            </Preview>
          </Section>

          <Section title="Badge" description="Etiqueta de status e categorização.">
            <Preview label="Variantes">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="ghost">Ghost</Badge>
              <Badge variant="link">Link</Badge>
            </Preview>
            <Preview label="Com ícone">
              <Badge>
                <CheckIcon /> Aprovado
              </Badge>
              <Badge variant="destructive">
                <TrashIcon /> Removido
              </Badge>
              <Badge variant="outline">
                <BellIcon /> Pendente
              </Badge>
            </Preview>
          </Section>

          <Section
            title="Avatar"
            description="Imagem de perfil com fallback, badge e agrupamento."
          >
            <Preview label="Tamanhos">
              <Avatar size="sm">
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar size="default">
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            </Preview>
            <Preview label="Fallback">
              <Avatar size="sm">
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar size="default">
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>EF</AvatarFallback>
              </Avatar>
            </Preview>
            <Preview label="Com badge">
              <Avatar>
                <AvatarFallback>RA</AvatarFallback>
                <AvatarBadge />
              </Avatar>
              <Avatar size="lg">
                <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
                <AvatarFallback>SC</AvatarFallback>
                <AvatarBadge>
                  <BellIcon />
                </AvatarBadge>
              </Avatar>
            </Preview>
            <Preview label="Grupo">
              <AvatarGroup>
                <Avatar>
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>B</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
                <AvatarGroupCount>+5</AvatarGroupCount>
              </AvatarGroup>
            </Preview>
          </Section>

          <Section title="Input" description="Campo de texto para entrada de dados.">
            <Preview label="Padrão">
              <Input className="max-w-sm" placeholder="Digite algo..." />
            </Preview>
            <Preview label="Com label" className="flex-col items-start">
              <div className="grid w-full max-w-sm gap-1.5">
                <Label htmlFor="demo-email">E-mail</Label>
                <Input
                  id="demo-email"
                  type="email"
                  placeholder="usuario@exemplo.com"
                />
              </div>
            </Preview>
            <Preview label="Desabilitado">
              <Input className="max-w-sm" placeholder="Campo desabilitado" disabled />
            </Preview>
            <Preview label="Inválido" className="flex-col items-start">
              <div className="grid w-full max-w-sm gap-1.5">
                <Label htmlFor="demo-invalid">Nome</Label>
                <Input id="demo-invalid" aria-invalid placeholder="Campo obrigatório" />
                <p className="text-[0.8rem] text-destructive">
                  Este campo é obrigatório.
                </p>
              </div>
            </Preview>
          </Section>

          <Section
            title="Select"
            description="Seleção de uma opção em uma lista suspensa."
          >
            <Preview label="Padrão">
              <Select>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Frutas</SelectLabel>
                    <SelectItem value="apple">Maçã</SelectItem>
                    <SelectItem value="banana">Banana</SelectItem>
                    <SelectItem value="orange">Laranja</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Preview>
            <Preview label="Tamanho pequeno">
              <Select>
                <SelectTrigger size="sm" className="w-40">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Opção A</SelectItem>
                  <SelectItem value="b">Opção B</SelectItem>
                  <SelectItem value="c">Opção C</SelectItem>
                </SelectContent>
              </Select>
            </Preview>
            <Preview label="Desabilitado">
              <Select disabled>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Desabilitado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="x">Opção</SelectItem>
                </SelectContent>
              </Select>
            </Preview>
          </Section>

          <Section
            title="Tabs"
            description="Navegação por abas com variante pill e line."
          >
            <Preview label="Pill (padrão)" className="block">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList>
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="activity">Atividade</TabsTrigger>
                  <TabsTrigger value="settings">Configurações</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <p className="pt-2 text-sm text-muted-foreground">
                    Conteúdo da aba Visão Geral.
                  </p>
                </TabsContent>
                <TabsContent value="activity">
                  <p className="pt-2 text-sm text-muted-foreground">
                    Conteúdo da aba Atividade.
                  </p>
                </TabsContent>
                <TabsContent value="settings">
                  <p className="pt-2 text-sm text-muted-foreground">
                    Conteúdo das Configurações.
                  </p>
                </TabsContent>
              </Tabs>
            </Preview>
            <Preview label="Line" className="block">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList variant="line">
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="activity">Atividade</TabsTrigger>
                  <TabsTrigger value="settings">Configurações</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <p className="pt-2 text-sm text-muted-foreground">
                    Conteúdo da aba Visão Geral.
                  </p>
                </TabsContent>
                <TabsContent value="activity">
                  <p className="pt-2 text-sm text-muted-foreground">
                    Conteúdo da aba Atividade.
                  </p>
                </TabsContent>
                <TabsContent value="settings">
                  <p className="pt-2 text-sm text-muted-foreground">
                    Conteúdo das Configurações.
                  </p>
                </TabsContent>
              </Tabs>
            </Preview>
          </Section>

          <Section
            title="Skeleton"
            description="Placeholder animado para estados de carregamento."
          >
            <Preview label="Formas básicas" className="flex-col items-start">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
            </Preview>
            <Preview label="Card" className="flex-col items-start">
              <div className="flex w-full items-center gap-3">
                <Skeleton className="size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
              <Skeleton className="mt-2 h-24 w-full" />
            </Preview>
          </Section>

          <Section
            title="Separator"
            description="Divisor visual entre blocos de conteúdo."
          >
            <Preview label="Horizontal" className="flex-col items-start gap-3">
              <p className="text-sm text-foreground">Seção A</p>
              <Separator />
              <p className="text-sm text-foreground">Seção B</p>
            </Preview>
            <Preview label="Vertical">
              <div className="flex h-6 items-center gap-3 text-sm text-foreground">
                <span>Início</span>
                <Separator orientation="vertical" />
                <span>Meio</span>
                <Separator orientation="vertical" />
                <span>Fim</span>
              </div>
            </Preview>
          </Section>

          <Section
            title="Tooltip"
            description="Dica contextual exibida ao passar o cursor."
          >
            <Preview label="Padrão">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Passe o cursor aqui</Button>
                </TooltipTrigger>
                <TooltipContent>Este é um tooltip</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" aria-label="Perfil">
                    <UserIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Perfil do usuário</TooltipContent>
              </Tooltip>
            </Preview>
          </Section>

          <Section
            title="Pagination"
            description="Navegação entre páginas de conteúdo paginado."
          >
            <Preview label="Padrão">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      2
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">10</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </Preview>
          </Section>

          <Section
            title="Sheet"
            description="Painel lateral deslizante para conteúdo contextual."
          >
            <Preview label="Lados">
              {(["right", "left", "top", "bottom"] as const).map((side) => (
                <Sheet key={side}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="capitalize">
                      {side}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side={side}>
                    <SheetHeader>
                      <SheetTitle>Painel — {side}</SheetTitle>
                      <SheetDescription>
                        Conteúdo do painel lateral. Use para filtros, formulários ou
                        detalhes contextuais.
                      </SheetDescription>
                    </SheetHeader>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button>Fechar</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              ))}
            </Preview>
          </Section>

          <DatePickerSection />

          <StepperSection />

          <Section
            title="Toast (Sonner)"
            description="Notificações temporárias para feedback de ações."
          >
            <Preview label="Tipos">
              <Button variant="outline" onClick={() => toast("Mensagem padrão")}>
                Default
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("Operação realizada com sucesso!")}
              >
                Success
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.error("Ocorreu um erro inesperado.")}
              >
                Error
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info("Aqui vai uma informação importante.")}
              >
                Info
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.warning("Atenção: esta ação é irreversível.")}
              >
                Warning
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.loading("Carregando dados...")}
              >
                Loading
              </Button>
            </Preview>
          </Section>
        </div>
      </div>
    </TooltipProvider>
  )
}
