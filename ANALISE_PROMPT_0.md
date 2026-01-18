# PROMPT 0: Análise e Planejamento Inicial — mycash+

## 📚 PRÉ-EXECUÇÃO
✓ Rules relidas e aplicadas
✓ Design do dashboard analisado (via descrição detalhada)
✓ Hierarquia de variáveis verificada
✓ Estrutura de navegação mapeada

---

## 📦 ANÁLISE COMPLETA

### 1. Componentes Visuais Identificados

#### 1.1 Layout Principal
- **Sidebar (Desktop)**
  - Logo "Mycash+" (texto bold)
  - Navegação: Home (ativo), Cartões
  - Perfil do usuário (avatar + nome + email)
  - Estado: Expanded (ícone + texto visíveis)
  - Estado alternativo: Collapsed (apenas ícones - a implementar)

- **Header (Desktop)**
  - Barra de pesquisa ("Pesquisar" com ícone de lupa)
  - Seletor de período ("01 Jan - 31 Jan 2026" com ícone de calendário)
  - Ícone de filtro/ordenação
  - Avatares de usuários (3 círculos)
  - Ícone de adicionar (círculo com +)
  - Botão "Nova transação" (preto com ícone + branco)

- **Main Content Area**
  - Container fluido (width: 100%)
  - Padding responsivo conforme breakpoint
  - Max-width para limitar leitura

#### 1.2 Seções do Dashboard

**A. Financial Categories Summary (Top Row)**
- 4 cards quadrados com:
  - Indicador de progresso circular (gradiente verde/amarelo)
  - Categoria financeira (Aluguel, Alimentação, Mercado, Academia)
  - Valor (R$ formatado)
  - Porcentagem de progresso

**B. Overall Financials (Middle Row)**
- 3 cards retangulares:
  - **Saldo total**: Ícone "$", valor em azul (R$ 2.000,00)
  - **Receitas**: Ícone seta verde para baixo, valor (R$ 12.000,00)
  - **Despesas**: Ícone seta vermelha para cima, valor (R$ 10.000,00)

**C. Cards & Contas (Right Column)**
- Header: "Cards & contas" + ícone + e seta direita
- Lista de contas/cartões:
  - Nubank (logo roxo, R$ 120,00, "Vence dia 10", "**** 5897")
  - Inter (logo laranja, R$ 2.300,00, "Vence dia 21", "**** 5897")
  - Picpay (logo verde, R$ 17.000,00, "Vence dia 12", "**** 5897")

**D. Próximas Despesas (Right Column)**
- Header: "Próximas despesas" + ícone +
- Lista de 5 itens idênticos:
  - "Conta de Luz" (R$ 154,00, "Vence dia 21/01", "Crédito Nubank **** 5897")
  - Ícone de checkmark verde

**E. Fluxo Financeiro (Bottom Left)**
- Header: Ícone de gráfico de linha + "Fluxo financeiro"
- Legenda: "Receitas" (ponto amarelo), "Despesas" (ponto vermelho)
- Gráfico de área:
  - Eixo Y: R$ 0,00 a R$ 17.500 (incrementos de R$ 2.500)
  - Eixo X: Meses JAN a DEZ
  - Área amarela (Receitas)
  - Área vermelha (Despesas)

**F. Extrato Detalhado (Bottom)**
- Header: Ícone de documento + "Extrato detalhado"
- Barra de busca: "Buscar lançamentos" + ícone de lupa
- Dropdown: "Despesas" + seta para baixo
- Tabela com colunas:
  - Membro (avatar)
  - Datas
  - Descrição
  - Categorias
  - Conta/cartão
  - Parcelas
  - Valor
- 3 linhas de exemplo visíveis
- Paginação: "Mostrando 1 a 5 de 17" + setas + números (1, 2, 3, 4, 5)

---

### 2. Hierarquia Visual e Relação entre Componentes

```
Layout (Container Principal)
├── Sidebar (Desktop ≥1280px)
│   ├── Logo
│   ├── NavigationItem (Home - ativo)
│   ├── NavigationItem (Cartões)
│   └── UserProfile
│       ├── Avatar
│       ├── Nome
│       └── Email
│
├── Header (Desktop)
│   ├── SearchInput
│   ├── DateRangeSelector
│   ├── FilterIcon
│   ├── UserAvatars (3x)
│   ├── AddIcon
│   └── Button ("Nova transação")
│
└── Main (Content Area)
    └── Dashboard Page
        ├── CategorySummary (Grid 4 colunas)
        │   └── CategoryCard (4x)
        │       ├── CircularProgress
        │       ├── CategoryName
        │       └── Value
        │
        ├── OverallFinancials (Grid 3 colunas)
        │   ├── BalanceCard
        │   ├── IncomeCard
        │   └── ExpenseCard
        │
        ├── RightColumn
        │   ├── CardsAndAccounts
        │   │   ├── Header
        │   │   └── AccountItem (3x)
        │   │       ├── Logo
        │   │       ├── Value
        │   │       ├── DueDate
        │   │       └── CardNumber
        │   │
        │   └── UpcomingExpenses
        │       ├── Header
        │       └── ExpenseItem (5x)
        │           ├── Description
        │           ├── Value
        │           ├── DueDate
        │           ├── PaymentMethod
        │           └── CheckIcon
        │
        ├── FinancialFlowChart
        │   ├── Header
        │   ├── Legend
        │   └── AreaChart
        │
        └── DetailedStatement
            ├── Header
            ├── SearchInput
            ├── Dropdown
            ├── Table
            │   └── TableRow (múltiplas)
            └── Pagination
```

---

### 3. Variáveis Semânticas Identificadas

#### 3.1 Cores Semânticas
- `--color-background-primary` (fundo branco/claro)
- `--color-background-secondary` (fundo de cards - cinza claro)
- `--color-text-primary` (texto preto)
- `--color-text-secondary` (texto cinza escuro)
- `--color-text-placeholder` (texto cinza claro - placeholders)
- `--color-accent-yellow` (estado ativo, área de receitas)
- `--color-accent-green` (valores positivos, checkmarks, seta receitas)
- `--color-accent-red` (valores negativos, seta despesas, área despesas)
- `--color-accent-blue` (saldo total)
- `--color-border-light` (bordas sutis)
- `--color-button-primary` (botão "Nova transação" - preto)
- `--color-button-text` (texto do botão - branco)

#### 3.2 Cores de Marca (Brand Colors)
- `--color-brand-nubank` (roxo)
- `--color-brand-inter` (laranja)
- `--color-brand-picpay` (verde)

#### 3.3 Espaçamento Semântico
- `--spacing-container` (padding do container principal)
- `--spacing-card` (padding interno dos cards)
- `--spacing-section` (gap entre seções)
- `--spacing-item` (gap entre itens de lista)

#### 3.4 Tipografia Semântica
- `--font-family-primary` (fonte sans-serif)
- `--font-size-h1` (logo "Mycash+")
- `--font-size-h2` (títulos de seção)
- `--font-size-large-value` (valores em R$ grandes)
- `--font-size-body` (texto padrão)
- `--font-size-small` (texto secundário)
- `--font-weight-bold` (títulos, valores importantes)
- `--font-weight-regular` (texto padrão)

#### 3.5 Shape Semântico
- `--border-radius-sm` (cards, botões, inputs)
- `--border-radius-full` (avatares, círculos de progresso)
- `--shadow-sm` (sombra sutil nos cards)

---

### 4. Variáveis Primitivas (A Confirmar no Figma)

#### 4.1 Cores Primitivas
- Família Gray: `--gray-50` até `--gray-900`
- Família Yellow: `--yellow-50` até `--yellow-900`
- Família Green: `--green-50` até `--green-900`
- Família Red: `--red-50` até `--red-900`
- Família Blue: `--blue-50` até `--blue-900`
- Família Purple: `--purple-50` até `--purple-900`
- Família Orange: `--orange-50` até `--orange-900`

#### 4.2 Espaçamento Primitivo
- `--spacing-xs` (4px)
- `--spacing-sm` (8px)
- `--spacing-md` (16px)
- `--spacing-lg` (24px)
- `--spacing-xl` (32px)
- `--spacing-2xl` (48px)
- `--spacing-3xl` (64px)

#### 4.3 Tipografia Primitiva
- `--font-size-xs` (12px)
- `--font-size-sm` (14px)
- `--font-size-base` (16px)
- `--font-size-lg` (18px)
- `--font-size-xl` (20px)
- `--font-size-2xl` (24px)
- `--font-size-3xl` (30px)
- `--font-size-4xl` (36px)
- `--line-height-tight` (1.2)
- `--line-height-normal` (1.5)
- `--line-height-relaxed` (1.75)

#### 4.4 Border Radius Primitivo
- `--radius-sm` (4px)
- `--radius-md` (8px)
- `--radius-lg` (12px)
- `--radius-xl` (16px)
- `--radius-full` (9999px)

#### 4.5 Shadows Primitivo
- `--shadow-sm` (0 1px 2px rgba(0,0,0,0.05))
- `--shadow-md` (0 4px 6px rgba(0,0,0,0.1))
- `--shadow-lg` (0 10px 15px rgba(0,0,0,0.1))

---

### 5. Estrutura de Navegação

#### 5.1 Sidebar Desktop (≥1280px)
**Estado Expanded:**
- Largura: ~240px (a confirmar no Figma)
- Exibe: Logo + texto, ícone + texto dos itens
- Perfil do usuário completo no rodapé
- Transição suave para collapsed

**Estado Collapsed:**
- Largura: ~64px (a confirmar no Figma)
- Exibe: Apenas ícones
- Tooltip no hover com nome do item
- Perfil reduzido (apenas avatar)

**Transições:**
- Animação suave de largura
- Conteúdo principal ajusta automaticamente
- Não sobrepõe conteúdo

#### 5.2 Header Mobile (<1280px)
- Altura: ~64px (a confirmar)
- Botão menu (esquerda) → abre drawer
- Ações principais (direita)
- Drawer: overlay com lista de navegação
- Fecha ao clicar fora ou selecionar item

#### 5.3 Navegação entre Páginas
- Home (Dashboard) - estado ativo (amarelo)
- Cartões
- Transações (implícito)
- Perfil (implícito)
- Transição: fade ou slide (a definir)

---

### 6. Arquitetura Proposta

#### 6.1 Estrutura de Pastas
```
src/
├── assets/
│   ├── icons/          # Ícones SVG
│   └── logos/          # Logos (Nubank, Inter, Picpay)
│
├── components/
│   ├── layout/
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── SidebarItem.tsx
│   │   │   └── useSidebar.ts
│   │   ├── Header/
│   │   │   ├── HeaderDesktop.tsx
│   │   │   ├── HeaderMobile.tsx
│   │   │   ├── SearchInput.tsx
│   │   │   └── DateRangeSelector.tsx
│   │   └── Layout.tsx
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Icon.tsx
│   │   ├── Table.tsx
│   │   └── Pagination.tsx
│   │
│   ├── charts/
│   │   └── FinancialFlowChart.tsx
│   │
│   └── sections/
│       ├── CategorySummary.tsx
│       ├── CategoryCard.tsx
│       ├── OverallFinancials.tsx
│       ├── BalanceCard.tsx
│       ├── IncomeCard.tsx
│       ├── ExpenseCard.tsx
│       ├── CardsAndAccounts.tsx
│       ├── AccountItem.tsx
│       ├── UpcomingExpenses.tsx
│       ├── ExpenseItem.tsx
│       └── DetailedStatement.tsx
│
├── pages/
│   ├── Dashboard.tsx
│   ├── Cards.tsx
│   ├── Transactions.tsx
│   └── Profile.tsx
│
├── hooks/
│   ├── useResponsive.ts
│   ├── useNavigation.ts
│   └── useSidebar.ts
│
├── services/
│   └── supabase.ts
│
├── styles/
│   ├── tokens.css      # Variáveis CSS do design system
│   └── globals.css     # Estilos globais
│
├── types/
│   └── index.ts        # TypeScript types
│
└── utils/
    └── formatters.ts   # Formatação de valores, datas
```

#### 6.2 Hierarquia de Componentes
```
App (Root)
└── Layout
    ├── Sidebar (condicional: ≥1280px)
    │   ├── Logo
    │   ├── NavigationItem[]
    │   └── UserProfile
    │
    ├── HeaderMobile (condicional: <1280px)
    │   ├── MenuButton
    │   └── Actions
    │
    └── Main (Content Area)
        └── Router/Outlet
            └── [Page Component]
                └── [Section Components]
                    └── [UI Components]
```

#### 6.3 Estratégia de Componentização

**Atomic Design:**
- **Atoms**: Button, Input, Icon, Avatar
- **Molecules**: SearchInput, NavigationItem, CategoryCard
- **Organisms**: Sidebar, Header, CategorySummary, FinancialFlowChart
- **Templates**: Layout, Dashboard layout
- **Pages**: Dashboard, Cards, Transactions, Profile

**Reusabilidade:**
- Componentes genéricos (Card, Button) com props para variantes
- Composição sobre configuração
- Props tipadas com TypeScript

**Data Flow:**
- React Context ou Zustand para estado global
- Hooks customizados para lógica de negócio
- Services para comunicação com Supabase

**Styling:**
- Tailwind CSS com variáveis CSS customizadas
- Classes utilitárias do Tailwind
- Variáveis CSS para tokens do design system
- NUNCA valores hardcoded

**Responsividade:**
- Mobile-first approach
- Breakpoints explícitos (md, lg, xl)
- Grids responsivos (auto-fit/auto-fill)
- Componentes adaptativos

---

### 7. Conversões Necessárias (A Confirmar no Figma)

**Aguardando acesso ao Figma para:**
- Mapear valores hex exatos → tokens primitivos
- Mapear valores px exatos → tokens de espaçamento
- Confirmar escala tipográfica completa
- Confirmar valores de border-radius
- Confirmar valores de shadows

**Exemplos de conversões esperadas:**
- Cores hex → primitivas mais próximas
- Espaçamentos px → tokens da escala
- Tamanhos de fonte px → escala tipográfica

---

## 🎯 Resumo da Arquitetura

### Princípios
1. **Layout 100% fluido** - width: 100%, max-width para limitação
2. **Mobile-first** - design base no mobile, breakpoints evoluem
3. **Componentização atômica** - pequenos componentes reutilizáveis
4. **Hierarquia de variáveis** - semântica → primitiva → conversão
5. **Zero hardcoded** - todos os valores via tokens
6. **Responsividade obrigatória** - testado em 375px, 768px, 1280px, 1920px

### Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Supabase
- React Router (implícito)

### Estrutura de Navegação
- Sidebar desktop (expanded/collapsed) ≥1280px
- Header mobile (<1280px) com drawer
- Transições suaves entre estados

### Design System
- Tokens semânticos (cores, espaçamento, tipografia)
- Tokens primitivos (escalas base)
- Conversão inteligente de valores locais
- NUNCA valores hardcoded

---

## ✅ PROMPT 0: Análise e Planejamento Inicial — CONCLUÍDO

### 📚 PRÉ-EXECUÇÃO
✓ Rules relidas e aplicadas
✓ Design do dashboard analisado
✓ Hierarquia de variáveis verificada
✓ Estrutura de navegação mapeada

### 📦 IMPLEMENTADO
- Análise completa dos componentes visuais do dashboard
- Mapeamento da hierarquia visual e relações entre componentes
- Identificação de variáveis semânticas e primitivas
- Análise da estrutura de navegação (sidebar desktop, header mobile)
- Proposta de arquitetura completa (estrutura de pastas, hierarquia, estratégia)
- Criação de DOCUMENTATION.md
- Criação de PROMPTS.md (sequência completa)
- Criação de TODO list para implementação

### 🎨 TOKENS IDENTIFICADOS
**Semânticas:**
- --color-background-primary, --color-background-secondary
- --color-text-primary, --color-text-secondary, --color-text-placeholder
- --color-accent-yellow, --color-accent-green, --color-accent-red, --color-accent-blue
- --color-border-light
- --color-button-primary, --color-button-text
- --color-brand-nubank, --color-brand-inter, --color-brand-picpay
- --spacing-container, --spacing-card, --spacing-section, --spacing-item
- --font-family-primary
- --font-size-h1, --font-size-h2, --font-size-large-value, --font-size-body, --font-size-small
- --font-weight-bold, --font-weight-regular
- --border-radius-sm, --border-radius-full
- --shadow-sm

**Primitivas (a confirmar no Figma):**
- Famílias de cores (gray, yellow, green, red, blue, purple, orange) 50-900
- Escala de espaçamento (xs, sm, md, lg, xl, 2xl, 3xl)
- Escala tipográfica (xs, sm, base, lg, xl, 2xl, 3xl, 4xl)
- Line-heights (tight, normal, relaxed)
- Border radius (sm, md, lg, xl, full)
- Shadows (sm, md, lg)

**Conversões:**
- Aguardando acesso ao Figma para mapear conversões precisas de hex/px para tokens

### 📁 ARQUIVOS CRIADOS
- DOCUMENTATION.md
- PROMPTS.md
- ANALISE_PROMPT_0.md (este arquivo)

### 🔨 BUILD STATUS
N/A (análise - sem código ainda)

### 🤔 PRÓXIMOS PASSOS
⏭️ PROMPT 1: Estrutura Base
- Setup do projeto (Vite + React + TypeScript)
- Configuração do Tailwind CSS
- Criação do arquivo de tokens CSS
- Estrutura base de componentes
- Setup inicial do Supabase

**Comandos disponíveis:**
- "Próximo" → Avançar para PROMPT 1
- "Revisar [arquivo]" → Revisar arquivo específico
- "Status" → Ver progresso geral
- "Tokens" → Ver mapeamento completo de tokens
