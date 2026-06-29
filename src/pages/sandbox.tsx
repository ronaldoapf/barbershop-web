import { useState } from "react"
import {
  GlobeIcon,
  ServerIcon,
  CloudIcon,
  DatabaseIcon,
  CodeIcon,
  LayoutIcon,
  ShieldIcon,
  ZapIcon,
  BoxIcon,
  GitBranchIcon,
} from "lucide-react"

import { VirtualSelect, type SelectOption } from "@/components/virtual-select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { COUNTRIES } from "@/lib/virtual-select-data"

const TECH_OPTIONS: SelectOption[] = [
  { value: "react", label: "React", icon: <CodeIcon />, description: "Biblioteca para construção de UIs" },
  { value: "next", label: "Next.js", icon: <LayoutIcon />, description: "Framework React com SSR e App Router" },
  { value: "vite", label: "Vite", icon: <ZapIcon />, description: "Build tool ultrarrápido para frontend" },
  { value: "node", label: "Node.js", icon: <ServerIcon />, description: "Runtime JavaScript server-side" },
  { value: "postgres", label: "PostgreSQL", icon: <DatabaseIcon />, description: "Banco de dados relacional open-source" },
  { value: "redis", label: "Redis", icon: <DatabaseIcon />, description: "Cache e armazenamento em memória" },
  { value: "docker", label: "Docker", icon: <BoxIcon />, description: "Plataforma de containerização" },
  { value: "github", label: "GitHub Actions", icon: <GitBranchIcon />, description: "CI/CD integrado ao repositório" },
  { value: "aws", label: "AWS", icon: <CloudIcon />, description: "Plataforma de nuvem da Amazon" },
  { value: "cloudflare", label: "Cloudflare", icon: <GlobeIcon />, description: "CDN, DNS e segurança de rede" },
  { value: "auth0", label: "Auth0", icon: <ShieldIcon />, description: "Autenticação e autorização como serviço" },
]

const AMERICAS = COUNTRIES.filter((c) => c.group === "Americas")
const EUROPE = COUNTRIES.filter((c) => c.group === "Europe")

export function Sandbox() {
  const [country, setCountry] = useState<string>()
  const [origin, setOrigin] = useState<string>()
  const [destination, setDestination] = useState<string>()
  const [tech, setTech] = useState<string>()

  const selectedCountry = COUNTRIES.find((c) => c.value === country)

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl space-y-12 px-6 py-14">
        <header className="space-y-2">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Sandbox
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Virtual Select
          </h1>
          <p className="text-sm text-muted-foreground">
            Select com virtualização de lista — renderiza apenas os itens visíveis,
            ideal para conjuntos com centenas de opções.
          </p>
        </header>

        <section className="space-y-6">
          <div className="space-y-1 border-b border-border pb-3">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Lista completa
            </h2>
            <p className="text-sm text-muted-foreground">
              {COUNTRIES.length} países — todos os continentes.
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="all-countries">País</Label>
            <VirtualSelect
              value={country}
              options={COUNTRIES}
              onChange={setCountry}
              placeholder="Selecione um país..."
            />
          </div>

          {selectedCountry && (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Selecionado:</span>
              <span className="font-medium">{selectedCountry.label}</span>
              <Separator orientation="vertical" className="h-4" />
              <Badge variant="secondary">{selectedCountry.group}</Badge>
              {selectedCountry.meta && (
                <Badge variant="outline">{selectedCountry.meta}</Badge>
              )}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="space-y-1 border-b border-border pb-3">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Listas filtradas por continente
            </h2>
            <p className="text-sm text-muted-foreground">
              Demonstra o uso com subconjuntos de dados.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-1.5">
              <Label>Américas ({AMERICAS.length})</Label>
              <VirtualSelect
                options={AMERICAS}
                value={origin}
                onChange={setOrigin}
                placeholder="Origem..."
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Europa ({EUROPE.length})</Label>
              <VirtualSelect
                options={EUROPE}
                value={destination}
                onChange={setDestination}
                placeholder="Destino..."
              />
            </div>
          </div>

          {(origin || destination) && (
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
              <span className="text-muted-foreground">Rota: </span>
              <span className="font-medium">
                {AMERICAS.find((c) => c.value === origin)?.label ?? "—"}
              </span>
              <span className="mx-2 text-muted-foreground">→</span>
              <span className="font-medium">
                {EUROPE.find((c) => c.value === destination)?.label ?? "—"}
              </span>
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="space-y-1 border-b border-border pb-3">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Com ícone e descrição
            </h2>
            <p className="text-sm text-muted-foreground">
              Cada opção pode ter um ícone à esquerda e uma descrição secundária.
            </p>
          </div>

          <div className="grid gap-1.5">
            <Label>Tecnologia</Label>
            <VirtualSelect
              options={TECH_OPTIONS}
              value={tech}
              onChange={setTech}
              placeholder="Selecione uma tecnologia..."
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="space-y-1 border-b border-border pb-3">
            <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Estados
            </h2>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>Desabilitado</Label>
              <VirtualSelect
                options={COUNTRIES}
                placeholder="Não disponível"
                disabled
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Inválido</Label>
              <VirtualSelect
                options={COUNTRIES}
                placeholder="Selecione um país..."
                invalid
              />
              <p className="text-[0.8rem] text-destructive">
                O campo país é obrigatório.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
