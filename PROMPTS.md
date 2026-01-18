# Sequência de Prompts — mycash+

## PROMPT 0: Análise e Planejamento Inicial ✅
**Status:** Concluído

**Objetivos:**
- Acessar design do mycash+ via Figma MCP
- Identificar todos os componentes visuais (Dashboard, Cartões, Transações, Perfil)
- Mapear hierarquia visual e relação entre componentes
- Identificar variáveis semânticas e primitivas do design system
- Listar tokens de cor, espaçamento, tipografia e shape
- Analisar estrutura de navegação (sidebar desktop expandida/colapsada, header mobile)
- Apresentar resumo da arquitetura proposta

---

## 🏗️ PROMPT 1: Estrutura Base e Configuração
**Status:** Pendente

**Objetivos:**
- Configurar estrutura de pastas seguindo boas práticas React
- Criar diretórios: components, contexts, hooks, types, utils, constants
- Organizar components por domínio: layout, dashboard, cards, modals
- Configurar Tailwind CSS para reconhecer variables do Figma como classes customizadas
- Mapear todos os tokens semânticos e primitivos no Tailwind config
- Criar tipos TypeScript fundamentais: Transaction, Goal, CreditCard, BankAccount, FamilyMember
- Configurar React Router para 5 rotas principais (SPA)
- Requisitos de Responsividade: Desktop (≥1024px), Tablet (641-1023px), Mobile (≤640px)

---

## 🎨 PROMPT 2: Sistema de Layout e Navegação Desktop
**Status:** Pendente

**Objetivos:**
- Criar componente Sidebar com dois estados: expandido e colapsado
- Estado expandido: logo completo, nomes das seções, perfil completo
- Estado colapsado: apenas ícones
- Botão circular na borda direita para alternar estados (seta esquerda/direita)
- Transições suaves entre estados (conteúdo ajusta margem esquerda)
- Sistema de tooltip quando sidebar colapsada (hover com delay)
- Item ativo: fundo preto, texto branco, ícone verde-limão
- Itens inativos: fundo transparente, texto cinza
- Utilizar exclusivamente variables do design system
- Requisitos de Responsividade: Desktop (≥1024px), Tablet (641-1023px), Mobile (≤640px)

---

## 📱 PROMPT 3: Sistema de Layout e Navegação Mobile
**Status:** Pendente

**Objetivos:**
- Implementar HeaderMobile que substitui sidebar em <1024px
- Header fixo no topo, largura total, visível durante scroll
- Logotipo "mycash+" à esquerda, avatar do usuário à direita
- Avatar clicável abre MenuDropdown
- MenuDropdown desliza de cima para baixo (não fullscreen)
- Lista de navegação com ícone e texto
- Item atual destacado com fundo preto
- Botão vermelho "Sair" no rodapé do menu
- Fechamento: clicar em item, X, ou fora (overlay escuro)
- Breakpoints: desktop (≥1024px) apenas sidebar, mobile/tablet (<1024px) apenas header
- Nunca renderizar sidebar + header simultaneamente
- Utilizar variables do design system

---

## 💾 PROMPT 4: Context Global e Gerenciamento de Estado
**Status:** Pendente

**⚠️ REGRA CRÍTICA:** NÃO usar localStorage, sessionStorage ou browser storage. Apenas React state (useState, useReducer).

**Objetivos:**
- Criar FinanceProvider (Context Provider) no nível mais alto
- Manter 5 arrays principais: transactions, goals, creditCards, bankAccounts, familyMembers
- Implementar funções CRUD para cada entidade
- Estados de filtros globais: selectedMember, dateRange, transactionType, searchText
- Funções de cálculo derivadas:
  - getFilteredTransactions (aplica todos os filtros)
  - calculateTotalBalance
  - calculateIncomeForPeriod
  - calculateExpensesForPeriod
  - calculateExpensesByCategory
  - calculateCategoryPercentage
  - calculateSavingsRate
- Hook customizado useFinance (único ponto de acesso)
- População inicial com dados mock realistas (3 membros, 3 cartões, 20-30 transações, 4 objetivos)

---

## 📊 PROMPT 5: Cards de Resumo Financeiro
**Status:** Pendente

**Objetivos:**
- BalanceCard: fundo preto, texto branco, círculo verde-limão desfocado de fundo
- Label "Saldo Total" cinza claro, valor grande formatado como moeda
- Badge com crescimento percentual comparado ao mês anterior
- IncomeCard: fundo branco, label "Receitas", ícone seta diagonal baixo-esquerda
- ExpenseCard: similar ao IncomeCard, label "Despesas", ícone seta diagonal cima-direita
- Valores vêm de calculateTotalBalance, calculateIncomeForPeriod, calculateExpensesForPeriod
- Layout horizontal desktop, vertical mobile
- Animações de contagem nos valores (0 até valor final em 800ms)
- Seguir hierarquia de variáveis das Project Rules

---

## 🎯 PROMPT 6: Header do Dashboard com Controles
**Status:** Pendente

**Objetivos:**
- DashboardHeader: barra horizontal responsiva
- Campo de busca à esquerda com ícone de lupa, busca em tempo real
- Busca case-insensitive em descrição OU categoria
- Botão de filtros: popover desktop, modal fullscreen mobile
- FilterPopover: glassmorphism, seção "Tipo de Transação" com 3 opções rádio
- Seletor de período: botão mostra período formatado, abre calendário
- Calendário: 2 meses lado a lado (desktop), 1 mês (mobile)
- Botões de atalho: "Este mês", "Mês passado", "Últimos 3 meses", "Este ano"
- Widget de membros: avatares sobrepostos, hover cresce, clique aplica filtro
- Avatar selecionado: borda preta grossa, check verde
- Botão "+" para adicionar membro
- Botão "Nova Transação" preto com ícone "+"
- Utilizar variables do design system

---

## 🍩 PROMPT 7: Carrossel de Gastos por Categoria
**Status:** Pendente

**Objetivos:**
- ExpensesByCategoryCarousel: processa calculateExpensesByCategory
- CategoryDonutCard: card 160px largura, gráfico donut 64px diâmetro
- Donut: anel externo colorido (percentual), anel interno vazio
- Cores rotativas: verde-limão, preto, cinza médio
- Percentual centralizado com 1 casa decimal
- Nome da categoria (truncado se longo)
- Valor formatado como moeda
- Carrossel scrollável: mouse wheel horizontal, clique e arrasta, setas de navegação
- Setas flutuantes aparecem no hover, desaparecem ao sair
- Gradiente de máscara nas bordas (fade)
- Hover nos cards: borda muda para verde-limão
- Mobile: apenas scroll por toque, sem setas
- Utilizar variables do design system

---

## 📈 PROMPT 8: Gráfico de Fluxo Financeiro
**Status:** Pendente

**Objetivos:**
- FinancialFlowChart usando Recharts (ou similar)
- Card grande: título "Fluxo Financeiro" com ícone, legenda (Receitas verde-limão, Despesas preto)
- Altura fixa 300px, largura responsiva 100%
- Eixo X: meses abreviados (Jan, Fev, Mar...)
- Eixo Y: valores compactos (R$ 2k, R$ 4k, R$ 6k...)
- Linhas horizontais tracejadas sutis (grid)
- Área receitas: linha verde-limão 3px, gradiente vertical (topo 30% opaco, base transparente)
- Área despesas: linha preta 3px, gradiente vertical (topo 10% opaco, base transparente)
- Tooltip interativo: linha vertical cinza acompanha cursor
- Tooltip flutuante: fundo branco, sombra, 3 linhas (mês, receitas, despesas)
- Dados mock fixos para 7 meses (estruturado para dados reais futuros)
- Utilizar variables do design system

---

## 💳 PROMPT 9: Widget de Cartões de Crédito
**Status:** Pendente

**Objetivos:**
- CreditCardsWidget: fundo cinza claro, bordas arredondadas
- Header: ícone cartão + título "Cartões" + botão "+" circular
- Lista vertical de cartões do array creditCards
- Cada card: fundo branco, cantos arredondados, sombra
- Layout horizontal: ícone (esquerda), informações (centro), indicador uso (direita)
- Ícone: bloco quadrado com cor do tema (preto, verde-limão, branco)
- Informações: nome cartão/banco, valor fatura (grande negrito), final mascarado
- Badge percentual de uso: (fatura ÷ limite) × 100
- Hover: card eleva (translateY -4px a -8px), sombra aumenta
- Clique: abre modal de detalhes
- Paginação se mais de 3 cartões (mobile: swipe horizontal)
- Utilizar variables do design system

---

## 📋 PROMPT 10: Widget de Próximas Despesas
**Status:** Pendente

**Objetivos:**
- Widget fundo branco, borda clara, cantos arredondados
- Header: ícone carteira + "Próximas despesas" + botão "+" circular
- Lista vertical de despesas pendentes (tipo "despesa", não pagas)
- Ordenação por data de vencimento crescente
- Cada item: linha horizontal com padding generoso
- Coluna esquerda: descrição (negrito), data vencimento, conta/cartão
- Formato conta: "Nubank conta" ou "Crédito Nubank **** 5897"
- Coluna direita: valor (grande negrito) + botão check circular
- Botão check: hover fundo verde claro, clique marca como paga
- Ao marcar: anima, remove da lista, cria próxima ocorrência se recorrente
- Estado vazio: ícone check verde, mensagem, borda tracejada
- Utilizar variables do design system

---

## 📋 PROMPT 11: Tabela de Transações Detalhada
**Status:** Pendente

**Objetivos:**
- TransactionsTable: header com título "Extrato Detalhado" + controles
- Busca local: ícone lupa, placeholder "Buscar lançamentos...", busca tempo real
- Select tipo: "Todos", "Receitas", "Despesas"
- Tabela: 7 colunas (Avatar, Data, Descrição, Categorias, Conta/cartão, Parcelas, Valor)
- Avatar: foto circular 24px ou ícone genérico
- Data: formato DD/MM/AAAA
- Descrição: ícone tipo (receita: seta baixo-esquerda verde, despesa: seta cima-direita vermelha) + texto
- Categoria: badge arredondado cinza
- Conta/Cartão: nome ou "Desconhecido"
- Parcelas: "3x" ou "-" se à vista
- Valor: alinhado direita, "+" verde (receitas) ou "-" preto (despesas)
- Zebra striping sutil
- Hover: linha fundo cinza claro
- Filtragem combinada: filtros globais + filtros locais (AND lógico)
- Ordenação por data decrescente
- Paginação: 5 transações por vez, contador "Mostrando 1 a 5 de 47"
- Controles: Anterior, números páginas, Próxima
- Estado vazio: "Nenhum lançamento encontrado"
- Utilizar variables do design system

---

## 🗂️ PROMPT 12: Modal de Nova Transação
**Status:** Pendente

**Objetivos:**
- Modal tela cheia: header fixo, conteúdo scrollável, footer fixo
- Header: ícone grande (64px) muda conforme tipo (receita verde-limão, despesa preto)
- Título "Nova Transação" + subtítulo + botão X
- Toggle tipo: 2 botões lado a lado (Receita/Despesa)
- Campo valor: input numérico 56px, símbolo "R$" fixo esquerda
- Campo descrição: input texto 56px
- Campo categoria: dropdown + botão "+ Nova Categoria" inline
- Grid 2 colunas: Select membro + Select conta/cartão
- Campo parcelamento: aparece se cartão E despesa, animação fade-in
- Checkbox despesa recorrente: aparece se despesa, fundo azul suave
- Footer: botões "Cancelar" e "Salvar Transação"
- Validação: valor > 0, descrição ≥ 3 chars, categoria obrigatória, conta obrigatória
- Ao salvar: cria transação, fecha modal, toast sucesso
- Utilizar variables do design system

---

## 👥 PROMPT 13: Modal de Adicionar Membro
**Status:** Pendente

**Objetivos:**
- AddMemberModal: estrutura similar modal transação
- Header: "Adicionar Membro da Família" + botão X
- Footer: "Cancelar" e "Adicionar Membro"
- Campo nome completo: obrigatório, mínimo 3 caracteres
- Campo função: obrigatório, combobox com sugestões (Pai, Mãe, Filho...)
- Campo avatar: 2 opções (URL ou Upload), opcional
- Campo renda mensal: numérico opcional, formatação moeda
- Validação: nome e função obrigatórios
- Ao adicionar: cria membro, adiciona ao array, fecha modal, toast sucesso
- Novo membro aparece imediatamente nos avatares e dropdowns
- Utilizar variables do design system

---

## 💳 PROMPT 14: Modal de Adicionar Cartão
**Status:** Pendente

**Objetivos:**
- Modal centralizado: header fixo, conteúdo scrollável, footer fixo
- Header: "Adicionar Conta/Cartão" + botão X
- Footer: "Cancelar" e "Adicionar"
- Toggle tipo: "Conta Bancária" ou "Cartão de Crédito"
- Campo nome: obrigatório, mínimo 3 caracteres
- Campo titular: dropdown obrigatório (lista membros)
- Campos condicionais Conta: saldo inicial (obrigatório, formatação moeda)
- Campos condicionais Cartão: dia fechamento (1-31), dia vencimento (1-31), limite total (>0), últimos 4 dígitos (opcional), tema visual (Black/Lime/White)
- Validação conforme tipo
- Ao adicionar: cria objeto, adiciona ao array apropriado, fecha modal, toast sucesso
- Utilizar variables do design system

---

## 📊 PROMPT 15: Modal de Detalhes do Cartão
**Status:** Pendente

**Objetivos:**
- CardDetailsModal: abre ao clicar em cartão no widget
- Modal maior: largura média-grande
- Área informações: grid 2-3 colunas (desktop), 1 coluna (mobile)
- Informações: limite total, fatura atual, limite disponível, percentual uso, datas, últimos dígitos
- Representação visual: gráfico donut ou barra progresso
- Área despesas: tabela simplificada (Data, Descrição, Categoria, Parcelas, Valor)
- Filtra transações: type="expense" E accountId=cartão
- Paginação se >10 despesas
- Botões ação: "Ver Extrato Completo", "Adicionar Despesa", "Editar Cartão", "Fechar"
- Utilizar variables do design system

---

## 📱 PROMPT 16: Modal de Filtros Mobile
**Status:** Pendente

**Objetivos:**
- FiltersMobileModal: abre ao tocar botão filtros no header mobile
- Animação: slide-in de baixo para cima (300ms)
- Estrutura: header fixo, conteúdo scrollável, footer fixo
- Header: "Filtros" + botão X grande (44x44px mínimo)
- Footer: botão "Aplicar Filtros" 56px altura, largura quase total
- Seção tipo transação: grid 3 colunas, botões 48px altura
- Seção membro: botões horizontais com wrap, avatar 32px + nome
- Seção período: calendário 1 mês, seleção intervalo
- Estado temporário local (não aplica até "Aplicar Filtros")
- Ao aplicar: copia para estado global, fecha modal slide-out
- Ao cancelar: fecha sem aplicar, descarta mudanças
- Touch-friendly: áreas mínimas 44x44px
- Utilizar variables do design system

---

## 💳 PROMPT 17: View Completa de Cartões
**Status:** Pendente

**Objetivos:**
- CardsView: seção principal navegável
- Header: "Cartões de Crédito" + botão "Novo Cartão"
- Grid responsivo: 1 coluna (mobile), 2 colunas (tablet), 3 colunas (desktop)
- Cada card: informações completas (nome, valores, datas, tema, dígitos)
- Representação visual: barra progresso ou donut
- Botões: "Ver Detalhes", "Adicionar Despesa"
- Hover: card eleva, sombra aumenta
- Clique: abre modal detalhes
- Estado vazio: ícone cartão, "Nenhum cartão cadastrado", botão "Cadastrar Primeiro Cartão"
- Ordenação: fatura decrescente ou alfabética
- Utilizar variables do design system

---

## 📋 PROMPT 18: View Completa de Transações
**Status:** Pendente

**Objetivos:**
- TransactionsView: seção principal
- Header: "Transações" + botão "Nova Transação"
- Barra filtros avançados: busca, tipo, categoria, conta/cartão, membro, período, status
- Filtros trabalham em conjunto (AND lógico)
- Linha resumo: total receitas, total despesas, diferença, quantidade
- Tabela expandida: 10 linhas por página, largura total
- Ordenação clicável nos headers (seta indica ordem)
- Botão "Exportar" (CSV ou PDF)
- Estado vazio: "Nenhuma transação registrada ainda"
- Utilizar getFilteredTransactions do contexto
- Utilizar variables do design system

---

## 👤 PROMPT 19: View de Perfil - Aba Informações
**Status:** Pendente

**Objetivos:**
- ProfileView: última seção principal
- Sistema de abas: "Informações" e "Configurações"
- Aba "Informações" ativa por padrão
- Seção perfil: card grande com avatar 120px, nome, função, email, renda
- Botão "Editar Perfil"
- Seção membros família: lista vertical de todos os membros
- Cada item: avatar 48px, nome, função, renda
- Hover: fundo cinza mais escuro
- Clique: abre modal editar
- Se apenas 1 membro: mensagem + botão "Adicionar Membro"
- Botão vermelho "Sair" com ícone logout
- Utilizar variables do design system

---

## ⚙️ PROMPT 20: View de Perfil - Aba Configurações
**Status:** Pendente

**Objetivos:**
- Aba "Configurações" dentro ProfileView
- Seção preferências exibição: toggle "Modo Escuro" (desabilitado), select moeda, select formato data
- Seção notificações: múltiplos toggles (lembrete vencimento, alerta limite, resumo mensal, objetivos)
- Seção categorias: gerenciar categorias receita/despesa, adicionar, editar, deletar
- Seção dados privacidade: botão "Exportar Todos os Dados", botão "Limpar Todos os Dados" (com confirmação)
- Seção sobre: versão, descrição, links termos/privacidade
- Cards organizados verticalmente (mobile) ou lado a lado (desktop)
- Utilizar variables do design system

---

## 🎨 PROMPT 21: Animações e Transições Globais
**Status:** Pendente

**Objetivos:**
- Transições navegação: fade-out/fade-in entre seções (200ms defasado)
- Animações entrada: fade-in + slide-up para cards (300ms, stagger 50-80ms)
- Animações hover: botões (200ms), cards (250ms), avatares (200ms)
- Animações loading valores: contagem 0 até valor final (800ms, ease-out)
- Animações barras progresso: preenchimento 1000ms ease-out
- Animações modais: abertura (fade-in + scale 250ms), fechamento (fade-out + scale 200ms)
- Modal mobile filtros: slide-in/slide-out vertical (300ms)
- Animações toasts: slide-in direita + fade-in (300ms), fade-out + slide-out (250ms)
- Skeleton loaders: pulse (opacity 0.6-1, 1500ms infinito)
- Micro-interações: checkboxes/toggles (scale), inputs (borda), dropdowns (fade-in + slide-down)
- Usar Framer Motion ou CSS transitions
- Respeitar prefers-reduced-motion

---

## 🎯 PROMPT 22: Formatação e Utilitários
**Status:** Pendente

**Objetivos:**
- formatCurrency: número → "R$ 1.234,56" (Intl.NumberFormat pt-BR)
- formatCompactCurrency: número → "R$ 2,5k" ou "R$ 1,2M"
- parseCurrencyInput: string → número (remove formatação)
- formatDate: Date → "DD/MM/AAAA" (date-fns pt-BR)
- formatDateLong: Date → "15 de Janeiro de 2024"
- formatDateRange: 2 datas → "01 jan - 31 jan, 2024"
- formatRelativeDate: Date → "Hoje", "Ontem", "Há 3 dias"
- groupByCategory: array transações → objeto agrupado
- filterByDateRange: array + intervalo → transações filtradas
- sortByDate: array → ordenado por data
- calculatePercentage: valor parcial, total → percentual 1 casa decimal
- calculateDifference: 2 valores → diferença absoluta e percentual
- calculateInstallmentValue: valor total, parcelas → valor parcela
- isValidEmail, isValidCPF, isValidDate, isPositiveNumber
- generateUniqueId: UUID v4 ou crypto.randomUUID
- Organizar em arquivos separados por categoria
- JSDoc comments em cada função
- Testes unitários básicos

---

## 🎨 PROMPT 23: Responsividade e Ajustes Finais
**Status:** Pendente

**Objetivos:**
- Revisão completa de responsividade (ajustes incrementais apenas)
- Mobile-first: layout base sempre mobile, breakpoints evoluem
- Breakpoints oficiais: Mobile (<768px), Tablet (≥768px <1280px), Desktop (≥1280px <1920px), Wide (≥1920px)
- Layout fluido: width 100%, max-width para limitação
- Sidebar apenas desktop (≥1280px), não renderizar em mobile/tablet
- Header Mobile apenas <1280px, desaparece desktop
- Grids: 1 coluna (mobile), 2 colunas (tablet), 3-4 colunas (desktop), auto-fit/auto-fill
- Espaçamentos: px-4 (mobile), px-6 (tablet), px-8 (desktop)
- Tipografia: reduzir 15% mobile, evoluir progressivamente
- Tabela: cards verticais mobile, híbrida tablet, completa desktop
- Gráficos: adaptar altura, labels, tooltips
- Modais: 100% viewport mobile, max-width desktop
- Touch targets: 44x44px mínimo, espaços 8px mínimo, inputs 48px altura, font-size 16px mínimo
- Acessibilidade: navegação teclado, focus:ring, aria-label, alt, contraste 4.5:1
- Validação: 375px, 768px, 1280px, 1920px

---

## ✅ PROMPT 24: Testes e Validação Final
**Status:** Pendente

**Objetivos:**
- Fluxo teste completo: jornada usuário real
- Validação cálculos financeiros (valores conhecidos)
- Validação filtros combinados (contagem manual)
- Validação formatações (moeda R$ 1.234,56, data DD/MM/AAAA, percentual 35,5%)
- Validação responsividade (redimensionar gradualmente)
- Validação modais (centralização, overlay, fechamento)
- Validação acessibilidade (teclado, leitor de tela)
- Validação performance (DevTools, memory leaks)
- Correção bugs encontrados
- Tratamento erros: divisão por zero, arrays vazios, validação formulários
- Mensagens feedback: toasts sucesso/erro, estados vazios, validações
- Documentação comportamento não óbvio
- README.md: objetivo, tecnologias, instalação, estrutura, componentes

---

## 🎉 PROMPT FINAL: Revisão e Entrega
**Status:** Pendente

**Objetivos:**
- Checklist qualidade completo
- Revisão organização código (pastas, nomes, duplicação, tipos, imports)
- Revisão comentários e documentação (JSDoc, explicações, remoção obsoletos)
- Otimização performance (re-renders, imagens, bundle size)
- Preparação integração Supabase (comentários TODO, estrutura compatível)
- Documentação componentes principais (lista, responsabilidades, props, hooks)
- Relatório final: total componentes, linhas código, funcionalidades, próximos passos
- Celebração! Sistema completo e funcional

---

## Notas
- Cada prompt deve seguir o ciclo obrigatório: Rules → Figma → Execução → Build → Aprovação → Documentação → Commit
- Hierarquia de variáveis: Semântica → Primitiva → Conversão (NUNCA hardcoded)
- Build obrigatório antes de cada commit
- PROMPT 4: NÃO usar localStorage/sessionStorage, apenas React state
- Breakpoints: Mobile (<768px), Tablet (≥768px <1280px), Desktop (≥1280px <1920px), Wide (≥1920px)
