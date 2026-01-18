/**
 * Componente: FluxoFinanceiro
 * Gráfico de fluxo financeiro mensal com receitas e despesas
 * Conforme design Figma node 42-3123
 */

// Ícone de gráfico de barras - conforme Figma
const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3V21H21V19H5V3H3Z" />
    <path d="M7 14H9V18H7V14Z" />
    <path d="M11 10H13V18H11V10Z" />
    <path d="M15 6H17V18H15V6Z" />
    <path d="M19 12H21V18H19V12Z" />
  </svg>
)

const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
const yAxisLabels = ['R$ 17.500', 'R$ 15.000', 'R$ 12.500', 'R$ 10.000', 'R$ 7.500', 'R$ 5.000', 'R$ 2.500', 'R$ 0,00']

// SVG paths para o gráfico - curvas suaves conforme Figma
// Receitas: começa baixo, sobe até MAR-ABR, desce em JUN, sobe novamente até DEZ
const receitasPath = "M0,260 C20,250 40,220 80,150 C120,80 160,60 200,70 C240,80 280,90 320,100 C360,110 400,130 440,140 C480,150 520,130 560,100 C600,70 620,30 625,20"

// Despesas: começa baixo, sobe gradualmente, pico em JUN, desce e sobe no final
const despesasPath = "M0,260 C20,255 40,240 80,200 C120,160 160,140 200,150 C240,160 280,130 320,120 C360,110 400,140 440,160 C480,180 520,200 560,180 C600,160 620,140 625,130"

export default function FluxoFinanceiro() {
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
      <div className="flex flex-col gap-[32px] p-[32px] h-full">
        {/* Header */}
        <div className="flex flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-[8px] items-center">
            <ChartIcon />
            <h3 className="text-[20px] font-bold leading-[28px] text-text-primary">
              Fluxo financeiro
            </h3>
          </div>
          
          {/* Legenda */}
          <div className="flex gap-[8px] items-center">
            <div className="flex gap-[8px] items-center">
              <div className="w-[9px] h-[9px] rounded-full bg-[#C4E703]" />
              <span className="text-[12px] font-semibold leading-[16px] tracking-[0.3px] text-text-primary">
                Receitas
              </span>
            </div>
            <div className="flex gap-[8px] items-center">
              <div className="w-[9px] h-[9px] rounded-full bg-[#E61E32]" />
              <span className="text-[12px] font-semibold leading-[16px] tracking-[0.3px] text-text-primary">
                Despesas
              </span>
            </div>
          </div>
        </div>

        {/* Gráfico */}
        <div className="flex gap-[5px] items-end flex-1 min-h-[200px] lg:min-h-[280px]">
          {/* Eixo Y - Labels */}
          <div className="flex flex-col justify-between h-full shrink-0">
            {yAxisLabels.map((label, index) => (
              <span
                key={index}
                className="text-[12px] lg:text-[18px] font-normal leading-[20px] lg:leading-[28px] tracking-[0.3px] text-text-primary whitespace-nowrap"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Área do gráfico */}
          <div className="flex-1 h-full relative overflow-hidden">
            <svg
              className="w-full h-full"
              viewBox="0 0 625 280"
              preserveAspectRatio="none"
            >
              {/* Gradientes */}
              <defs>
                <linearGradient id="receitasGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EDFF8B" stopOpacity="0.87" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="despesasGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#EB4B5B" stopOpacity="0.51" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Área preenchida receitas (verde-limão) */}
              <path
                d={`${receitasPath} L625,280 L0,280 Z`}
                fill="url(#receitasGradient)"
              />

              {/* Área preenchida despesas (vermelho) */}
              <path
                d={`${despesasPath} L625,280 L0,280 Z`}
                fill="url(#despesasGradient)"
              />

              {/* Linha de receitas */}
              <path
                d={receitasPath}
                fill="none"
                stroke="#C4E703"
                strokeWidth="2"
              />

              {/* Linha de despesas */}
              <path
                d={despesasPath}
                fill="none"
                stroke="#E61E32"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>

        {/* Eixo X - Meses */}
        <div className="flex justify-between gap-[8px] lg:gap-[20px] overflow-x-auto">
          {months.map((month) => (
            <span
              key={month}
              className="text-[12px] lg:text-[14px] font-semibold leading-[16px] lg:leading-[20px] tracking-[0.3px] text-text-primary whitespace-nowrap"
            >
              {month}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
