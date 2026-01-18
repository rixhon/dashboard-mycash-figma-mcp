/**
 * Componente: CircularChart
 * Gráfico circular de progresso para exibir percentuais
 * Conforme design Figma node 42-3103
 */

interface CircularChartProps {
  percentage: number
  size?: number
  strokeWidth?: number
}

export default function CircularChart({
  percentage,
  size = 72,
  strokeWidth = 8,
}: CircularChartProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const center = size / 2

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Círculo de fundo */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#E7E8EA"
          strokeWidth={strokeWidth}
        />
        {/* Círculo de progresso */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#C4E703"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {/* Texto do percentual - posicionado conforme Figma */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[12px] font-normal leading-[16px] tracking-[0.3px] text-text-primary">
          {percentage}%
        </span>
      </div>
    </div>
  )
}
