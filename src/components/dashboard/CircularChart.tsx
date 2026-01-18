/**
 * Componente: CircularChart
 * Gráfico donut (rosca) para exibir percentuais por categoria
 * 
 * Conforme documentação:
 * - Diâmetro de 64px (padrão)
 * - Anel externo colorido representando o percentual
 * - Anel interno vazio (branco)
 * - Percentual no centro sobreposto
 * - Cores variam por índice: verde-limão, preto, cinza médio, cinza claro...
 */

/**
 * Array de cores para categorias (rotação)
 * 1º: verde-limão
 * 2º: preto
 * 3º: cinza médio
 * 4º: cinza claro
 */
const CATEGORY_COLORS = [
  '#C4E703', // verde-limão
  '#080B12', // preto
  '#6B7280', // cinza médio
  '#D1D5DB', // cinza claro
  '#C4E703', // verde-limão (rotação)
  '#080B12', // preto
  '#6B7280', // cinza médio
  '#D1D5DB', // cinza claro
]

interface CircularChartProps {
  percentage: number
  size?: number
  strokeWidth?: number
  colorIndex?: number // Índice para determinar a cor (0, 1, 2, 3...)
  color?: string // Cor customizada (sobrescreve colorIndex)
}

export default function CircularChart({
  percentage,
  size = 64,
  strokeWidth = 8,
  colorIndex = 0,
  color,
}: CircularChartProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const center = size / 2
  
  // Determina a cor do anel
  const strokeColor = color || CATEGORY_COLORS[colorIndex % CATEGORY_COLORS.length]

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Círculo de fundo (anel interno vazio/branco) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E7E8EA"
          strokeWidth={strokeWidth}
        />
        {/* Círculo de progresso (anel externo colorido) */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Texto do percentual no centro */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[12px] font-normal leading-[16px] tracking-[0.3px] text-text-primary">
          {percentage}%
        </span>
      </div>
    </div>
  )
}

export { CATEGORY_COLORS }
