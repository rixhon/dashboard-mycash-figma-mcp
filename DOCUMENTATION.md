# mycash+ — Documentação

## Progresso
- [x] PROMPT 0: Análise e Planejamento Inicial
- [x] PROMPT 1: Estrutura Base e Configuração
- [x] PROMPT 2: Sistema de Layout e Navegação Desktop
- [ ] PROMPT 3: Sistema de Layout e Navegação Mobile
- [x] PROMPT 4: Context Global e Gerenciamento de Estado
- [ ] PROMPT 5: Cards de Resumo Financeiro
- [ ] PROMPT 6: Header do Dashboard com Controles
- [ ] PROMPT 7: Carrossel de Gastos por Categoria
- [ ] PROMPT 8: Gráfico de Fluxo Financeiro
- [ ] PROMPT 9: Widget de Cartões de Crédito
- [ ] PROMPT 10: Widget de Próximas Despesas
- [ ] PROMPT 11: Tabela de Transações Detalhada
- [ ] PROMPT 12: Modal de Nova Transação
- [ ] PROMPT 13: Modal de Adicionar Membro
- [ ] PROMPT 14: Modal de Adicionar Cartão
- [ ] PROMPT 15: Modal de Detalhes do Cartão
- [ ] PROMPT 16: Modal de Filtros Mobile
- [ ] PROMPT 17: View Completa de Cartões
- [ ] PROMPT 18: View Completa de Transações
- [ ] PROMPT 19: View de Perfil - Aba Informações
- [ ] PROMPT 20: View de Perfil - Aba Configurações
- [ ] PROMPT 21: Animações e Transições Globais
- [ ] PROMPT 22: Formatação e Utilitários
- [ ] PROMPT 23: Responsividade e Ajustes Finais
- [ ] PROMPT 24: Testes e Validação Final
- [ ] PROMPT FINAL: Revisão e Entrega

---

## PROMPT 0: Análise e Planejamento Inicial
Status: ✅ | Data: 2025-01-XX | Build: N/A (análise)

### Implementado
- Análise completa do design do dashboard
- Mapeamento de componentes visuais (hierarquia completa)
- Identificação de variáveis semânticas e primitivas
- Estrutura de navegação mapeada (sidebar desktop, header mobile)
- Arquitetura proposta definida (estrutura de pastas, hierarquia, estratégia)
- Criação de DOCUMENTATION.md
- Criação de PROMPTS.md (sequência completa de 12 prompts)
- Criação de ANALISE_PROMPT_0.md (análise detalhada)
- Criação de TODO list para implementação

### Tokens Identificados
**Semânticas (a confirmar no Figma):**
- --color-background-primary
- --color-background-secondary
- --color-text-primary
- --color-text-secondary
- --color-accent-yellow (ativo, receitas)
- --color-accent-green (positivo, checkmarks)
- --color-accent-red (negativo, despesas)
- --color-border-light

**Primitivas (a confirmar no Figma):**
- Família de cores gray (50-900)
- Família de cores brand (Nubank purple, Inter orange, Picpay green)
- Escala de espaçamento (xs, sm, md, lg, xl)
- Escala tipográfica (xs, sm, base, lg, xl, 2xl)
- Border radius (sm, md, lg, full)
- Shadows (sm, md, lg)

### Conversões
Aguardando acesso ao Figma para mapear conversões precisas de valores hex/px para tokens.

### Arquitetura Proposta
Ver seção "Arquitetura" abaixo.

---

## Arquitetura

### Estrutura de Pastas
```
src/
├── assets/
│   ├── icons/
│   └── logos/
├── components/
│   ├── layout/
│   │   ├── Sidebar/
│   │   │   └── Sidebar.tsx
│   │   ├── Header/
│   │   └── Layout.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Icon.tsx
│   │   ├── Table.tsx
│   │   └── Pagination.tsx
│   ├── charts/
│   │   └── FinancialFlowChart.tsx
│   └── sections/
│       ├── CategorySummary.tsx
│       ├── OverallFinancials.tsx
│       ├── CardsAndAccounts.tsx
│       ├── UpcomingExpenses.tsx
│       └── DetailedStatement.tsx
├── contexts/
│   ├── FinanceContext.tsx    ← PROMPT 4: Estado global
│   └── index.ts
├── pages/
│   ├── Dashboard.tsx
│   ├── Cards.tsx
│   ├── Transactions.tsx
│   ├── Goals.tsx
│   └── Profile.tsx
├── hooks/
│   ├── useResponsive.ts
│   ├── useNavigation.ts
│   └── useSidebar.ts
├── services/
│   └── supabase.ts
├── styles/
│   ├── tokens.css
│   └── globals.css
├── types/
│   └── index.ts
└── utils/
    └── formatters.ts
```

### Hierarquia de Componentes
```
App (Root)
└── Layout
    ├── Sidebar (desktop ≥1280px)
    ├── HeaderMobile (<1280px)
    └── Main
        └── [Page Component]
            └── [Section Components]
                └── [UI Components]
```

---

## Design System

### Breakpoints
- Mobile (base): < 768px
- Tablet: ≥ 768px e < 1280px
- Desktop: ≥ 1280px e < 1920px
- Wide/4K: ≥ 1920px

### Containers
- Padding main: px-4 (mobile) → px-6 (tablet) → px-8 (desktop)
- Max-width: 1400px (desktop) / 1600px (wide)

### Grids
- Mobile: 1 coluna
- Tablet: 2 colunas
- Desktop: 3-4 colunas (auto-fit)

---

## PROMPT 1: Estrutura Base e Configuração
Status: ✅ | Data: 2025-01-XX | Build: ✅ (2 tentativas)

### Implementado
- Estrutura de pastas completa (components, contexts, hooks, types, utils, constants)
- Configuração Vite + React + TypeScript
- Configuração Tailwind CSS com tokens do design system
- Tipos TypeScript para 5 entidades principais (Transaction, Goal, CreditCard, BankAccount, FamilyMember)
- React Router configurado com 5 rotas principais
- Arquivo de tokens CSS com variáveis semânticas e primitivas
- Breakpoints configurados (Mobile, Tablet, Desktop, Wide)
- Páginas base criadas (Dashboard, Cards, Transactions, Goals, Profile)

### Tokens
**Semânticas:**
- --color-background-primary, --color-background-secondary
- --color-text-primary, --color-text-secondary, --color-text-placeholder
- --color-accent-yellow, --color-accent-green, --color-accent-red, --color-accent-blue
- --color-border-light, --color-button-primary, --color-button-text
- --color-brand-nubank, --color-brand-inter, --color-brand-picpay
- --spacing-container, --spacing-card, --spacing-section, --spacing-item
- --font-family-primary, --font-size-h1, --font-size-h2, --font-size-large-value, --font-size-body, --font-size-small
- --font-weight-regular, --font-weight-semibold, --font-weight-bold
- --border-radius-sm, --border-radius-md, --border-radius-lg, --border-radius-full
- --shadow-sm, --shadow-md, --shadow-lg

**Primitivas:**
- --gray-50 até --gray-900
- --spacing-xs até --spacing-3xl
- --line-height-tight, --line-height-normal, --line-height-relaxed

### Conversões
Valores iniciais definidos baseados na análise do design. Aguardando acesso ao Figma para confirmar valores exatos.

### Build
Tentativas: 2 | Erros: 0 | Status: ✅ Sucesso

---

## Build Log

### PROMPT 0
Tentativas: N/A | Erros: 0 | Status: Análise concluída

### PROMPT 1
Tentativas: 2 | Erros: 0 | Status: ✅ Sucesso
**Commit**: `feat: estrutura base do projeto - PROMPT 1` (hash: c0b398f)

### PROMPT 4
Tentativas: 2 | Erros: 0 | Status: ✅ Sucesso
**Erro corrigido**: `TS6133: 'TransactionType' is declared but its value is never read`

---

## PROMPT 2: Sistema de Layout e Navegação Desktop
Status: ✅ | Data: 2025-01-XX | Build: ✅ (3 tentativas)

### Implementado
- Componente Sidebar com estados expanded/collapsed
- Hook useSidebar para gerenciar estado (persistência no localStorage)
- Componente SidebarItem com item ativo destacado
- Sistema de tooltips quando sidebar colapsada (hover com delay)
- Botão circular de alternância na borda direita
- Transições suaves (300ms) entre estados
- Layout principal ajusta margem esquerda fluidamente
- Integração com React Router para item ativo
- Perfil do usuário completo (expandido) ou apenas avatar (colapsado)
- Sidebar aparece apenas em desktop (≥1280px), oculta em mobile/tablet

### Refatoração conforme Figma MCP
- Item ativo: fundo amarelo-esverdeado brilhante (#C4E538) conforme design
- Logo: "Mycash" sublinhado + "+" conforme design do Figma
- Espaçamentos: uso exclusivo de tokens semânticos e primitivos
- Tipografia: line-height ajustado para melhor legibilidade
- Acessibilidade: focus states no botão de alternância
- Animações: transições suaves em todos os elementos interativos

### Tokens
**Semânticas:**
- --color-background-primary (fundo sidebar)
- --color-text-primary, --color-text-secondary (textos)
- --color-button-primary, --color-button-text (botão alternância)
- --color-accent-yellow-green (fundo item ativo - amarelo-esverdeado brilhante)
- --color-border-light (bordas)
- --spacing-md, --spacing-lg (padding interno)
- --font-size-h1 (logo)
- --font-size-body, --font-size-small (textos)
- --font-weight-bold, --font-weight-regular
- --border-radius-sm, --border-radius-lg, --border-radius-full
- --shadow-sm, --shadow-md (botão, tooltip)

**Primitivas:**
- --gray-100 (hover items inativos)
- --gray-900 (tooltip background)

**Conversões realizadas:**
- Larguras: 256px (expanded) → w-64, 80px (collapsed) → w-20
- Transições: 300ms duration com ease-in-out
- Delay tooltip: 300ms
- Item ativo: fundo amarelo-esverdeado (#C4E538) ao invés de preto (conforme Figma)
- Logo: "Mycash" sublinhado conforme design
- Espaçamentos: uso exclusivo de tokens (px-md, py-sm, gap-md, space-y-xs)
- Tipografia: line-height ajustado (leading-tight, leading-normal)
- Acessibilidade: focus states e aria-labels implementados

### Build
Tentativas: 3 | Erros: 0 | Status: ✅ Sucesso

**Refatoração completa conforme Figma MCP:**
- Item ativo: fundo amarelo-esverdeado brilhante (#C4E538) conforme design
- Logo: "Mycash" sublinhado + "+" conforme design do Figma
- Tokens atualizados: --color-accent-yellow-green adicionado ao design system
- Espaçamentos: uso exclusivo de tokens semânticos e primitivos
- Tipografia: line-height ajustado para melhor legibilidade
- Acessibilidade: focus states no botão de alternância
- Animações: hover effects e transições suaves em todos os elementos

---

## PROMPT 4: Context Global e Gerenciamento de Estado
Status: ✅ | Data: 2025-01-18 | Build: ✅ (2 tentativas)

### Implementado
- FinanceProvider como contexto principal no nível mais alto da aplicação
- Estado global com 5 arrays principais tipados (transactions, goals, creditCards, bankAccounts, familyMembers)
- Funções CRUD completas para todas as entidades
- Sistema de filtros globais (selectedMember, dateRange, transactionType, searchText)
- Funções de cálculo derivadas com aplicação automática de filtros
- Hook customizado useFinance como único ponto de acesso ao contexto
- Dados mock realistas para desenvolvimento

### Estado Principal
```typescript
// Arrays principais
transactions: Transaction[]
goals: Goal[]
creditCards: CreditCard[]
bankAccounts: BankAccount[]
familyMembers: FamilyMember[]

// Filtros globais
filters: {
  selectedMember: string | null
  dateRange: { startDate: Date, endDate: Date }
  transactionType: 'all' | 'income' | 'expense'
  searchText: string
}
```

### Funções CRUD
- `addTransaction`, `updateTransaction`, `deleteTransaction`
- `addGoal`, `updateGoal`, `deleteGoal`
- `addCreditCard`, `updateCreditCard`, `deleteCreditCard`
- `addBankAccount`, `updateBankAccount`, `deleteBankAccount`
- `addFamilyMember`, `updateFamilyMember`, `deleteFamilyMember`

### Funções de Filtro
- `setSelectedMember(memberId: string | null)` - Filtra por membro
- `setDateRange(range: DateRange)` - Define período
- `setTransactionType(type: TransactionFilterType)` - Filtra por tipo
- `setSearchText(text: string)` - Busca textual
- `resetFilters()` - Reseta todos os filtros

### Cálculos Derivados
- `getFilteredTransactions()` - Transações após aplicar todos os filtros
- `calculateTotalBalance()` - Soma saldos de contas - faturas de cartões
- `calculateIncomeForPeriod()` - Soma receitas do período filtrado
- `calculateExpensesForPeriod()` - Soma despesas do período filtrado
- `calculateExpensesByCategory()` - Despesas agrupadas por categoria (ordenadas por valor)
- `calculateCategoryPercentage(category)` - % da categoria vs receita total
- `calculateSavingsRate()` - Taxa de economia: (receitas - despesas) / receitas × 100

### Helpers
- `getMemberById(id)` - Busca membro por ID
- `getAccountById(id)` - Busca conta/cartão por ID

### Dados Mock
**Família Brasileira (3 membros):**
- Lucas Martins (Pai) - Renda: R$ 12.000
- Ana Martins (Mãe) - Renda: R$ 8.000
- Pedro Martins (Filho) - Renda: R$ 2.500

**Cartões de Crédito (3):**
- Nubank (Lucas) - Limite: R$ 15.000
- Inter (Ana) - Limite: R$ 10.000
- Picpay (Pedro) - Limite: R$ 5.000

**Contas Bancárias (3):**
- Nubank Conta (Lucas) - Saldo: R$ 8.500
- Inter Conta (Ana) - Saldo: R$ 4.200
- Picpay Conta (Pedro) - Saldo: R$ 1.800

**Objetivos (4):**
- Reserva de Emergência - Meta: R$ 60.000 / Atual: R$ 25.000
- Viagem para Europa - Meta: R$ 35.000 / Atual: R$ 12.000
- Notebook Novo - Meta: R$ 15.000 / Atual: R$ 8.500
- Curso de Inglês - Meta: R$ 5.000 / Atual: R$ 2.000

**Transações (30):**
- Distribuídas nos últimos 3 meses
- Categorias brasileiras: Salário, Freelance, Aluguel, Alimentação, Mercado, Transporte, Saúde, Educação, Lazer, Assinaturas, Academia, Manutenção, Vestuário, Pets

### Categorias Padrão
```typescript
const CATEGORIES = {
  income: ['Salário', 'Freelance', 'Investimentos', 'Outros'],
  expense: [
    'Aluguel', 'Alimentação', 'Mercado', 'Transporte', 'Saúde',
    'Educação', 'Lazer', 'Vestuário', 'Manutenção', 'Assinaturas',
    'Academia', 'Pets', 'Outros'
  ]
}
```

### Arquivos
- `src/contexts/FinanceContext.tsx` - Provider, estado, CRUD, filtros, cálculos
- `src/contexts/index.ts` - Exportações centralizadas
- `src/App.tsx` - Integração do FinanceProvider

### Uso
```typescript
import { useFinance } from '@/contexts'

function MyComponent() {
  const {
    transactions,
    addTransaction,
    calculateTotalBalance,
    filters,
    setSelectedMember
  } = useFinance()
  
  // ...
}
```

### Notas Importantes
⚠️ **SEM localStorage/sessionStorage** - Todo estado é mantido em memória via React state (useState). Dados são perdidos ao recarregar a página. Futuramente será integrado com Supabase para persistência real.

### Build
Tentativas: 2 | Erros: 0 | Status: ✅ Sucesso
- Erro corrigido: import não utilizado (TransactionType)
