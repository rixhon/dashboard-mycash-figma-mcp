/**
 * Componente: SummaryCard
 * Card de resumo financeiro (Saldo, Receitas, Despesas)
 * Conforme design Figma node 42-3108
 */

import { ReactNode } from 'react'

interface SummaryCardProps {
  icon: ReactNode
  title: string
  value: string
  valueColor: 'blue' | 'green' | 'red'
}

const colorMap = {
  blue: 'text-accent-blue',
  green: 'text-accent-green',
  red: 'text-accent-red',
}

export default function SummaryCard({ icon, title, value, valueColor }: SummaryCardProps) {
  return (
    <div
      className="
        bg-background-primary
        rounded-[20px]
        border border-border-light
        flex-1
        min-w-[200px]
      "
    >
      <div className="flex flex-col gap-[32px] p-[24px] h-full">
        {/* Ícone */}
        <div className="w-6 h-6">
          {icon}
        </div>
        
        {/* Conteúdo */}
        <div className="flex flex-col gap-[4px]">
          <p className="text-[18px] font-normal leading-[28px] tracking-[0.3px] text-text-primary">
            {title}
          </p>
          <p className={`text-[28px] font-bold leading-[36px] ${colorMap[valueColor]}`}>
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}
