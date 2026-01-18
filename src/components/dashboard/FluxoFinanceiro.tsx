/**
 * Componente: FluxoFinanceiro (FinancialFlowChart)
 * Gráfico de área (area chart) mostrando evolução de receitas e despesas
 * Implementado com Recharts para gráficos responsivos e interativos
 * 
 * Conforme documentação:
 * - Header com título "Fluxo Financeiro" e ícone de gráfico crescente
 * - Legenda horizontal: círculo verde-limão "Receitas", círculo preto "Despesas"
 * - Gráfico de área com altura fixa de 300px, largura responsiva (100%)
 * - Fundo cinza claro muito suave
 * - Eixo X: nomes dos meses abreviados (Jan, Fev, Mar...)
 * - Eixo Y: valores compactos (R$ 2k, R$ 4k...)
 * - Linhas de grid horizontais tracejadas sutis (cinza claríssimo)
 * - Tooltip interativo com linha vertical e valores formatados
 * - Dados dinâmicos do contexto global (transações agrupadas por mês)
 */

import { useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useFinance } from '@/contexts/FinanceContext'

// ============================================================================
// TIPOS
// ============================================================================

interface MonthlyData {
  month: string
  income: number
  expense: number
}

// ============================================================================
// ÍCONE
// ============================================================================

// Ícone de gráfico crescente - conforme documentação
const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
  </svg>
)

// ============================================================================
// CONSTANTES
// ============================================================================

// Meses abreviados para o eixo X
const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']

// Altura fixa do gráfico
const CHART_HEIGHT = 300

// Cores do design system
const COLORS = {
  income: '#C4E703',      // verde-limão
  expense: '#080B12',     // preto
  grid: '#E5E7EB',        // cinza claríssimo
  axisText: '#9CA3AF',    // cinza médio
  incomeText: '#166534',  // verde escuro para tooltip
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Formata valor monetário de forma compacta para eixo Y
 * Ex: 2000 -> "R$ 2k", 10000 -> "R$ 10k"
 */
function formatCompactCurrency(value: number): string {
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}k`
  }
  return `R$ ${value}`
}

/**
 * Formata valor monetário completo para tooltip
 * Ex: 12500 -> "R$ 12.500,00"
 */
function formatFullCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

// ============================================================================
// COMPONENTE: CustomTooltip
// ============================================================================

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
    color: string
  }>
  label?: string
}

/**
 * Tooltip customizado com fundo branco, sombra e valores formatados
 */
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const incomeValue = payload.find((p) => p.dataKey === 'income')?.value ?? 0
  const expenseValue = payload.find((p) => p.dataKey === 'expense')?.value ?? 0

  return (
    <div 
      className="
        bg-white 
        rounded-lg 
        shadow-xl 
        border border-gray-100
        p-3
        min-w-[160px]
      "
    >
      {/* Nome do mês em negrito */}
      <p className="text-[14px] font-bold text-gray-900 mb-2">
        {label}
      </p>
      
      {/* Receitas em verde escuro */}
      <p className="text-[13px] text-[#166534] mb-1">
        Receitas: {formatFullCurrency(incomeValue)}
      </p>
      
      {/* Despesas em preto */}
      <p className="text-[13px] text-gray-900">
        Despesas: {formatFullCurrency(expenseValue)}
      </p>
    </div>
  )
}

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

export default function FluxoFinanceiro() {
  const { transactions } = useFinance()
  
  // Calcula dados mensais dos últimos 7 meses a partir das transações reais
  const monthlyData = useMemo((): MonthlyData[] => {
    const now = new Date()
    const data: MonthlyData[] = []
    
    // Gera dados para os últimos 7 meses
    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1)
      const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0)
      
      // Filtra transações do mês
      const monthTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.date)
        return txDate >= monthStart && txDate <= monthEnd && tx.status === 'completed'
      })
      
      // Soma receitas e despesas
      const income = monthTransactions
        .filter(tx => tx.type === 'income')
        .reduce((sum, tx) => sum + tx.value, 0)
      
      const expense = monthTransactions
        .filter(tx => tx.type === 'expense')
        .reduce((sum, tx) => sum + tx.value, 0)
      
      data.push({
        month: MONTHS_SHORT[6 - i] || MONTHS_SHORT[targetDate.getMonth()],
        income,
        expense,
      })
    }
    
    return data
  }, [transactions])

  return (
    <div
      className="
        bg-background-primary
        rounded-[20px]
        border border-border-light
        w-full
        min-w-0
      "
    >
      <div className="flex flex-col gap-[24px] p-[24px] lg:p-[32px] h-full">
        {/* Header */}
        <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
          {/* Título com ícone de gráfico crescente */}
          <div className="flex gap-[8px] items-center">
            <span className="text-text-primary">
              <ChartIcon />
            </span>
            <h3 className="text-[18px] lg:text-[20px] font-bold leading-[28px] text-text-primary">
              Fluxo Financeiro
            </h3>
          </div>
          
          {/* Legenda horizontal */}
          <div className="flex gap-[16px] items-center">
            {/* Receitas - círculo verde-limão */}
            <div className="flex gap-[8px] items-center">
              <div className="w-[10px] h-[10px] rounded-full bg-[#C4E703]" />
              <span className="text-[12px] font-medium leading-[16px] text-gray-500">
                Receitas
              </span>
            </div>
            {/* Despesas - círculo preto */}
            <div className="flex gap-[8px] items-center">
              <div className="w-[10px] h-[10px] rounded-full bg-[#080B12]" />
              <span className="text-[12px] font-medium leading-[16px] text-gray-500">
                Despesas
              </span>
            </div>
          </div>
        </div>

        {/* Área do Gráfico - Recharts ResponsiveContainer */}
        <div 
          className="w-full bg-gray-50 rounded-lg overflow-hidden"
          style={{ height: CHART_HEIGHT }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyData}
              margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
            >
              {/* Definições de gradientes */}
              <defs>
                {/* Gradiente para área de receitas (verde-limão 30% opaco no topo) */}
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.income} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={COLORS.income} stopOpacity={0} />
                </linearGradient>
                {/* Gradiente para área de despesas (preto 10% opaco no topo) */}
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={COLORS.expense} stopOpacity={0.1} />
                  <stop offset="100%" stopColor={COLORS.expense} stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* Grid horizontal tracejado sutil */}
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={COLORS.grid}
                strokeOpacity={0.6}
                vertical={false}
              />

              {/* Eixo X - Meses abreviados */}
              <XAxis 
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: COLORS.axisText, 
                  fontSize: 12,
                  fontWeight: 400,
                }}
                dy={10}
              />

              {/* Eixo Y - Valores compactos */}
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fill: COLORS.axisText, 
                  fontSize: 12,
                  fontWeight: 400,
                }}
                tickFormatter={formatCompactCurrency}
                dx={-5}
                width={60}
              />

              {/* Tooltip interativo com linha vertical */}
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ 
                  stroke: COLORS.grid, 
                  strokeWidth: 1,
                  strokeDasharray: '4 4',
                }}
              />

              {/* Área de Receitas - verde-limão, linha 3px, curva suave */}
              <Area
                type="monotone"
                dataKey="income"
                stroke={COLORS.income}
                strokeWidth={3}
                fill="url(#incomeGradient)"
                dot={false}
                activeDot={{ 
                  r: 6, 
                  fill: COLORS.income,
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />

              {/* Área de Despesas - preto, linha 3px, curva suave */}
              <Area
                type="monotone"
                dataKey="expense"
                stroke={COLORS.expense}
                strokeWidth={3}
                fill="url(#expenseGradient)"
                dot={false}
                activeDot={{ 
                  r: 6, 
                  fill: COLORS.expense,
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
