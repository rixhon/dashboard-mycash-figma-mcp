# mycash+ — Documentação

## Progresso
- [x] PROMPT 0: Análise e Planejamento Inicial
- [x] PROMPT 1: Estrutura Base e Configuração
- [x] PROMPT 2: Sistema de Layout e Navegação Desktop
- [ ] PROMPT 3: Sistema de Layout e Navegação Mobile
- [ ] PROMPT 4: Context Global e Gerenciamento de Estado
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
├── pages/
│   ├── Dashboard.tsx
│   ├── Cards.tsx
│   ├── Transactions.tsx
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
