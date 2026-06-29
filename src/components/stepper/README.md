# Stepper

Componente de fluxo multi-etapas com estado gerenciado via Context. Composto por quatro peças que se comunicam através de `StepperContext` — nenhuma prop de drilling necessária.

## Estrutura

```
<Stepper>          → Provider do Context + estado central
  <StepperHeader>  → Indicador visual das etapas (desktop + mobile)
  <StepperPanel>   → Renderiza o conteúdo de uma etapa específica
  <StepperNavigation> → Botões Voltar / Próximo / Concluir
```

---

## Uso básico

```tsx
import {
  Stepper,
  StepperHeader,
  StepperPanel,
  StepperNavigation,
  type StepDefinition,
} from "@/components/stepper"

const STEPS: StepDefinition[] = [
  { id: "dados-pessoais", label: "Dados pessoais", description: "Nome e e-mail" },
  { id: "endereco",       label: "Endereço",        description: "Localização" },
  { id: "confirmacao",    label: "Confirmação",      description: "Revise e envie" },
]

export function CadastroWizard() {
  return (
    <Stepper steps={STEPS}>
      <StepperHeader />

      <StepperPanel step={0}>
        <p>Conteúdo da etapa 1</p>
      </StepperPanel>

      <StepperPanel step={1}>
        <p>Conteúdo da etapa 2</p>
      </StepperPanel>

      <StepperPanel step={2}>
        <p>Conteúdo da etapa 3</p>
      </StepperPanel>

      <StepperNavigation />
    </Stepper>
  )
}
```

---

## API dos componentes

### `<Stepper>`

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `steps` | `StepDefinition[]` | — | Lista de etapas (obrigatório) |
| `initialStep` | `number` | `0` | Índice da etapa inicial |
| `onStepChange` | `(step: number) => void` | — | Callback chamado ao mudar de etapa |
| `className` | `string` | — | Classe adicional no container |

### `<StepperPanel>`

| Prop | Tipo | Descrição |
|---|---|---|
| `step` | `number` | Índice da etapa que este painel representa |
| `children` | `ReactNode` | Conteúdo exibido quando a etapa estiver ativa |
| `className` | `string` | Classe adicional |

### `<StepperNavigation>`

| Prop | Tipo | Padrão | Descrição |
|---|---|---|---|
| `onNext` | `() => boolean \| Promise<boolean>` | — | Executado antes de avançar; retorne `false` para bloquear |
| `onBack` | `() => void` | — | Executado ao voltar |
| `nextLabel` | `string` | `"Próximo"` | Label do botão avançar |
| `backLabel` | `string` | `"Voltar"` | Label do botão voltar |
| `finishLabel` | `string` | `"Concluir"` | Label do botão na última etapa |

---

## `useStepperContext`

Hook que expõe o estado e as ações do Stepper. Pode ser chamado em **qualquer componente filho** de `<Stepper>`, sem precisar receber props.

```tsx
import { useStepperContext } from "@/components/stepper"

function MinhaEtapa() {
  const {
    currentStep,
    stepStatuses,
    steps,
    isFirstStep,
    isLastStep,
    goToStep,
    nextStep,
    prevStep,
    markStepError,
    clearStepError,
  } = useStepperContext()

  // ...
}
```

### Referência completa do Context

| Valor | Tipo | Descrição |
|---|---|---|
| `steps` | `StepDefinition[]` | Lista de etapas definidas |
| `currentStep` | `number` | Índice da etapa atual |
| `stepStatuses` | `StepStatus[]` | Status de cada etapa (`pending`, `current`, `completed`, `error`) |
| `isFirstStep` | `boolean` | `true` quando estiver na primeira etapa |
| `isLastStep` | `boolean` | `true` quando estiver na última etapa |
| `goToStep(index)` | `(index: number) => void` | Navega diretamente para uma etapa |
| `nextStep()` | `() => void` | Avança para a próxima etapa |
| `prevStep()` | `() => void` | Volta para a etapa anterior |
| `markStepError(index)` | `(index: number) => void` | Marca uma etapa com status `error` |
| `clearStepError(index)` | `(index: number) => void` | Remove o `error` e restaura o status correto |

---

## Receitas

### Validação antes de avançar

`onNext` em `<StepperNavigation>` bloqueia o avanço quando retorna `false`. Use para validar o formulário da etapa atual.

```tsx
function Wizard() {
  const [nome, setNome] = useState("")

  async function validarEtapa1() {
    if (!nome.trim()) {
      toast.error("O nome é obrigatório.")
      return false   // bloqueia o nextStep
    }
    return true      // libera o nextStep
  }

  return (
    <Stepper steps={STEPS}>
      <StepperHeader />

      <StepperPanel step={0}>
        <input value={nome} onChange={(e) => setNome(e.target.value)} />
      </StepperPanel>

      <StepperPanel step={1}>
        <p>Etapa 2</p>
      </StepperPanel>

      <StepperNavigation onNext={validarEtapa1} />
    </Stepper>
  )
}
```

---

### Marcar etapa com erro via Context

Útil quando a validação acontece fora do fluxo de navegação — por exemplo, após uma chamada de API.

```tsx
function ResumoEtapa() {
  const { markStepError, clearStepError, goToStep } = useStepperContext()

  async function enviar() {
    const resultado = await submitForm()

    if (!resultado.ok) {
      markStepError(1)  // etapa "Endereço" ficará vermelha
      goToStep(1)       // redireciona o usuário de volta
      return
    }

    clearStepError(1)
    toast.success("Cadastro concluído!")
  }

  return <Button onClick={enviar}>Enviar</Button>
}
```

---

### Navegação programática

Acesse o Context para criar controles customizados fora de `<StepperNavigation>`.

```tsx
function BarraLateral() {
  const { steps, stepStatuses, goToStep } = useStepperContext()

  return (
    <nav>
      {steps.map((step, index) => (
        <button
          key={step.id}
          onClick={() => goToStep(index)}
          disabled={stepStatuses[index] === "pending"}
        >
          {step.label}
        </button>
      ))}
    </nav>
  )
}

// BarraLateral deve estar dentro de <Stepper> para acessar o Context
function Wizard() {
  return (
    <Stepper steps={STEPS}>
      <div className="flex gap-8">
        <BarraLateral />
        <div className="flex-1">
          <StepperPanel step={0}>...</StepperPanel>
          <StepperPanel step={1}>...</StepperPanel>
          <StepperPanel step={2}>...</StepperPanel>
        </div>
      </div>
    </Stepper>
  )
}
```

---

### Acompanhar troca de etapa externamente

```tsx
function PaginaDeCadastro() {
  function handleStepChange(step: number) {
    analytics.track("stepper_step_changed", { step })
  }

  return (
    <Stepper steps={STEPS} onStepChange={handleStepChange}>
      {/* ... */}
    </Stepper>
  )
}
```

---

## Tipos

```ts
type StepStatus = "pending" | "current" | "completed" | "error"

interface StepDefinition {
  id: string
  label: string
  description?: string
}
```
