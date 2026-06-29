import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TokenMeta {
  label: string
  variable: string
  bgClass: string
}

interface GroupMeta {
  id: string
  title: string
  description: string
  tokens: TokenMeta[]
}

interface TokenValues {
  light: string
  dark: string
}

interface ResolvedToken extends TokenMeta {
  lightValue: string
  darkValue: string
  lightnessL: number
  chromatic: boolean
}

interface TokenCardProps {
  token: ResolvedToken
}

interface LightnessSpectrumProps {
  tokens: ResolvedToken[]
}

const COLOR_GROUPS: GroupMeta[] = [
  {
    id: "base",
    title: "Base",
    description: "Fundo e texto padrão da interface",
    tokens: [
      { label: "Background", variable: "--background", bgClass: "bg-background" },
      { label: "Foreground", variable: "--foreground", bgClass: "bg-foreground" },
    ],
  },
  {
    id: "card",
    title: "Card",
    description: "Superfícies elevadas e painéis",
    tokens: [
      { label: "Card", variable: "--card", bgClass: "bg-card" },
      { label: "Card Foreground", variable: "--card-foreground", bgClass: "bg-card-foreground" },
    ],
  },
  {
    id: "popover",
    title: "Popover",
    description: "Menus flutuantes e overlays",
    tokens: [
      { label: "Popover", variable: "--popover", bgClass: "bg-popover" },
      { label: "Popover Foreground", variable: "--popover-foreground", bgClass: "bg-popover-foreground" },
    ],
  },
  {
    id: "primary",
    title: "Primária",
    description: "Ação principal e destaque",
    tokens: [
      { label: "Primary", variable: "--primary", bgClass: "bg-primary" },
      { label: "Primary Foreground", variable: "--primary-foreground", bgClass: "bg-primary-foreground" },
    ],
  },
  {
    id: "secondary",
    title: "Secundária",
    description: "Ações de suporte e elementos secundários",
    tokens: [
      { label: "Secondary", variable: "--secondary", bgClass: "bg-secondary" },
      { label: "Secondary Foreground", variable: "--secondary-foreground", bgClass: "bg-secondary-foreground" },
    ],
  },
  {
    id: "muted",
    title: "Muted",
    description: "Elementos atenuados e textos auxiliares",
    tokens: [
      { label: "Muted", variable: "--muted", bgClass: "bg-muted" },
      { label: "Muted Foreground", variable: "--muted-foreground", bgClass: "bg-muted-foreground" },
    ],
  },
  {
    id: "accent",
    title: "Accent",
    description: "Estados de hover e foco visual",
    tokens: [
      { label: "Accent", variable: "--accent", bgClass: "bg-accent" },
      { label: "Accent Foreground", variable: "--accent-foreground", bgClass: "bg-accent-foreground" },
    ],
  },
  {
    id: "destructive",
    title: "Destrutiva",
    description: "Erros, alertas e ações irreversíveis",
    tokens: [
      { label: "Destructive", variable: "--destructive", bgClass: "bg-destructive" },
    ],
  },
  {
    id: "utility",
    title: "Utilitários",
    description: "Bordas, campos e anéis de foco",
    tokens: [
      { label: "Border", variable: "--border", bgClass: "bg-border" },
      { label: "Input", variable: "--input", bgClass: "bg-input" },
      { label: "Ring", variable: "--ring", bgClass: "bg-ring" },
    ],
  },
  {
    id: "chart",
    title: "Gráficos",
    description: "Paleta sequencial para visualizações de dados",
    tokens: [
      { label: "Chart 1", variable: "--chart-1", bgClass: "bg-chart-1" },
      { label: "Chart 2", variable: "--chart-2", bgClass: "bg-chart-2" },
      { label: "Chart 3", variable: "--chart-3", bgClass: "bg-chart-3" },
      { label: "Chart 4", variable: "--chart-4", bgClass: "bg-chart-4" },
      { label: "Chart 5", variable: "--chart-5", bgClass: "bg-chart-5" },
    ],
  },
  {
    id: "sidebar",
    title: "Sidebar",
    description: "Tokens dedicados à barra lateral",
    tokens: [
      { label: "Sidebar", variable: "--sidebar", bgClass: "bg-sidebar" },
      { label: "Sidebar Foreground", variable: "--sidebar-foreground", bgClass: "bg-sidebar-foreground" },
      { label: "Sidebar Primary", variable: "--sidebar-primary", bgClass: "bg-sidebar-primary" },
      { label: "Sidebar Primary Foreground", variable: "--sidebar-primary-foreground", bgClass: "bg-sidebar-primary-foreground" },
      { label: "Sidebar Accent", variable: "--sidebar-accent", bgClass: "bg-sidebar-accent" },
      { label: "Sidebar Accent Foreground", variable: "--sidebar-accent-foreground", bgClass: "bg-sidebar-accent-foreground" },
      { label: "Sidebar Border", variable: "--sidebar-border", bgClass: "bg-sidebar-border" },
      { label: "Sidebar Ring", variable: "--sidebar-ring", bgClass: "bg-sidebar-ring" },
    ],
  },
]

const ALL_VARIABLES = COLOR_GROUPS.flatMap((g) => g.tokens.map((t) => t.variable))

function readCssTokenValues(variables: string[]): Record<string, TokenValues> {
  const result: Record<string, TokenValues> = Object.fromEntries(
    variables.map((v) => [v, { light: "", dark: "" }])
  )

  function walkRules(rules: CSSRuleList): void {
    for (const rule of rules) {
      if (rule instanceof CSSStyleRule) {
        const sel = rule.selectorText
        if (sel === ":root" || sel === ".dark") {
          for (const v of variables) {
            const value = rule.style.getPropertyValue(v).trim()
            if (!value) continue
            if (sel === ":root") result[v].light = value
            if (sel === ".dark") result[v].dark = value
          }
        }
      } else if ("cssRules" in rule) {
        walkRules((rule as CSSGroupingRule).cssRules)
      }
    }
  }

  for (const sheet of document.styleSheets) {
    try {
      walkRules(sheet.cssRules)
    } catch {
      // pula stylesheets cross-origin
    }
  }

  return result
}

function parseLightness(value: string): number {
  const match = value.match(/oklch\(\s*([0-9.]+)/)
  return match ? parseFloat(match[1]) : 0.5
}

function isChromatic(value: string): boolean {
  const match = value.match(/oklch\(\s*[0-9.]+\s+([0-9.]+)/)
  return match ? parseFloat(match[1]) > 0 : false
}

function resolveToken(meta: TokenMeta, values: TokenValues | undefined): ResolvedToken {
  const vals = values ?? { light: "", dark: "" }
  return {
    ...meta,
    lightValue: vals.light || "—",
    darkValue: vals.dark || vals.light || "—",
    lightnessL: parseLightness(vals.light),
    chromatic: isChromatic(vals.light),
  }
}

function LightnessSpectrum({ tokens }: LightnessSpectrumProps) {
  return (
    <div className="space-y-2.5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        Espectro de luminosidade — L em oklch, modo claro
      </p>
      <div className="relative h-7">
        <div
          className="absolute inset-x-0 top-2 h-2.5 rounded-full border border-border"
          style={{ background: "linear-gradient(to right, oklch(0 0 0), oklch(1 0 0))" }}
        />
        {tokens.map((token) => (
          <div
            key={token.variable}
            className={cn(
              "absolute top-0 h-6 w-px",
              token.chromatic ? "bg-destructive" : "bg-ring/60"
            )}
            style={{ left: `${token.lightnessL * 100}%` }}
            title={`${token.label}: L=${token.lightnessL}`}
          />
        ))}
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>0 — preto</span>
        <span>0.5</span>
        <span>1 — branco</span>
      </div>
      <p className="font-mono text-[10px] text-muted-foreground">
        <span className="inline-block h-2 w-px bg-destructive align-middle" /> token cromático
        &nbsp;&nbsp;
        <span className="inline-block h-2 w-px bg-ring/60 align-middle" /> token acromático
      </p>
    </div>
  )
}

function TokenCard({ token }: TokenCardProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className={cn("h-16 w-full border-b border-border", token.bgClass)} />
      <div className="space-y-2 p-3">
        <p className="text-sm font-medium leading-none text-foreground">{token.label}</p>
        <code className="block font-mono text-[11px] text-muted-foreground">{token.variable}</code>
        <span className="inline-flex items-center rounded-sm bg-muted px-1.5 py-0.5">
          <code className="font-mono text-[10px] text-foreground">{token.bgClass}</code>
        </span>
        <div className="space-y-1 pt-0.5">
          <div className="flex items-start gap-1.5">
            <span className="w-8 shrink-0 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              claro
            </span>
            <code className="break-all font-mono text-[10px] leading-snug text-foreground">
              {token.lightValue}
            </code>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="w-8 shrink-0 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              dark
            </span>
            <code className="break-all font-mono text-[10px] leading-snug text-foreground">
              {token.darkValue}
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ColorsPage() {
  const [tokenValues, setTokenValues] = useState<Record<string, TokenValues>>(
    () => readCssTokenValues(ALL_VARIABLES)
  )

  useEffect(() => {
    setTokenValues(readCssTokenValues(ALL_VARIABLES))
  }, [])

  const resolvedGroups = COLOR_GROUPS.map((group) => ({
    ...group,
    resolved: group.tokens.map((t) => resolveToken(t, tokenValues[t.variable])),
  }))

  const allResolved = resolvedGroups.flatMap((g) => g.resolved)
  const totalCount = allResolved.length
  const chromaticCount = allResolved.filter((t) => t.chromatic).length

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl space-y-16 px-6 py-14">
        <header className="space-y-8">
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Design System / Referência
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Tokens de Cor
            </h1>
            <p className="max-w-xl leading-relaxed text-muted-foreground">
              Tokens semânticos em CSS custom properties, mapeados para Tailwind CSS v4 via{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-[13px] text-foreground">
                @theme inline
              </code>
              . De{" "}
              <span className="font-medium text-foreground">{totalCount} tokens</span>,{" "}
              <span className="font-medium text-foreground">
                {totalCount - chromaticCount} são acromáticos
              </span>{" "}
              — cromaticidade C=0 em oklch.
            </p>
          </div>
          <LightnessSpectrum tokens={allResolved} />
        </header>

        {resolvedGroups.map((group) => (
          <section key={group.id} className="space-y-4">
            <div className="flex items-baseline gap-3 border-b border-border pb-3">
              <h2 className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {group.title}
              </h2>
              <span className="text-xs text-muted-foreground">{group.description}</span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                {group.tokens.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {group.resolved.map((token) => (
                <TokenCard key={token.variable} token={token} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
