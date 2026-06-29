import { type ReactNode, useState } from "react"
import { toast } from "sonner"
import { SearchIcon, SendIcon, UserIcon, MailIcon, LockIcon } from "lucide-react"

import { Dropzone } from "@/components/dropzone"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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
          "flex flex-wrap items-center gap-4 rounded-lg border border-border p-4",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

function InputSection() {
  return (
    <Section title="Input" description="Campo de texto para entrada de dados em diversas variações.">
      <Preview label="Padrão">
        <Input className="max-w-sm" placeholder="Digite algo..." />
      </Preview>

      <Preview label="Com label" className="flex-col items-start">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label htmlFor="input-email">E-mail</Label>
          <Input id="input-email" type="email" placeholder="usuario@exemplo.com" />
        </div>
      </Preview>

      <Preview label="Com ícone inicial" className="flex-col items-start">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label htmlFor="input-search">Buscar</Label>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input id="input-search" className="pl-8" placeholder="Pesquisar..." />
          </div>
        </div>
      </Preview>

      <Preview label="Tipos" className="flex-col items-start gap-3">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label htmlFor="input-password">Senha</Label>
          <Input id="input-password" type="password" placeholder="••••••••" />
        </div>
        <div className="grid w-full max-w-sm gap-1.5">
          <Label htmlFor="input-number">Número</Label>
          <Input id="input-number" type="number" placeholder="0" />
        </div>
        <div className="grid w-full max-w-sm gap-1.5">
          <Label htmlFor="input-date">Data (nativo)</Label>
          <Input id="input-date" type="date" />
        </div>
      </Preview>

      <Preview label="Desabilitado">
        <div className="w-full max-w-sm">
          <Input placeholder="Campo desabilitado" disabled />
        </div>
      </Preview>

      <Preview label="Inválido" className="flex-col items-start">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label htmlFor="input-invalid">Nome</Label>
          <Input id="input-invalid" aria-invalid placeholder="Campo obrigatório" />
          <p className="text-[0.8rem] text-destructive">Este campo é obrigatório.</p>
        </div>
      </Preview>
    </Section>
  )
}

function TextareaSection() {
  return (
    <Section title="Textarea" description="Campo de texto multilinha para conteúdo extenso.">
      <Preview label="Padrão" className="flex-col items-start">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label htmlFor="textarea-default">Mensagem</Label>
          <Textarea id="textarea-default" placeholder="Escreva sua mensagem..." />
        </div>
      </Preview>

      <Preview label="Com contagem de caracteres" className="flex-col items-start">
        <TextareaWithCount />
      </Preview>

      <Preview label="Desabilitado" className="flex-col items-start">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label htmlFor="textarea-disabled">Observações</Label>
          <Textarea id="textarea-disabled" placeholder="Desabilitado" disabled />
        </div>
      </Preview>

      <Preview label="Inválido" className="flex-col items-start">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label htmlFor="textarea-invalid">Descrição</Label>
          <Textarea id="textarea-invalid" aria-invalid placeholder="Campo obrigatório" />
          <p className="text-[0.8rem] text-destructive">A descrição é obrigatória.</p>
        </div>
      </Preview>
    </Section>
  )
}

function TextareaWithCount() {
  const [value, setValue] = useState("")
  const max = 200

  return (
    <div className="grid w-full max-w-sm gap-1.5">
      <Label htmlFor="textarea-count">Comentário</Label>
      <Textarea
        id="textarea-count"
        placeholder="Deixe seu comentário..."
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, max))}
      />
      <p className="text-right text-[0.75rem] text-muted-foreground">
        {value.length}/{max}
      </p>
    </div>
  )
}

function SelectSection() {
  return (
    <Section title="Select" description="Seleção de uma opção em lista suspensa, com grupos e estados.">
      <Preview label="Padrão">
        <Select>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Selecione uma opção..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">Opção A</SelectItem>
            <SelectItem value="b">Opção B</SelectItem>
            <SelectItem value="c">Opção C</SelectItem>
          </SelectContent>
        </Select>
      </Preview>

      <Preview label="Com grupos">
        <Select>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Frutas</SelectLabel>
              <SelectItem value="apple">Maçã</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Laranja</SelectItem>
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Verduras</SelectLabel>
              <SelectItem value="lettuce">Alface</SelectItem>
              <SelectItem value="spinach">Espinafre</SelectItem>
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
          </SelectContent>
        </Select>
      </Preview>

      <Preview label="Desabilitado">
        <Select disabled>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Desabilitado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="x">Opção</SelectItem>
          </SelectContent>
        </Select>
      </Preview>

      <Preview label="Com label" className="flex-col items-start">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label htmlFor="select-country">País</Label>
          <Select>
            <SelectTrigger id="select-country">
              <SelectValue placeholder="Selecione o país..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="br">Brasil</SelectItem>
              <SelectItem value="us">Estados Unidos</SelectItem>
              <SelectItem value="pt">Portugal</SelectItem>
              <SelectItem value="es">Espanha</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Preview>
    </Section>
  )
}

function CheckboxSection() {
  const [checked, setChecked] = useState(false)

  return (
    <Section title="Checkbox" description="Seleção de múltiplas opções independentes.">
      <Preview label="Padrão">
        <div className="flex items-center gap-2">
          <Checkbox id="cb-default" />
          <Label htmlFor="cb-default">Aceito os termos</Label>
        </div>
      </Preview>

      <Preview label="Controlado">
        <div className="flex items-center gap-2">
          <Checkbox
            id="cb-controlled"
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
          />
          <Label htmlFor="cb-controlled">
            {checked ? "Selecionado" : "Não selecionado"}
          </Label>
        </div>
      </Preview>

      <Preview label="Lista de opções" className="flex-col items-start gap-3">
        {["React", "TypeScript", "Tailwind CSS", "shadcn/ui"].map((item) => (
          <div key={item} className="flex items-center gap-2">
            <Checkbox id={`cb-${item}`} />
            <Label htmlFor={`cb-${item}`}>{item}</Label>
          </div>
        ))}
      </Preview>

      <Preview label="Desabilitado">
        <div className="flex items-center gap-2">
          <Checkbox id="cb-disabled" disabled />
          <Label htmlFor="cb-disabled" className="opacity-50">Desabilitado</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cb-disabled-checked" disabled defaultChecked />
          <Label htmlFor="cb-disabled-checked" className="opacity-50">Marcado e desabilitado</Label>
        </div>
      </Preview>

      <Preview label="Inválido" className="flex-col items-start gap-2">
        <div className="flex items-center gap-2">
          <Checkbox id="cb-invalid" aria-invalid />
          <Label htmlFor="cb-invalid">Li e aceito os termos de uso</Label>
        </div>
        <p className="text-[0.8rem] text-destructive">Você precisa aceitar os termos.</p>
      </Preview>
    </Section>
  )
}

function RadioGroupSection() {
  const [plan, setPlan] = useState("pro")

  return (
    <Section title="Radio Group" description="Seleção de uma única opção dentro de um grupo.">
      <Preview label="Padrão" className="flex-col items-start gap-3">
        <RadioGroup defaultValue="option-a">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option-a" id="rg-a" />
            <Label htmlFor="rg-a">Opção A</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option-b" id="rg-b" />
            <Label htmlFor="rg-b">Opção B</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="option-c" id="rg-c" />
            <Label htmlFor="rg-c">Opção C</Label>
          </div>
        </RadioGroup>
      </Preview>

      <Preview label="Controlado — plano selecionado" className="flex-col items-start gap-3">
        <RadioGroup value={plan} onValueChange={setPlan}>
          {[
            { value: "free", label: "Free", description: "Para uso pessoal" },
            { value: "pro", label: "Pro", description: "Para equipes pequenas" },
            { value: "enterprise", label: "Enterprise", description: "Para grandes empresas" },
          ].map(({ value, label, description }) => (
            <div key={value} className="flex items-start gap-2">
              <RadioGroupItem value={value} id={`plan-${value}`} className="mt-0.5" />
              <div>
                <Label htmlFor={`plan-${value}`} className="font-medium">{label}</Label>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </RadioGroup>
        <p className="text-xs text-muted-foreground">Plano selecionado: <strong>{plan}</strong></p>
      </Preview>

      <Preview label="Desabilitado" className="flex-col items-start gap-3">
        <RadioGroup defaultValue="x" disabled>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="x" id="rg-disabled-x" />
            <Label htmlFor="rg-disabled-x" className="opacity-50">Opção X</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="y" id="rg-disabled-y" />
            <Label htmlFor="rg-disabled-y" className="opacity-50">Opção Y</Label>
          </div>
        </RadioGroup>
      </Preview>
    </Section>
  )
}

function SwitchSection() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [newsletter, setNewsletter] = useState(false)

  return (
    <Section title="Switch" description="Alternância binária para ativar ou desativar configurações.">
      <Preview label="Padrão">
        <Switch />
        <Switch defaultChecked />
      </Preview>

      <Preview label="Tamanhos">
        <div className="flex items-center gap-3">
          <Switch size="sm" defaultChecked />
          <span className="text-xs text-muted-foreground">SM</span>
        </div>
        <div className="flex items-center gap-3">
          <Switch size="default" defaultChecked />
          <span className="text-xs text-muted-foreground">Default</span>
        </div>
      </Preview>

      <Preview label="Com label" className="flex-col items-start gap-4">
        {[
          { id: "sw-notif", label: "Notificações push", description: "Receba alertas em tempo real", value: notifications, onChange: setNotifications },
          { id: "sw-dark", label: "Modo escuro", description: "Altera o tema da interface", value: darkMode, onChange: setDarkMode },
          { id: "sw-news", label: "Newsletter", description: "Receba novidades por e-mail", value: newsletter, onChange: setNewsletter },
        ].map(({ id, label, description, value, onChange }) => (
          <div key={id} className="flex w-full max-w-sm items-center justify-between gap-4">
            <div>
              <Label htmlFor={id}>{label}</Label>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Switch id={id} checked={value} onCheckedChange={onChange} />
          </div>
        ))}
      </Preview>

      <Preview label="Desabilitado">
        <Switch disabled />
        <Switch disabled defaultChecked />
      </Preview>
    </Section>
  )
}

function SliderSection() {
  const [volume, setVolume] = useState([60])
  const [range, setRange] = useState([20, 80])

  return (
    <Section title="Slider" description="Seleção de valor em um intervalo contínuo.">
      <Preview label="Padrão" className="flex-col items-start">
        <div className="w-full max-w-sm">
          <Slider defaultValue={[40]} />
        </div>
      </Preview>

      <Preview label="Controlado — volume" className="flex-col items-start gap-3">
        <div className="grid w-full max-w-sm gap-1.5">
          <div className="flex items-center justify-between">
            <Label>Volume</Label>
            <span className="font-mono text-xs text-muted-foreground">{volume[0]}%</span>
          </div>
          <Slider
            value={volume}
            onValueChange={setVolume}
            min={0}
            max={100}
            step={1}
          />
        </div>
      </Preview>

      <Preview label="Intervalo (range)" className="flex-col items-start gap-3">
        <div className="grid w-full max-w-sm gap-1.5">
          <div className="flex items-center justify-between">
            <Label>Faixa de preço</Label>
            <span className="font-mono text-xs text-muted-foreground">
              R$ {range[0]} – R$ {range[1]}
            </span>
          </div>
          <Slider
            value={range}
            onValueChange={setRange}
            min={0}
            max={200}
            step={5}
          />
        </div>
      </Preview>

      <Preview label="Com steps" className="flex-col items-start">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label>Avaliação (1–5)</Label>
          <Slider defaultValue={[3]} min={1} max={5} step={1} />
        </div>
      </Preview>

      <Preview label="Desabilitado" className="flex-col items-start">
        <div className="w-full max-w-sm">
          <Slider defaultValue={[50]} disabled />
        </div>
      </Preview>
    </Section>
  )
}

function DatePickerSection() {
  const [date, setDate] = useState<Date | undefined>()

  return (
    <Section title="Date Picker" description="Seletor de data com input mascarado e calendário popover.">
      <Preview label="Padrão" className="flex-col items-start">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label>Selecione uma data</Label>
          <DatePicker value={date} onChange={setDate} />
        </div>
      </Preview>

      <Preview label="Com valor inicial" className="flex-col items-start">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label>Data de início</Label>
          <DatePicker value={new Date(2025, 5, 21)} onChange={() => {}} />
        </div>
      </Preview>

      <Preview label="Desabilitado">
        <div className="w-full max-w-sm">
          <DatePicker value={new Date(2025, 0, 1)} disabled />
        </div>
      </Preview>

      <Preview label="Inválido" className="flex-col items-start">
        <div className="grid w-full max-w-sm gap-1.5">
          <Label>Data de nascimento</Label>
          <DatePicker invalid placeholder="dd/mm/aaaa" />
          <p className="text-[0.8rem] text-destructive">Data inválida.</p>
        </div>
      </Preview>
    </Section>
  )
}

function DropzoneSection() {
  const [files, setFiles] = useState<File[]>([])
  const [singleFile, setSingleFile] = useState<File[]>([])

  return (
    <Section title="Dropzone" description="Área de arrastar e soltar arquivos, com suporte a múltiplos arquivos, restrição de tipo e tamanho.">
      <Preview label="Múltiplos arquivos" className="flex-col items-start">
        <div className="w-full max-w-lg">
          <Dropzone
            value={files}
            onFilesChange={setFiles}
            hint="Qualquer formato, até 10 MB por arquivo"
          />
        </div>
      </Preview>

      <Preview label="Arquivo único" className="flex-col items-start">
        <div className="w-full max-w-lg">
          <Dropzone
            value={singleFile}
            onFilesChange={setSingleFile}
            multiple={false}
            hint="Substitui o arquivo anterior ao selecionar um novo"
          />
        </div>
      </Preview>

      <Preview label="Tipo restrito — imagens" className="flex-col items-start">
        <div className="w-full max-w-lg">
          <Dropzone
            value={[]}
            onFilesChange={() => {}}
            accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
            hint="PNG, JPG ou WebP até 5 MB"
          />
        </div>
      </Preview>

      <Preview label="Desabilitado" className="flex-col items-start">
        <div className="w-full max-w-lg">
          <Dropzone
            value={[]}
            onFilesChange={() => {}}
            disabled
            hint="Upload desabilitado"
          />
        </div>
      </Preview>
    </Section>
  )
}

function CompleteFormExample() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
    toast.success("Formulário enviado com sucesso!")
    setTimeout(() => setSubmitted(false), 2000)
  }

  return (
    <Section
      title="Exemplo completo"
      description="Formulário de cadastro combinando todos os componentes de forma."
    >
      <div className="rounded-lg border border-border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground">Criar conta</h3>
            <p className="text-sm text-muted-foreground">
              Preencha os dados abaixo para se cadastrar.
            </p>
          </div>

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="full-name">Nome completo</Label>
              <div className="relative">
                <UserIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input id="full-name" className="pl-8" placeholder="Seu nome" required />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="full-email">E-mail</Label>
              <div className="relative">
                <MailIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input id="full-email" type="email" className="pl-8" placeholder="usuario@exemplo.com" required />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="full-password">Senha</Label>
              <div className="relative">
                <LockIcon className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input id="full-password" type="password" className="pl-8" placeholder="••••••••" required />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="full-birthdate">Data de nascimento</Label>
              <DatePicker placeholder="dd/mm/aaaa" />
            </div>

            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="full-country">País</Label>
              <Select>
                <SelectTrigger id="full-country">
                  <SelectValue placeholder="Selecione o país..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="br">Brasil</SelectItem>
                  <SelectItem value="us">Estados Unidos</SelectItem>
                  <SelectItem value="pt">Portugal</SelectItem>
                  <SelectItem value="es">Espanha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5 sm:col-span-2">
              <Label htmlFor="full-bio">Sobre você</Label>
              <Textarea id="full-bio" placeholder="Conte um pouco sobre você..." />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Interesses</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {["React", "TypeScript", "Design", "Open Source"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Checkbox id={`interest-${item}`} />
                  <Label htmlFor={`interest-${item}`} className="font-normal">{item}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Plano</p>
            <RadioGroup defaultValue="free" className="grid grid-cols-3 gap-3">
              {[
                { value: "free", label: "Free", price: "R$ 0/mês" },
                { value: "pro", label: "Pro", price: "R$ 49/mês" },
                { value: "enterprise", label: "Enterprise", price: "Sob consulta" },
              ].map(({ value, label, price }) => (
                <div key={value}>
                  <RadioGroupItem value={value} id={`full-plan-${value}`} className="sr-only" />
                  <Label
                    htmlFor={`full-plan-${value}`}
                    className="flex cursor-pointer flex-col items-center gap-1 rounded-lg border border-border p-3 text-center transition-colors hover:bg-muted has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-primary/5"
                  >
                    <span className="font-medium">{label}</span>
                    <span className="text-xs text-muted-foreground">{price}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Newsletter</p>
              <p className="text-xs text-muted-foreground">Receba novidades por e-mail</p>
            </div>
            <Switch id="full-newsletter" />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox id="full-terms" required />
            <Label htmlFor="full-terms" className="font-normal">
              Li e aceito os{" "}
              <span className="text-foreground underline underline-offset-2 cursor-pointer">
                termos de uso
              </span>
              {" "}e a{" "}
              <span className="text-foreground underline underline-offset-2 cursor-pointer">
                política de privacidade
              </span>
            </Label>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={submitted}>
              <SendIcon data-icon="inline-start" />
              {submitted ? "Enviando..." : "Criar conta"}
            </Button>
          </div>
        </form>
      </div>
    </Section>
  )
}

export function FormsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-16 px-6 py-14">
        <header className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Design System / Referência
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Formulários
          </h1>
          <p className="max-w-xl leading-relaxed text-muted-foreground">
            Todos os componentes de formulário disponíveis no projeto, com variantes, estados e um exemplo completo de uso.
          </p>
        </header>

        <InputSection />
        <TextareaSection />
        <SelectSection />
        <CheckboxSection />
        <RadioGroupSection />
        <SwitchSection />
        <SliderSection />
        <DatePickerSection />
        <DropzoneSection />
        <CompleteFormExample />
      </div>
    </div>
  )
}
