/**
 * Componente: ExpenseCard
 * Card de despesa com gráfico circular e valor
 * Conforme design Figma node 42-3103
 */

import CircularChart from './CircularChart'

interface ExpenseCardProps {
  percentage: number
  title: string
  value: string
}

export default function ExpenseCard({ percentage, title, value }: ExpenseCardProps) {
  return (
    <div
      className="
        bg-background-primary
        rounded-[20px]
        border border-border-light
        flex-1
        min-w-[140px]
      "
    >
      <div className="flex flex-col gap-[12px] items-center p-[24px]">
        {/* Gráfico circular */}
        <CircularChart percentage={percentage} size={72} strokeWidth={8} />
        
        {/* Informações */}
        <div className="flex flex-col gap-[4px] items-center text-center">
          <p className="text-[14px] font-normal leading-[20px] tracking-[0.3px] text-text-primary">
            {title}
          </p>
          <p className="text-[20px] font-bold leading-[28px] text-text-primary">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}
