/**
 * Componente: ExpenseCard
 * Card de categoria de despesa com gráfico donut e valor
 * 
 * Conforme documentação:
 * - Fundo branco, borda cinza clara
 * - Largura fixa de 160px (no carrossel) ou flex (no grid)
 * - Gráfico donut de 64px no topo
 * - Nome da categoria (12px, cinza médio, truncado se longo)
 * - Valor total (14px, negrito preto)
 * - Hover: borda muda para verde-limão
 */

import CircularChart from './CircularChart'

interface ExpenseCardProps {
  percentage: number
  title: string
  value: string
  colorIndex?: number // Índice para cor do gráfico
  isCarouselItem?: boolean // Se está no carrossel (largura fixa) ou grid (flex)
}

export default function ExpenseCard({ 
  percentage, 
  title, 
  value,
  colorIndex = 0,
  isCarouselItem = false,
}: ExpenseCardProps) {
  return (
    <div
      className={`
        bg-background-primary
        rounded-[20px]
        border border-border-light
        transition-colors duration-200
        hover:border-[#C4E703]
        ${isCarouselItem 
          ? 'w-[160px] flex-shrink-0' 
          : 'flex-1 min-w-[140px]'
        }
      `}
    >
      <div className="flex flex-col gap-[12px] items-center p-[24px]">
        {/* Gráfico donut com cor baseada no índice */}
        <CircularChart 
          percentage={percentage} 
          size={64} 
          strokeWidth={8}
          colorIndex={colorIndex}
        />
        
        {/* Informações */}
        <div className="flex flex-col gap-[4px] items-center text-center w-full">
          {/* Nome da categoria - truncado se muito longo */}
          <p 
            className="text-[12px] font-normal leading-[16px] tracking-[0.3px] text-gray-500 truncate max-w-full"
            title={title}
          >
            {title}
          </p>
          {/* Valor total */}
          <p className="text-[14px] font-bold leading-[20px] text-text-primary">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}
