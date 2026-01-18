/**
 * Página: Dashboard
 * Página principal do sistema com visão geral financeira
 * 
 * Layout responsivo:
 * - Mobile: 1 coluna, cards empilhados
 * - Tablet: 2 colunas quando faz sentido
 * - Desktop: Layout completo conforme Figma
 */

import {
  Navbar,
  ExpenseCard,
  SummaryCard,
  CardsContas,
  FluxoFinanceiro,
  ProximasDespesas,
  ExtratoDetalhado,
} from '@/components/dashboard'

// Ícone de cifrão ($) para Saldo total - conforme Figma
const DollarIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" />
  </svg>
)

// Ícone de seta para baixo (Receitas) - conforme Figma
const ArrowDownIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
    <path d="M11 4v12.17l-5.59-5.59L4 12l8 8 8-8-1.41-1.41L13 16.17V4h-2z" />
  </svg>
)

// Ícone de seta para cima (Despesas) - conforme Figma
const ArrowUpIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
    <path d="M13 20V7.83l5.59 5.59L20 12l-8-8-8 8 1.41 1.41L11 7.83V20h2z" />
  </svg>
)

// Dados mockados para os expense cards
const expenseCardsData = [
  { percentage: 25, title: 'Aluguel', value: 'R$ 4.000,00' },
  { percentage: 15, title: 'Alimentação', value: 'R$ 2.000,00' },
  { percentage: 5, title: 'Mercado', value: 'R$ 1.500,00' },
  { percentage: 3, title: 'Academia', value: 'R$ 120,00' },
]

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen bg-background-secondary overflow-x-hidden">
      {/* Container principal com padding e gap de 32px conforme Figma */}
      <div className="px-[16px] py-[12px] md:px-[24px] lg:px-[32px] lg:py-[12px] flex flex-col gap-[32px] w-full">
        {/* Navbar */}
        <Navbar />

        {/* Frame 34 - Seção superior */}
        <div className="flex flex-col lg:flex-row gap-[32px] w-full">
          {/* Coluna esquerda - Expense cards e Summary cards */}
          <div className="flex flex-col gap-[30px] w-full lg:flex-[1.5] min-w-0">
            {/* Expense Cards - Grid responsivo com gap de 18px */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px] lg:gap-[18px]">
              {expenseCardsData.map((card, index) => (
                <ExpenseCard
                  key={index}
                  percentage={card.percentage}
                  title={card.title}
                  value={card.value}
                />
              ))}
            </div>

            {/* Summary Cards com gap de 20px */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] lg:gap-[20px]">
              <SummaryCard
                icon={<DollarIcon color="#2A89EF" />}
                title="Saldo total"
                value="R$ 2.000,00"
                valueColor="blue"
              />
              <SummaryCard
                icon={<ArrowDownIcon color="#15BE78" />}
                title="Receitas"
                value="R$12.000,00"
                valueColor="green"
              />
              <SummaryCard
                icon={<ArrowUpIcon color="#E61E32" />}
                title="Despesas"
                value="R$ 10.000,00"
                valueColor="red"
              />
            </div>
          </div>

          {/* Coluna direita - Cards & Contas */}
          <CardsContas />
        </div>

        {/* Frame 35 - Seção do meio com gap de 32px */}
        <div className="flex flex-col lg:flex-row gap-[32px] w-full">
          {/* Fluxo Financeiro */}
          <div className="w-full lg:flex-[1.5] min-w-0">
            <FluxoFinanceiro />
          </div>

          {/* Próximas Despesas */}
          <div className="w-full lg:flex-1 min-w-0">
            <ProximasDespesas />
          </div>
        </div>

        {/* Extrato Detalhado */}
        <ExtratoDetalhado />
      </div>
    </div>
  )
}
